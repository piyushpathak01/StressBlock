import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Heart, Share2, Copy, Check } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Category = 'all' | 'calm' | 'strength' | 'growth' | 'gratitude'

const affirmations: { text: string; author?: string; category: Exclude<Category, 'all'> }[] = [
  { text: 'I am worthy of peace and calm in my life.', category: 'calm' },
  { text: 'Each breath I take brings me closer to tranquility.', category: 'calm' },
  { text: 'I release all tension and welcome stillness.', category: 'calm' },
  { text: 'I am at peace with where I am in my journey.', category: 'calm' },
  { text: 'I am stronger than my anxiety.', category: 'strength' },
  { text: 'I have survived every hard day so far — I will survive this one too.', category: 'strength' },
  { text: 'I have the power to create the life I deserve.', category: 'strength' },
  { text: 'Challenges are opportunities for me to grow stronger.', category: 'strength' },
  { text: 'Every day I am becoming a better version of myself.', category: 'growth' },
  { text: 'Progress, not perfection, is my goal.', category: 'growth' },
  { text: 'I am open to new possibilities and endless growth.', category: 'growth' },
  { text: 'My potential is limitless when I believe in myself.', category: 'growth' },
  { text: 'I am grateful for the simple moments that bring me joy.', category: 'gratitude' },
  { text: 'There is always something beautiful to be grateful for.', category: 'gratitude' },
  { text: 'I find abundance in the present moment.', category: 'gratitude' },
  { text: 'Gratitude transforms what I have into enough.', category: 'gratitude' },
  { text: 'I breathe in calm, I breathe out stress.', category: 'calm' },
  { text: 'I trust myself to handle whatever comes my way.', category: 'strength' },
  { text: 'I am resilient and can bounce back from anything.', category: 'strength' },
  { text: 'My mind and body deserve rest and care.', category: 'calm' },
]

const categories: { id: Category; label: string; emoji: string; color: string }[] = [
  { id: 'all', label: 'All', emoji: '✨', color: '#7c3aed' },
  { id: 'calm', label: 'Calm', emoji: '🌊', color: '#14b8a6' },
  { id: 'strength', label: 'Strength', emoji: '💪', color: '#ec4899' },
  { id: 'growth', label: 'Growth', emoji: '🌱', color: '#10b981' },
  { id: 'gratitude', label: 'Gratitude', emoji: '🙏', color: '#f59e0b' },
]

export default function Affirmations() {
  const [category, setCategory] = useState<Category>('all')
  const [cardIdx, setCardIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const [favorites, setFavorites] = useLocalStorage<string[]>('affirmation-favorites', [])
  const [copied, setCopied] = useState(false)

  const filtered = category === 'all' ? affirmations : affirmations.filter(a => a.category === category)
  const current = filtered[cardIdx % filtered.length]
  const catInfo = categories.find(c => c.id === (category === 'all' ? current.category : category))!
  const isFav = favorites.includes(current.text)

  const next = () => {
    setDirection(1)
    setCardIdx((i) => (i + 1) % filtered.length)
  }

  const prev = () => {
    setDirection(-1)
    setCardIdx((i) => (i - 1 + filtered.length) % filtered.length)
  }

  const toggleFav = () => {
    setFavorites((prev) =>
      prev.includes(current.text) ? prev.filter(f => f !== current.text) : [...prev, current.text]
    )
  }

  const copy = async () => {
    await navigator.clipboard.writeText(current.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const cardVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.95 }),
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="page-title"><span className="gradient-text-purple">Affirmations</span></h1>
        <p className="page-subtitle">Positive words to rewire your mindset</p>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setCategory(cat.id); setCardIdx(0) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px',
                borderRadius: 9999, border: category === cat.id ? `1.5px solid ${cat.color}66` : '1.5px solid rgba(255,255,255,0.08)',
                background: category === cat.id ? `${cat.color}22` : 'rgba(255,255,255,0.04)',
                color: category === cat.id ? cat.color : 'rgba(240,240,255,0.5)',
                cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600, transition: 'all 0.2s ease',
                boxShadow: category === cat.id ? `0 0 16px ${cat.color}33` : 'none',
              }}
            >
              <span>{cat.emoji}</span> {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Main card */}
        <div style={{ maxWidth: 640, margin: '0 auto', marginBottom: '2rem' }}>
          {/* Card counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span className="badge" style={{ background: `${catInfo.color}22`, color: catInfo.color, border: `1px solid ${catInfo.color}33` }}>
              {catInfo.emoji} {categories.find(c => c.id === current.category)?.label}
            </span>
            <span>{(cardIdx % filtered.length) + 1} / {filtered.length}</span>
          </div>

          {/* Affirmation card */}
          <div style={{ position: 'relative', height: 260, overflow: 'hidden', marginBottom: '1.5rem' }}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={`${category}-${cardIdx}`}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 24,
                  backdropFilter: 'blur(20px)',
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  boxShadow: `0 0 40px ${catInfo.color}22`,
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>{catInfo.emoji}</div>
                <p style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  lineHeight: 1.5,
                  color: 'var(--text-primary)',
                  maxWidth: 480,
                }}>
                  "{current.text}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} onClick={prev} className="btn-ghost" style={{ borderRadius: '50%', width: 44, height: 44, padding: 0 }}>
              ←
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={toggleFav}
              style={{
                borderRadius: '50%', width: 44, height: 44, padding: 0, border: 'none', cursor: 'pointer',
                background: isFav ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.05)',
                color: isFav ? '#f9a8d4' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
                border: isFav ? '1px solid rgba(236,72,153,0.4)' : '1px solid rgba(255,255,255,0.08)',
              } as React.CSSProperties}
            >
              <Heart size={17} fill={isFav ? '#f9a8d4' : 'none'} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              className="btn-primary"
              onClick={next}
              style={{ borderRadius: 9999, padding: '0 1.5rem', height: 44, gap: 8 }}
            >
              <RefreshCw size={15} /> Next
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={copy}
              style={{
                borderRadius: '50%', width: 44, height: 44, padding: 0, border: '1px solid rgba(255,255,255,0.08)',
                background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                color: copied ? '#6ee7b7' : 'var(--text-muted)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease',
              }}
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
            </motion.button>
          </div>
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ❤️ Your Favorites ({favorites.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {favorites.map((fav, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card"
                  style={{ padding: '0.9rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                  onClick={() => {
                    const idx = affirmations.findIndex(a => a.text === fav)
                    if (idx !== -1) { setCategory('all'); setCardIdx(idx) }
                  }}
                >
                  <Heart size={14} color="#f9a8d4" fill="#f9a8d4" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>"{fav}"</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
