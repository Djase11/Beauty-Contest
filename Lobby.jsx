import React from 'react';

export default function Lobby({ roomCode, roomState, isHost, onStart, error }) {
  const players = roomState ? Object.entries(roomState.players) : [];

  return (
    <div style={styles.container}>
      <div style={styles.bg} />
      <div style={styles.inner}>
        <div style={styles.codeBox}>
          <p style={styles.codeLabel}>Room Code</p>
          <div style={styles.code}>{roomCode}</div>
          <p style={styles.codeHint}>Share this code with your friends</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>Players — {players.length}/10</span>
            <span style={styles.rounds}>{roomState?.totalRounds} round{roomState?.totalRounds !== 1 ? 's' : ''}</span>
          </div>
          <div style={styles.playerList}>
            {players.map(([id, p]) => (
              <div key={id} style={styles.playerRow}>
                <div style={styles.avatar}>{p.name[0].toUpperCase()}</div>
                <span style={styles.playerName}>{p.name}</span>
                {p.isHost && <span style={styles.hostBadge}>HOST</span>}
              </div>
            ))}
            {players.length === 0 && <p style={styles.empty}>Waiting for players...</p>}
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {isHost ? (
          <div>
            <button className="btn-primary" style={{ width: '100%', fontSize: 18, padding: '16px' }} onClick={onStart} disabled={players.length < 2}>
              {players.length < 2 ? 'Waiting for more players...' : 'Start Game'}
            </button>
            {players.length < 2 && <p style={styles.hint}>Need at least 2 players to start</p>}
          </div>
        ) : (
          <div style={styles.waitingHost}>
            <div style={styles.spinner} />
            <p style={styles.waitingText}>Waiting for host to start the game...</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' },
  bg: { position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, #1a0a14 0%, #0a0a0f 70%)', zIndex: -1 },
  inner: { width: '100%', maxWidth: 480, animation: 'fadeUp 0.4s ease' },
  codeBox: { textAlign: 'center', marginBottom: 24 },
  codeLabel: { fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  code: { fontFamily: 'var(--font-display)', fontSize: 64, letterSpacing: 12, color: 'var(--accent)', lineHeight: 1 },
  codeHint: { fontSize: 13, color: 'var(--muted)', marginTop: 8 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 16, overflow: 'hidden' },
  cardHeader: { padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 },
  rounds: { fontSize: 12, color: 'var(--accent2)', fontWeight: 600 },
  playerList: { padding: '8px 0' },
  playerRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 },
  playerName: { flex: 1, fontSize: 15, fontWeight: 500 },
  hostBadge: { background: 'var(--surface2)', border: '1px solid var(--accent2)', color: 'var(--accent2)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: 0.5 },
  empty: { padding: '20px', color: 'var(--muted)', textAlign: 'center', fontSize: 14 },
  error: { padding: '10px 14px', background: '#2a0a0a', border: '1px solid var(--accent)', borderRadius: 6, color: 'var(--accent)', fontSize: 13, marginBottom: 16 },
  hint: { textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 10 },
  waitingHost: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '20px' },
  spinner: { width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' },
  waitingText: { color: 'var(--muted)', fontSize: 14 },
};
