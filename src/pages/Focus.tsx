import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward, Coffee, Brain, Target } from 'lucide-react'

type Mode = 'focus' | 'short' | 'long'

const modes: { id: Mode; label: string; icon: React.ElementType; duration: number; color: string; gradient: string; desc: string }[] = [
  { id: 'focus', label: 'Deep Focus', icon: Brain, duration: 25 * 60, color: '#7c3aed', gradient: 'linear-gradient(135deg,#7c3aed,#6366f1)', desc: '25 min focused work' },
  { id: 'short', label: 'Short Break', icon: Coffee, duration: 5 * 60, color: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#14b8a6)', desc: '5 min rest' },
  { id: 'long', label: 'Long Break', icon: Target, duration: 15 * 60, color: '#06b6d4', gradient: 'linear-gradient(135deg,#06b6d4,#14b8a6)', desc: '15 min recharge' },
]

const tips = [
  'During focus sessions, silence all notifications.',
  'The Pomodoro Technique was invented by Francesco Cirillo.',
  'After 4 focus sessions, take a long break.',
  'Drink a glass of water during your short breaks.',
  'Use breaks to stretch — it reduces muscle tension.',
]

export default function Focus() {
  const [mode, setMode] = useState<Mode>('focus')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [tip] = useState(tips[Math.floor(Math.random() * tips.length)])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentMode = modes.find(m => m.id === mode)!

  useEffect(() => {
    setRunning(false)
    setTimeLeft(currentMode.duration)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [mode])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setRunning(false)
            if (mode === 'focus') setCompletedPomodoros(c => c + 1)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, mode])

  const reset = () => {
    setRunning(false)
    setTimeLeft(currentMode.duration)
  }

  const skip = () => {
    const idx = modes.findIndex(m => m.id === mode)
    setMode(modes[(idx + 1) % modes.length].id)
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')
  const progress = 1 - timeLeft / currentMode.duration
  const circumference = 2 * Math.PI * 130
  const strokeDash = circumference * (1 - progress)

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="page-title"><span style={{ background: currentMode.gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Focus Timer</span></h1>
        <p className="page-subtitle">Stay in flow with structured Pomodoro sessions</p>

        {/* Mode switcher */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.04)', padding: '6px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', width: 'fit-content' }}>
          {modes.map(m => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode(m.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
                borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                background: mode === m.id ? m.gradient : 'transparent',
                color: mode === m.id ? 'white' : 'var(--text-muted)',
                boxShadow: mode === m.id ? `0 4px 16px ${m.color}44` : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              <m.icon size={14} />
              {m.label}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Timer circle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: 310, height: 310 }}>
              <svg width="310" height="310" style={{ position: 'absolute', top: 0, left: 0 }}>
                <circle cx="155" cy="155" r="130" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <motion.circle
                  cx="155" cy="155" r="130"
                  fill="none"
                  stroke={currentMode.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDash}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '155px 155px', filter: `drop-shadow(0 0 12px ${currentMode.color}88)` }}
                  transition={{ duration: 0.5 }}
                />
              </svg>

              {/* Center content */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}>
                <motion.div
                  key={`${mins}:${secs}`}
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '3.5rem', letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--text-primary)' }}
                >
                  {mins}:{secs}
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{ fontSize: '0.85rem', color: currentMode.color, fontWeight: 600, marginTop: '0.25rem' }}
                  >
                    {currentMode.desc}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setRunning(r => !r)}
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: '50%',
                  border: 'none',
                  background: currentMode.gradient,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 24px ${currentMode.color}55`,
                }}
              >
                {running ? <Pause size={24} color="white" /> : <Play size={24} color="white" />}
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} onClick={reset} className="btn-ghost" style={{ width: 46, height: 46, borderRadius: '50%', padding: 0 }}>
                <RotateCcw size={17} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} onClick={skip} className="btn-ghost" style={{ width: 46, height: 46, borderRadius: '50%', padding: 0 }}>
                <SkipForward size={17} />
              </motion.button>
            </div>
          </div>

          {/* Stats & info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Pomodoro count */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Session Progress</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ background: i < completedPomodoros % 4 ? currentMode.gradient : 'rgba(255,255,255,0.08)' }}
                    style={{
                      flex: 1,
                      height: 8,
                      borderRadius: 9999,
                      boxShadow: i < completedPomodoros % 4 ? `0 0 10px ${currentMode.color}66` : 'none',
                      transition: 'all 0.5s ease',
                    }}
                  />
                ))}
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '2rem', color: currentMode.color }}>{completedPomodoros}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>focus sessions completed today</div>
            </div>

            {/* Tip */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>💡 Tip</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip}</p>
            </div>

            {/* Schedule suggestion */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Recommended Flow</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {['25 min 🧠 Focus', '5 min ☕ Short Break', '25 min 🧠 Focus', '5 min ☕ Short Break', '25 min 🧠 Focus', '15 min 🌿 Long Break'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.82rem', color: i % 2 === 0 ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: i % 2 === 0 ? currentMode.color : 'rgba(255,255,255,0.2)' }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
