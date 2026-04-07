import React from 'react';

export default function Results({ resultsData, playerId, isHost, onNext }) {
  if (!resultsData) return null;
  const { submissions, target, average, winnerId, winnerName, players, currentRound, totalRounds, isLastRound } = resultsData;

  const sortedPlayers = Object.entries(players).sort((a, b) => b[1].score - a[1].score);
  const sortedSubmissions = Object.entries(submissions).sort((a, b) => {
    const da = Math.abs(a[1].number - target);
    const db = Math.abs(b[1].number - target);
    return da - db;
  });

  const youWon = winnerId === playerId;

  return (
    <div style={styles.container}>
      <div style={styles.bg} />
      <div style={styles.inner}>
        <div style={styles.header}>
          <p style={styles.roundLabel}>Round {currentRound} Results</p>
          {winnerName && (
            <div style={{ ...styles.winnerBanner, ...(youWon ? styles.winnerBannerYou : {}) }}>
              <span style={styles.winnerIcon}>{youWon ? '🏆' : '👑'}</span>
              <span style={styles.winnerText}>{youWon ? 'You won this round!' : `${winnerName} wins!`}</span>
            </div>
          )}
        </div>

        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Average</span>
            <span style={styles.statVal}>{average}</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.stat}>
            <span style={styles.statLabel}>Target (×0.8)</span>
            <span style={{ ...styles.statVal, color: 'var(--accent)' }}>{target}</span>
          </div>
        </div>

        <div style={styles.card}>
          <p style={styles.sectionLabel}>All Picks</p>
          {sortedSubmissions.map(([id, sub]) => {
            const diff = Math.abs(sub.number - target).toFixed(2);
            const isWinner = id === winnerId;
            const isMe = id === playerId;
            return (
              <div key={id} style={{ ...styles.subRow, ...(isWinner ? styles.subRowWinner : {}), ...(isMe ? styles.subRowMe : {}) }}>
                <div style={styles.subName}>
                  {isWinner && <span style={styles.crown}>👑</span>}
                  <span>{sub.name}</span>
                  {isMe && <span style={styles.meBadge}>you</span>}
                  {sub.timedOut && <span style={styles.timeoutBadge}>timed out</span>}
                </div>
                <div style={styles.subRight}>
                  <span style={styles.subNumber}>{sub.number}</span>
                  <span style={styles.subDiff}>±{diff}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.card}>
          <p style={styles.sectionLabel}>Scores</p>
          {sortedPlayers.map(([id, p], i) => (
            <div key={id} style={styles.scoreRow}>
              <span style={styles.scoreRank}>#{i + 1}</span>
              <span style={styles.scoreName}>{p.name}{id === playerId ? ' (you)' : ''}</span>
              <span style={styles.scoreVal}>{p.score} pt{p.score !== 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>

        {isHost ? (
          <button className="btn-primary" style={{ width: '100%', fontSize: 17, padding: '16px' }} onClick={onNext}>
            {isLastRound ? 'See Final Results' : 'Next Round →'}
          </button>
        ) : (
          <div style={styles.waiting}>
            <div style={styles.spinner} />
            <p style={styles.waitingText}>Waiting for host to continue...</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' },
  bg: { position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, #0a120a 0%, #0a0a0f 70%)', zIndex: -1 },
  inner: { width: '100%', maxWidth: 480, animation: 'fadeUp 0.3s ease', display: 'flex', flexDirection: 'column', gap: 14 },
  header: { textAlign: 'center' },
  roundLabel: { fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  winnerBanner: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 },
  winnerBannerYou: { background: '#0a1f0a', border: '1px solid var(--green)' },
  winnerIcon: { fontSize: 24 },
  winnerText: { fontSize: 18, fontWeight: 700 },
  statsRow: { display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' },
  stat: { flex: 1, padding: '16px', textAlign: 'center' },
  statLabel: { display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--text)', letterSpacing: 2 },
  statDivider: { width: 1, background: 'var(--border)' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, padding: '12px 16px', borderBottom: '1px solid var(--border)' },
  subRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--border)' },
  subRowWinner: { background: '#0a1f0a' },
  subRowMe: { background: 'var(--surface2)' },
  subName: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 },
  crown: { fontSize: 16 },
  meBadge: { background: 'var(--accent)', color: 'white', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  timeoutBadge: { background: 'var(--surface2)', color: 'var(--muted)', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4, textTransform: 'uppercase' },
  subRight: { display: 'flex', gap: 12, alignItems: 'center' },
  subNumber: { fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 1 },
  subDiff: { fontSize: 12, color: 'var(--muted)' },
  scoreRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--border)' },
  scoreRank: { fontSize: 12, color: 'var(--muted)', width: 24 },
  scoreName: { flex: 1, fontSize: 14 },
  scoreVal: { fontWeight: 700, color: 'var(--accent2)', fontSize: 14 },
  waiting: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px' },
  spinner: { width: 20, height: 20, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' },
  waitingText: { color: 'var(--muted)', fontSize: 14 },
};
