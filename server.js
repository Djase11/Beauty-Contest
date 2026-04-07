const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// rooms[roomCode] = { hostId, players: { id: {name, score, submitted} }, rounds, currentRound, phase, submissions }
const rooms = {};

function generateCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

function calculateWinner(submissions) {
  const values = Object.values(submissions).map((s) => s.number);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const target = avg * 0.8;

  let closest = null;
  let minDiff = Infinity;

  for (const [id, s] of Object.entries(submissions)) {
    const diff = Math.abs(s.number - target);
    if (diff < minDiff) {
      minDiff = diff;
      closest = id;
    }
  }
  return { target: parseFloat(target.toFixed(2)), winnerId: closest, average: parseFloat(avg.toFixed(2)) };
}

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // Host creates a room
  socket.on("create_room", ({ name, rounds }) => {
    const code = generateCode();
    rooms[code] = {
      hostId: socket.id,
      hostName: name,
      players: { [socket.id]: { name, score: 0, submitted: false } },
      rounds: parseInt(rounds) || 3,
      currentRound: 0,
      phase: "lobby", // lobby | playing | results | final
      submissions: {},
    };
    socket.join(code);
    socket.emit("room_created", { code, playerId: socket.id });
    socket.emit("room_update", sanitizeRoom(rooms[code], socket.id));
    console.log(`Room ${code} created by ${name}`);
  });

  // Player joins a room
  socket.on("join_room", ({ code, name }) => {
    const room = rooms[code];
    if (!room) return socket.emit("error", "Room not found.");
    if (room.phase !== "lobby") return socket.emit("error", "Game already started.");
    if (Object.keys(room.players).length >= 10) return socket.emit("error", "Room is full.");

    room.players[socket.id] = { name, score: 0, submitted: false };
    socket.join(code);
    socket.emit("room_joined", { code, playerId: socket.id });
    io.to(code).emit("room_update", sanitizeRoom(room, socket.id));
    console.log(`${name} joined room ${code}`);
  });

  // Host starts the game
  socket.on("start_game", ({ code }) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id) return;
    if (Object.keys(room.players).length < 2) return socket.emit("error", "Need at least 2 players.");

    room.phase = "playing";
    room.currentRound = 1;
    room.submissions = {};
    Object.values(room.players).forEach((p) => (p.submitted = false));

    io.to(code).emit("game_started", { round: room.currentRound, totalRounds: room.rounds });
    io.to(code).emit("room_update", sanitizeRoom(room, socket.id));
  });

  // Player submits a number
  socket.on("submit_number", ({ code, number }) => {
    const room = rooms[code];
    if (!room || room.phase !== "playing") return;
    if (number < 0 || number > 100) return socket.emit("error", "Number must be between 0 and 100.");
    if (room.submissions[socket.id]) return socket.emit("error", "Already submitted.");

    room.submissions[socket.id] = { number: parseFloat(number), name: room.players[socket.id]?.name };
    room.players[socket.id].submitted = true;

    io.to(code).emit("submission_update", {
      submitted: Object.keys(room.submissions).length,
      total: Object.keys(room.players).length,
    });

    // All players submitted
    if (Object.keys(room.submissions).length === Object.keys(room.players).length) {
      const { target, winnerId, average } = calculateWinner(room.submissions);

      // Update scores
      if (room.players[winnerId]) room.players[winnerId].score += 1;

      const roundResults = {
        round: room.currentRound,
        totalRounds: room.rounds,
        average,
        target,
        winnerId,
        winnerName: room.players[winnerId]?.name || "Unknown",
        submissions: Object.entries(room.submissions).map(([id, s]) => ({
          id,
          name: s.name,
          number: s.number,
          isWinner: id === winnerId,
        })),
        scores: Object.entries(room.players).map(([id, p]) => ({
          id,
          name: p.name,
          score: p.score,
        })),
      };

      if (room.currentRound >= room.rounds) {
        room.phase = "final";
        io.to(code).emit("game_over", roundResults);
      } else {
        room.phase = "results";
        io.to(code).emit("round_results", roundResults);
      }
    }
  });

  // Host starts next round
  socket.on("next_round", ({ code }) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id) return;

    room.currentRound += 1;
    room.phase = "playing";
    room.submissions = {};
    Object.values(room.players).forEach((p) => (p.submitted = false));

    io.to(code).emit("round_started", { round: room.currentRound, totalRounds: room.rounds });
    io.to(code).emit("room_update", sanitizeRoom(room, socket.id));
  });

  // Player leaves / disconnects
  socket.on("disconnect", () => {
    for (const [code, room] of Object.entries(rooms)) {
      if (room.players[socket.id]) {
        delete room.players[socket.id];
        delete room.submissions[socket.id];
        if (Object.keys(room.players).length === 0) {
          delete rooms[code];
        } else {
          if (room.hostId === socket.id) {
            room.hostId = Object.keys(room.players)[0];
          }
          io.to(code).emit("room_update", sanitizeRoom(room, null));
          io.to(code).emit("player_left", { message: "A player disconnected." });
        }
      }
    }
  });
});

function sanitizeRoom(room, requesterId) {
  return {
    hostId: room.hostId,
    hostName: room.hostName,
    phase: room.phase,
    currentRound: room.currentRound,
    totalRounds: room.rounds,
    players: Object.entries(room.players).map(([id, p]) => ({
      id,
      name: p.name,
      score: p.score,
      submitted: p.submitted,
      isHost: id === room.hostId,
    })),
    isHost: requesterId === room.hostId,
  };
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Beauty Contest server running on port ${PORT}`));
