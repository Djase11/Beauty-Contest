const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, 'client/dist')));

const rooms = {};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

function calculateResults(submissions) {
  const nums = Object.values(submissions).map(s => s.number);
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  const target = avg * 0.8;
  let closest = null;
  let minDiff = Infinity;
  for (const [id, sub] of Object.entries(submissions)) {
    const diff = Math.abs(sub.number - target);
    if (diff < minDiff) { minDiff = diff; closest = id; }
  }
  return { target: parseFloat(target.toFixed(2)), average: parseFloat(avg.toFixed(2)), winnerId: closest };
}

function getRoomState(code) {
  const room = rooms[code];
  if (!room) return null;
  return { players: room.players, totalRounds: room.totalRounds, currentRound: room.currentRound, phase: room.phase, host: room.host };
}

function startRound(code) {
  const room = rooms[code];
  room.currentRound += 1;
  room.phase = 'playing';
  room.submissions = {};
  io.to(code).emit('round_start', { round: room.currentRound, totalRounds: room.totalRounds, duration: 30 });
  room.timer = setTimeout(() => endRound(code), 30000);
}

function endRound(code) {
  const room = rooms[code];
  if (!room || room.phase !== 'playing') return;
  room.phase = 'results';
  for (const id of Object.keys(room.players)) {
    if (!room.submissions[id]) {
      room.submissions[id] = { number: 50, name: room.players[id].name, timedOut: true };
    }
  }
  const { target, average, winnerId } = calculateResults(room.submissions);
  if (winnerId && room.players[winnerId]) room.players[winnerId].score += 1;
  io.to(code).emit('round_results', {
    submissions: room.submissions, target, average, winnerId,
    winnerName: winnerId ? room.players[winnerId]?.name : null,
    players: room.players, currentRound: room.currentRound,
    totalRounds: room.totalRounds, isLastRound: room.currentRound >= room.totalRounds,
  });
}

function endGame(code) {
  const room = rooms[code];
  room.phase = 'ended';
  const sorted = Object.entries(room.players)
    .map(([id, p]) => ({ id, name: p.name, score: p.score }))
    .sort((a, b) => b.score - a.score);
  io.to(code).emit('game_over', { leaderboard: sorted });
}

io.on('connection', (socket) => {
  socket.on('create_room', ({ name, totalRounds }) => {
    const code = generateRoomCode();
    rooms[code] = { host: socket.id, players: { [socket.id]: { name, score: 0, isHost: true } }, totalRounds, currentRound: 0, phase: 'lobby', submissions: {}, timer: null };
    socket.join(code);
    socket.emit('room_created', { code, playerId: socket.id });
    io.to(code).emit('room_update', getRoomState(code));
  });

  socket.on('join_room', ({ code, name }) => {
    const room = rooms[code];
    if (!room) return socket.emit('error', 'Room not found.');
    if (room.phase !== 'lobby') return socket.emit('error', 'Game already started.');
    if (Object.keys(room.players).length >= 10) return socket.emit('error', 'Room is full.');
    room.players[socket.id] = { name, score: 0, isHost: false };
    socket.join(code);
    socket.emit('room_joined', { code, playerId: socket.id });
    io.to(code).emit('room_update', getRoomState(code));
  });

  socket.on('start_game', ({ code }) => {
    const room = rooms[code];
    if (!room || room.host !== socket.id) return;
    if (Object.keys(room.players).length < 2) return socket.emit('error', 'Need at least 2 players.');
    startRound(code);
  });

  socket.on('submit_number', ({ code, number }) => {
    const room = rooms[code];
    if (!room || room.phase !== 'playing') return;
    if (room.submissions[socket.id]) return;
    const n = Math.max(0, Math.min(100, parseFloat(number)));
    room.submissions[socket.id] = { number: n, name: room.players[socket.id]?.name };
    io.to(code).emit('submission_count', { submitted: Object.keys(room.submissions).length, total: Object.keys(room.players).length });
    if (Object.keys(room.submissions).length === Object.keys(room.players).length) {
      clearTimeout(room.timer);
      endRound(code);
    }
  });

  socket.on('next_round', ({ code }) => {
    const room = rooms[code];
    if (!room || room.host !== socket.id) return;
    if (room.currentRound >= room.totalRounds) endGame(code);
    else startRound(code);
  });

  socket.on('disconnect', () => {
    for (const [code, room] of Object.entries(rooms)) {
      if (room.players[socket.id]) {
        const leavingName = room.players[socket.id].name;
        delete room.players[socket.id];
        if (Object.keys(room.players).length === 0) { clearTimeout(room.timer); delete rooms[code]; }
        else {
          if (room.host === socket.id) { room.host = Object.keys(room.players)[0]; room.players[room.host].isHost = true; }
          io.to(code).emit('room_update', getRoomState(code));
          io.to(code).emit('player_left', { name: leavingName });
        }
      }
    }
  });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/dist/index.html')));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));
