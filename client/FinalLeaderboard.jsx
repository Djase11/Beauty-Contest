import React from 'react';

export default function FinalLeaderboard({ finalData, playerId, onPlayAgain }) {
  if (!finalData) return null;
  const { leaderboard } = finalData;
  const medals = ['🥇', '🥈', '🥉'];

  const winner = leaderboard[0];
  const youWon = winner?.id === playerId;

  return (
    <div style={styles.container}>
      <div style={styles.bg} />
      <div style={styles.inner}>
        <div style={styles.header}>
          <div style={styles.diamond}>◆</div>
          <h1 style={styles.title}>GAME OVER</h1>
          <p style={styles.winnerAnnounce}>
            {youWon ? '🏆 You win the game!' : `${winner?.name} wins the game!`}
          </p>
        </div>

        <div style={styles.podium}>
          {leaderboard.slice(0, 3).map((p, i) => (
            <div key={p.id} style={{ ...styles.podiumItem, ...(i === 0 ? styles.podiumFirst : {}) }}>
              <span style={styles.medal}>{medals[i] || `#${i + 1}`}</span>
              <div style={{ ...styles.podiumAvatar, ...(i === 0 ? styles.podiumAvatarFirst : {}) }}>
                {p.name[0].toUpperCase()}
              </div>
              <span style={styles.podiumName}>{p.name}{p.id === playerId ? ' (you)' : ''}</span>
              <span style={styles.podiumScore}>{p.score} pt{p.score !== 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>

        {leaderboard.length > 3 && (
          <div style={styles.restCard}>
            {leaderboard.slice(3).map((p, i) => (
              <div key={p.id} style={styles.restRow}>
                <span style={styles.restRank}>#{i + 4}</span>
                <span style={styles.restName}>{p.name}{p.id === playerId ? ' (you)' : ''}</span>
                <span style={styles.restScore}>{p.score} pt{p.score !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        )}

        <button className="btn-primary" style={{ width: '100%', fontSize: 17, padding: '16px', marginTop: 8 }} onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' },
  bg: { position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 20%, #1a140a 0%, #0a0a0f 70%)', zIndex: -1 },
  inner: { width: '100%', maxWidth: 480, animation: 'fadeUp 0.4s ease', display: 'flex', flexDirection: 'column', gap: 16 },
  header: { textAlign: 'center' },
  diamond: { fontSize: 40, color: 'var(--gold)', marginBottom: 4 },
  title: { fontFamily: 'var(--font-display)', fontSize: 56, letterSpacing: 6, color: 'var(--text)', lineHeight: 1 },
  winnerAnnounce: { fontSize: 18, fontWeight: 600, color: 'var(--accent2)', marginTop: 10 },
  podium: { display: 'flex', justifyContent: 'center', gap: 16, alignItems: 'flex-end' },
  podiumItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', flex: 1 },
  podiumFirst: { background: '#1a1400', border: '1px solid var(--gold)', transform: 'scale(1.06)', transformOrigin: 'bottom center' },
  medal: { fontSize: 28 },
  podiumAvatar: { width: 48, height: 48, borderRadius: '50%', background: 'var(--surface2)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 },
  podiumAvatarFirst: { background: '#2a2000', border: '2px solid var(--gold)' },
  podiumName: { fontSize: 13, fontWeight: 600, textAlign: 'center', lineHeight: 1.3 },
  podiumScore: { fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--accent2)', letterSpacing: 1 },
  restCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' },
  restRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--border)' },
  restRank: { fontSize: 12, color: 'var(--muted)', width: 24 },
  restName: { flex: 1, fontSize: 14 },
  restScore: { fontWeight: 700, color: 'var(--muted)', fontSize: 14 },
};
