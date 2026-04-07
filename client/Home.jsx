import React, { useState } from 'react';

export default function Home({ onCreate, onJoin, error, setError }) {
  const [tab, setTab] = useState('create');
  const [name, setName] = useState('');
  const [rounds, setRounds] = useState(3);
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');

  return (
    <div style={styles.container}>
      <div style={styles.bg} />
      <div style={styles.inner}>
        <div style={styles.header}>
          <div style={styles.diamond}>◆</div>
          <h1 style={styles.title}>BEAUTY CONTEST</h1>
          <p style={styles.subtitle}>King of Diamonds — Alice in Borderland</p>
          <p style={styles.rule}>Pick a number 0–100. The closest to <span style={styles.highlight}>0.8 × the average</span> wins.</p>
        </div>

        <div style={styles.card}>
          <div style={styles.tabs}>
            <button style={{ ...styles.tab, ...(tab === 'create' ? styles.tabActive : {}) }} onClick={() => { setTab('create'); setError(''); }}>Create Room</button>
            <button style={{ ...styles.tab, ...(tab === 'join' ? styles.tabActive : {}) }} onClick={() => { setTab('join'); setError(''); }}>Join Room</button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {tab === 'create' ? (
            <div style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Your Name</label>
                <input className="input-field" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} maxLength={20} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Number of Rounds</label>
                <div style={styles.roundsPicker}>
                  {[1,2,3,5,7,10].map(n => (
                    <button key={n} style={{ ...styles.roundBtn, ...(rounds === n ? styles.roundBtnActive : {}) }} onClick={() => setRounds(n)}>{n}</button>
                  ))}
                </div>
              </div>
              <button className="btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={() => name.trim() && onCreate(name.trim(), rounds)} disabled={!name.trim()}>
                Create Room
              </button>
            </div>
          ) : (
            <div style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Room Code</label>
                <input className="input-field" placeholder="Enter 5-letter code" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} maxLength={5} style={{ letterSpacing: '4px', textTransform: 'uppercase' }} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Your Name</label>
                <input className="input-field" placeholder="Enter your name" value={joinName} onChange={e => setJoinName(e.target.value)} maxLength={20} />
              </div>
              <button className="btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={() => joinCode.trim() && joinName.trim() && onJoin(joinCode.trim(), joinName.trim())} disabled={!joinCode.trim() || !joinName.trim()}>
                Join Room
              </button>
            </div>
          )}
        </div>

        <div style={styles.rulesCard}>
          <h3 style={styles.rulesTitle}>How to Play</h3>
          <div style={styles.ruleItem}><span style={styles.ruleNum}>1</span>All players simultaneously pick a number between 0 and 100</div>
          <div style={styles.ruleItem}><span style={styles.ruleNum}>2</span>The target is calculated: <strong>0.8 × average of all picks</strong></div>
          <div style={styles.ruleItem}><span style={styles.ruleNum}>3</span>The player closest to the target wins the round</div>
          <div style={styles.ruleItem}><span style={styles.ruleNum}>4</span>Most rounds won takes the game</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' },
  bg: { position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, #1a0a14 0%, #0a0a0f 70%)', zIndex: -1 },
  inner: { width: '100%', maxWidth: 480, animation: 'fadeUp 0.5s ease' },
  header: { textAlign: 'center', marginBottom: 32 },
  diamond: { fontSize: 48, color: 'var(--accent)', lineHeight: 1, marginBottom: 8 },
  title: { fontFamily: 'var(--font-display)', fontSize: 52, letterSpacing: 4, color: 'var(--text)', lineHeight: 1 },
  subtitle: { color: 'var(--muted)', fontSize: 13, marginTop: 6, letterSpacing: 1, textTransform: 'uppercase' },
  rule: { color: 'var(--text)', fontSize: 14, marginTop: 14, opacity: 0.8, lineHeight: 1.5 },
  highlight: { color: 'var(--accent2)', fontWeight: 700 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  tabs: { display: 'flex', borderBottom: '1px solid var(--border)' },
  tab: { flex: 1, padding: '14px', background: 'transparent', color: 'var(--muted)', fontSize: 14, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', border: 'none' },
  tabActive: { color: 'var(--accent)', borderBottom: '2px solid var(--accent)', marginBottom: -1 },
  form: { padding: 24, display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 },
  roundsPicker: { display: 'flex', gap: 8 },
  roundBtn: { flex: 1, padding: '10px 0', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'all 0.18s' },
  roundBtnActive: { background: 'var(--accent)', border: '1px solid var(--accent)', color: 'white' },
  error: { margin: '0 24px', padding: '10px 14px', background: '#2a0a0a', border: '1px solid var(--accent)', borderRadius: 6, color: 'var(--accent)', fontSize: 13 },
  rulesCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 },
  rulesTitle: { fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  ruleItem: { display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10, fontSize: 13, color: 'var(--text)', lineHeight: 1.5 },
  ruleNum: { background: 'var(--accent)', color: 'white', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 },
};
