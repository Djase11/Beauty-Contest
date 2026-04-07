import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Home from './screens/Home.jsx';
import Lobby from './screens/Lobby.jsx';
import Game from './screens/Game.jsx';
import Results from './screens/Results.jsx';
import FinalLeaderboard from './screens/FinalLeaderboard.jsx';

const SOCKET_URL = window.location.origin;

export default function App() {
  const socketRef = useRef(null);
  const [screen, setScreen] = useState('home');
  const [roomCode, setRoomCode] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [roomState, setRoomState] = useState(null);
  const [roundData, setRoundData] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [finalData, setFinalData] = useState(null);
  const [error, setError] = useState('');
  const [submissionCount, setSubmissionCount] = useState({ submitted: 0, total: 0 });

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('room_created', ({ code, playerId }) => {
      setRoomCode(code); setPlayerId(playerId); setScreen('lobby');
    });
    socket.on('room_joined', ({ code, playerId }) => {
      setRoomCode(code); setPlayerId(playerId); setScreen('lobby');
    });
    socket.on('room_update', (state) => { setRoomState(state); });
    socket.on('round_start', (data) => { setRoundData(data); setSubmissionCount({ submitted: 0, total: 0 }); setScreen('game'); });
    socket.on('submission_count', (data) => setSubmissionCount(data));
    socket.on('round_results', (data) => { setResultsData(data); setScreen('results'); });
    socket.on('game_over', (data) => { setFinalData(data); setScreen('final'); });
    socket.on('error', (msg) => setError(msg));
    socket.on('player_left', ({ name }) => setError(`${name} left the game.`));

    return () => socket.disconnect();
  }, []);

  const emit = (event, data) => socketRef.current?.emit(event, data);

  const handleCreateRoom = (name, totalRounds) => {
    setError('');
    emit('create_room', { name, totalRounds });
  };

  const handleJoinRoom = (code, name) => {
    setError('');
    emit('join_room', { code: code.toUpperCase(), name });
  };

  const handleStartGame = () => emit('start_game', { code: roomCode });
  const handleSubmit = (number) => emit('submit_number', { code: roomCode, number });
  const handleNextRound = () => emit('next_round', { code: roomCode });

  const handlePlayAgain = () => {
    setScreen('home');
    setRoomCode('');
    setPlayerId('');
    setRoomState(null);
    setRoundData(null);
    setResultsData(null);
    setFinalData(null);
    setError('');
  };

  const isHost = roomState?.host === playerId;

  return (
    <div>
      {screen === 'home' && <Home onCreate={handleCreateRoom} onJoin={handleJoinRoom} error={error} setError={setError} />}
      {screen === 'lobby' && <Lobby roomCode={roomCode} roomState={roomState} isHost={isHost} onStart={handleStartGame} error={error} />}
      {screen === 'game' && <Game roundData={roundData} roomState={roomState} submissionCount={submissionCount} onSubmit={handleSubmit} playerId={playerId} />}
      {screen === 'results' && <Results resultsData={resultsData} playerId={playerId} isHost={isHost} onNext={handleNextRound} />}
      {screen === 'final' && <FinalLeaderboard finalData={finalData} playerId={playerId} onPlayAgain={handlePlayAgain} />}
    </div>
  );
}
