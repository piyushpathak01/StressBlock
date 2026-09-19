import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'

type Pattern = {
  name: string
  desc: string
  phases: { label: string; duration: number; color: string }[]
  benefit: string
}

const patterns: Pattern[] = [
  {
    name: 'Box Breathing',
    desc: 'Used by Navy SEALs to achieve calm under pressure.',
    benefit: 'Reduces anxiety & improves focus',
    phases: [
      { label: 'Inhale', duration: 4, color: '#14b8a6' },
      { label: 'Hold', duration: 4, color: '#6366f1' },
      { label: 'Exhale', duration: 4, color: '#8b5cf6' },
      { label: 'Hold', duration: 4, color: '#a78bfa' },
    ],
  },
  {
    name: '4-7-8 Breathing',
    desc: 'Dr. Weil\'s technique for instant calm and better sleep.',
    benefit: 'Promotes deep relaxation & sleep',
    phases: [
      { label: 'Inhale', duration: 4, color: '#10b981' },
      { label: 'Hold', duration: 7, color: '#06b6d4' },
      { label: 'Exhale', duration: 8, color: '#14b8a6' },
    ],
  },
  {
    name: 'Calm Breath',
    desc: 'Simple, gentle breathing for everyday stress relief.',
    benefit: 'Quick everyday stress relief',
    phases: [
      { label: 'Inhale', duration: 4, color: '#ec4899' },
      { label: 'Exhale', duration: 6, color: '#8b5cf6' },
    ],
  },
]

export default function Breathe() {
  const [selected, setSelected] = useState(0)
  const [running, setRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Refs mirror state so the single stable interval always reads fresh values
  const runningRef = useRef(false)
  const phaseIdxRef = useRef(0)
  const elapsedRef = useRef(0)
  const selectedRef = useRef(0)

  const pattern = patterns[selected]
  const phase = pattern.phases[phaseIdx]

  // Keep refs in sync with state
  runningRef.current = running
  phaseIdxRef.current = phaseIdx
  elapsedRef.current = elapsed
  selectedRef.current = selected

  // Reset whenever the pattern changes
  useEffect(() => {
    reset()
  }, [selected]) // eslint-disable-line react-hooks/exhaustive-deps

  // Single stable interval — reads from refs, never stale
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!runningRef.current) return

      const pat = patterns[selectedRef.current]
      const currentPhase = pat.phases[phaseIdxRef.current]
      const nextElapsed = elapsedRef.current + 1

      if (nextElapsed >= currentPhase.duration) {
        // Phase complete — advance to next phase
        const nextPhaseIdx = (phaseIdxRef.current + 1) % pat.phases.length
        if (nextPhaseIdx === 0) setCycles(c => c + 1)
        phaseIdxRef.current = nextPhaseIdx
        elapsedRef.current = 0
        setPhaseIdx(nextPhaseIdx)
        setElapsed(0)
      } else {
        elapsedRef.current = nextElapsed
        setElapsed(nextElapsed)
      }
    }, 1000)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, []) // runs once — interval is stable for the component lifetime

  const reset = () => {
    setRunning(false)
    runningRef.current = false
    setPhaseIdx(0)
    phaseIdxRef.current = 0
    setElapsed(0)
    elapsedRef.current = 0
    setCycles(0)
  }

  const progress = elapsed / phase.duration
  const circumference = 2 * Math.PI * 110
  const strokeDash = circumference * (1 - progress)

  const scaleVal = phase.label === 'Inhale' ? 1 + progress * 0.3
    : phase.label === 'Exhale' ? 1.3 - progress * 0.3
    : 1.15

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="page-title"><span className="gradient-text-teal">Breathing</span></h1>
        <p className="page-subtitle">Guided breathing exercises to calm your nervous system</p>

        {/* Pattern selector */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {patterns.map((p, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(i)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: 9999,
                border: selected === i ? '1.5px solid rgba(20,184,166,0.6)' : '1.5px solid rgba(255,255,255,0.08)',
                background: selected === i ? 'rgba(20,184,166,0.15)' : 'rgba(255,255,255,0.04)',
                color: selected === i ? '#5eead4' : 'rgba(240,240,255,0.55)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              {p.name}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Circle visualization */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: 280, height: 280 }}>
              {/* SVG progress ring */}
              <svg width="280" height="280" style={{ position: 'absolute', top: 0, left: 0 }}>
                {/* Track */}
                <circle cx="140" cy="140" r="110" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                {/* Progress */}
                <AnimatePresence>
                  <motion.circle
                    key={`${phaseIdx}-${elapsed}`}
                    cx="140" cy="140" r="110"
                    fill="none"
                    stroke={phase.color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDash}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '140px 140px', filter: `drop-shadow(0 0 8px ${phase.color})` }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
              </svg>

              {/* Breathing orb */}
              <motion.div
                animate={{ scale: scaleVal }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 35%, ${phase.color}cc, ${phase.color}44)`,
                  boxShadow: `0 0 40px ${phase.color}55, 0 0 80px ${phase.color}22`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${phaseIdx}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    style={{ textAlign: 'center' }}
                  >
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'white' }}>
                      {running ? phase.label : 'Ready'}
                    </div>
                    {running && (
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', lineHeight: 1 }}>
                        {phase.duration - elapsed}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setRunning((r) => !r)}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(20,184,166,0.4)',
                }}
              >
                {running ? <Pause size={22} color="white" /> : <Play size={22} color="white" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={reset}
                className="btn-ghost"
                style={{ width: 44, height: 44, borderRadius: '50%', padding: 0 }}
              >
                <RotateCcw size={16} />
              </motion.button>
              {cycles > 0 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: 9999, background: 'rgba(255,255,255,0.05)' }}>
                  {cycles} cycle{cycles !== 1 ? 's' : ''} complete
                </motion.div>
              )}
            </div>
          </div>

          {/* Info panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {pattern.name}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>{pattern.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#5eead4' }}>
                <ChevronRight size={14} />
                <span>{pattern.benefit}</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Sequence
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {pattern.phases.map((ph, i) => (
                  <motion.div
                    key={i}
                    animate={{ background: running && i === phaseIdx ? `${ph.color}22` : 'transparent' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 10,
                      border: running && i === phaseIdx ? `1px solid ${ph.color}44` : '1px solid transparent',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: ph.color, boxShadow: running && i === phaseIdx ? `0 0 10px ${ph.color}` : 'none' }} />
                      <span style={{ fontWeight: 500, color: running && i === phaseIdx ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.9rem' }}>{ph.label}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: ph.color, fontSize: '0.9rem' }}>{ph.duration}s</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
