import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Wind, BookOpen, Music, Timer, Sparkles, TrendingDown, Heart, Zap } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const moods = [
  { emoji: '😌', label: 'Calm', value: 5, color: '#10b981' },
  { emoji: '😊', label: 'Good', value: 4, color: '#14b8a6' },
  { emoji: '😐', label: 'Neutral', value: 3, color: '#6366f1' },
  { emoji: '😟', label: 'Anxious', value: 2, color: '#f59e0b' },
  { emoji: '😰', label: 'Stressed', value: 1, color: '#ec4899' },
]

const quickTools = [
  {
    to: '/breathe',
    icon: Wind,
    title: 'Breathing',
    desc: 'Box breathing, 4-7-8, calm breath',
    gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
    glow: 'rgba(20, 184, 166, 0.3)',
    badge: 'Quick relief',
  },
  {
    to: '/journal',
    icon: BookOpen,
    title: 'Journal',
    desc: 'Log feelings, track your mood',
    gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)',
    glow: 'rgba(124, 58, 237, 0.3)',
    badge: 'Reflect',
  },
  {
    to: '/sounds',
    icon: Music,
    title: 'Sounds',
    desc: 'Ambient sounds & nature mixer',
    gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    glow: 'rgba(236, 72, 153, 0.3)',
    badge: 'Relax',
  },
  {
    to: '/focus',
    icon: Timer,
    title: 'Focus',
    desc: 'Pomodoro timer & deep work mode',
    gradient: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    glow: 'rgba(245, 158, 11, 0.3)',
    badge: 'Productivity',
  },
  {
    to: '/affirmations',
    icon: Sparkles,
    title: 'Affirmations',
    desc: 'Daily positive affirmations',
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    glow: 'rgba(16, 185, 129, 0.3)',
    badge: 'Mindset',
  },
]

const tips = [
  { icon: TrendingDown, text: 'Even 2 minutes of deep breathing reduces cortisol by up to 40%.' },
  { icon: Heart, text: 'Journaling for 5 minutes daily can significantly lower anxiety levels.' },
  { icon: Zap, text: 'The 4-7-8 breathing technique activates your parasympathetic nervous system instantly.' },
]

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [selectedMood, setSelectedMood] = useLocalStorage<number | null>('today-mood', null)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div variants={stagger} initial="initial" animate="animate">
        <motion.div variants={fadeUp}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            {today}
          </div>
          <h1 className="page-title">
            <span className="gradient-text-purple">{greeting} 👋</span>
          </h1>
          <p className="page-subtitle">How are you feeling today? Let's find your calm.</p>
        </motion.div>

        {/* Mood check */}
        <motion.div variants={fadeUp} className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Check in — How's your mood right now?
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {moods.map((mood) => (
              <motion.button
                key={mood.value}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setSelectedMood(mood.value)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '0.75rem 1.1rem',
                  borderRadius: 16,
                  border: selectedMood === mood.value ? `2px solid ${mood.color}` : '2px solid transparent',
                  background: selectedMood === mood.value ? `${mood.color}22` : 'rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedMood === mood.value ? `0 0 20px ${mood.color}44` : 'none',
                }}
              >
                <span style={{ fontSize: '1.75rem' }}>{mood.emoji}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: selectedMood === mood.value ? mood.color : 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  {mood.label}
                </span>
              </motion.button>
            ))}
          </div>
          {selectedMood !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: 12, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
            >
              {selectedMood >= 4 ? '✨ Great! Keep that positive energy going.' :
                selectedMood === 3 ? '🌿 Neutral is okay. Try a breathing exercise to boost your mood.' :
                  '💙 That\'s okay. Let\'s use some tools to help you feel better.'}
            </motion.div>
          )}
        </motion.div>

        {/* Quick tools grid */}
        <motion.div variants={fadeUp}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Tools & Exercises
          </div>
        </motion.div>

        <motion.div variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {quickTools.map((tool) => (
            <motion.div
              key={tool.to}
              variants={fadeUp}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="glass-card"
              onClick={() => navigate(tool.to)}
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                boxShadow: `0 0 0 transparent`,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 32px ${tool.glow}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 transparent'
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: tool.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.9rem',
                boxShadow: `0 4px 16px ${tool.glow}`,
              }}>
                <tool.icon size={20} color="white" />
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{tool.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{tool.desc}</div>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{tool.badge}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Tips */}
        <motion.div variants={fadeUp}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Did you know?
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="glass-card"
                style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(124, 58, 237, 0.15)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <tip.icon size={16} color="#a78bfa" />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
