import React, { useState, useEffect, useRef } from 'react';

export default function Game({ roundData, roomState, submissionCount, onSubmit, playerId }) {
  const [number, setNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(roundData?.duration || 30);
  const timerRef = useRef(null);

  useEffect(() => {
    setSubmitted(false);
    setNumber('');
    setTimeLeft(roundData?.duration || 30);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [roundData?.round]);

  const handleSubmit = () => {
    const n = parseFloat(number);
    if (isNaN(n) || n < 0 || n > 100) return;
    onSubmit(n);
    setSubmitted(true);
    clearInterval(timerRef.current);
  };

  const progress = (timeLeft / (roundData?.duration || 30)) * 100;
  const isUrgent = timeLeft <= 10;

  return (
    <div style={styles.container}>
      <div style={styles.bg} />
      <div style={styles.inner}>
        <div style={styles.topBar}>
          <div style={styles.roundInfo}>
            <span style={styles.roundLabel}>Round</span>
            <span style={styles.roundNum}>{roundData?.round} / {roundData?.totalRounds}</span>
          </div>
          <div style={{ ...styles.timer, ...(isUrgent ? styles.timerUrgent : {}) }}>
            <span style={styles.timerNum}>{timeLeft}</span>
            <span style={styles.timerSec}>sec</span>
          </div>
        </div>

        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%`, background: isUrgent ? 'var(--accent)' : 'var(--accent2)', transition: 'width 1s linear, background 0.3s' }} />
        </div>

        <div style={styles.mainCard}>
          <p style={styles.question}>Pick a number between <span style={styles.hl}>0</span> and <span style={styles.hl}>100</span></p>
          <p style={styles.subq}>Closest to <strong>0.8 × the average</strong> of all picks wins</p>

          {!submitted ? (
            <div style={styles.inputArea}>
              <input
                type="number"
                className="input-field"
                style={styles.numInput}
                min="0" max="100"
                placeholder="0 – 100"
                value={number}
                onChange={e => setNumber(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
                disabled={timeLeft === 0}
              />
              <button className="btn-primary" style={styles.submitBtn} onClick={handleSubmit} disabled={number === '' || timeLeft === 0}>
                Lock In
              </button>
            </div>
          ) : (
            <div style={styles.lockedIn}>
              <div style={styles.lockIcon}>🔒</div>
              <p style={styles.lockText}>Locked in: <strong style={{ color: 'var(--accent2)', fontSize: 28 }}>{number}</strong></p>
              <p style={styles.lockSub}>Waiting for others...</p>
            </div>
          )}
        </div>

        <div style={styles.submissionBar}>
          <span style={styles.subLabel}>Submitted</span>
          <div style={styles.subDots}>
            {Array.from({ length: submissionCount.total || Object.keys(roomState?.players || {}).length }).map((_, i) => (
              <div key={i} style={{ ...styles.dot, ...(i < submissionCount.submitted ? styles.dotFilled : {}) }} />
            ))}
          </div>
          <span style={styles.subCount}>{submissionCount.submitted}/{submissionCount.total || Object.keys(roomState?.players || {}).length}</span>
        </div>

        {timeLeft === 0 && !submitted && (
          <div style={styles.timedOut}>⏱ Time's up! A default number was submitted for you.</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' },
  bg: { position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, #0d0a1a 0%, #0a0a0f 70%)', zIndex: -1 },
  inner: { width: '100%', maxWidth: 480, animation: 'fadeUp 0.3s ease' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  roundInfo: { display: 'flex', flexDirection: 'column' },
  roundLabel: { fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 },
  roundNum: { fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text)', letterSpacing: 2 },
  timer: { textAlign: 'right', transition: 'color 0.3s' },
  timerUrgent: { color: 'var(--accent)' },
  timerNum: { fontFamily: 'var(--font-display)', fontSize: 48, lineHeight: 1 },
  timerSec: { fontSize: 12, color: 'var(--muted)', marginLeft: 4 },
  progressBar: { height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 24, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  mainCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '32px 24px', marginBottom: 16, textAlign: 'center' },
  question: { fontSize: 20, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 },
  hl: { color: 'var(--accent2)', fontWeight: 700 },
  subq: { fontSize: 13, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.5 },
  inputArea: { display: 'flex', gap: 10, alignItems: 'center' },
  numInput: { flex: 1, fontSize: 24, textAlign: 'center', fontWeight: 700, padding: '14px' },
  submitBtn: { padding: '14px 20px', fontSize: 15, whiteSpace: 'nowrap' },
  lockedIn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  lockIcon: { fontSize: 36 },
  lockText: { fontSize: 18, color: 'var(--text)' },
  lockSub: { fontSize: 13, color: 'var(--muted)', animation: 'pulse 1.5s ease infinite' },
  submissionBar: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 },
  subLabel: { fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' },
  subDots: { display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' },
  dot: { width: 12, height: 12, borderRadius: '50%', background: 'var(--border)', transition: 'background 0.2s' },
  dotFilled: { background: 'var(--green)' },
  subCount: { fontSize: 13, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' },
  timedOut: { marginTop: 12, textAlign: 'center', fontSize: 13, color: 'var(--accent)', background: '#2a0a0a', border: '1px solid var(--accent)', borderRadius: 6, padding: '10px' },
};
