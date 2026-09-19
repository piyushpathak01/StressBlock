import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Save } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Entry = {
  id: string
  date: string
  mood: number
  moodLabel: string
  text: string
  tags: string[]
}

const moods = [
  { emoji: '😌', label: 'Calm', value: 5, color: '#10b981' },
  { emoji: '😊', label: 'Good', value: 4, color: '#14b8a6' },
  { emoji: '😐', label: 'Neutral', value: 3, color: '#6366f1' },
  { emoji: '😟', label: 'Anxious', value: 2, color: '#f59e0b' },
  { emoji: '😰', label: 'Stressed', value: 1, color: '#ec4899' },
]

const tagOptions = ['Work', 'Family', 'Health', 'Finance', 'Relationships', 'Self-care', 'Sleep', 'Exercise']

const prompts = [
  "What's weighing on your mind right now?",
  "What are three things you're grateful for today?",
  "What challenged you today, and how did you handle it?",
  "What do you need more of in your life right now?",
  "Describe a moment of peace you had today.",
]

export default function Journal() {
  const [entries, setEntries] = useLocalStorage<Entry[]>('journal-entries', [])
  const [showForm, setShowForm] = useState(false)
  const [selectedMood, setSelectedMood] = useState<number>(3)
  const [text, setText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [prompt] = useState(prompts[Math.floor(Math.random() * prompts.length)])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const save = () => {
    if (!text.trim()) return
    const mood = moods.find(m => m.value === selectedMood)!
    const entry: Entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood,
      moodLabel: mood.label,
      text: text.trim(),
      tags: selectedTags,
    }
    setEntries((prev) => [entry, ...prev])
    setShowForm(false)
    setText('')
    setSelectedTags([])
    setSelectedMood(3)
  }

  const remove = (id: string) => {
    setEntries((prev) => prev.filter(e => e.id !== id))
    setDeleteId(null)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div>
            <h1 className="page-title"><span className="gradient-text-purple">Mood Journal</span></h1>
            <p className="page-subtitle">Track feelings, reflect, and grow.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
            onClick={() => setShowForm(true)}
            style={{ marginTop: '0.5rem' }}
          >
            <Plus size={16} /> New Entry
          </motion.button>
        </div>

        {/* New entry form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.35 }}
              className="glass-card"
              style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid rgba(124,58,237,0.25)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>How are you feeling?</div>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Mood picker */}
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {moods.map(m => (
                  <motion.button
                    key={m.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setSelectedMood(m.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                      borderRadius: 9999, border: selectedMood === m.value ? `1.5px solid ${m.color}` : '1.5px solid rgba(255,255,255,0.08)',
                      background: selectedMood === m.value ? `${m.color}22` : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                      color: selectedMood === m.value ? m.color : 'var(--text-muted)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{m.emoji}</span><span>{m.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Prompt */}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                💬 {prompt}
              </div>

              {/* Text area */}
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Start writing..."
                rows={5}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
                  padding: '0.75rem 1rem', resize: 'vertical', outline: 'none', lineHeight: 1.7, marginBottom: '1rem',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />

              {/* Tags */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Tags</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {tagOptions.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: '3px 10px', borderRadius: 9999, fontSize: '0.75rem', cursor: 'pointer',
                        border: selectedTags.includes(tag) ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        background: selectedTags.includes(tag) ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                        color: selectedTags.includes(tag) ? '#a78bfa' : 'var(--text-muted)',
                        transition: 'all 0.15s ease',
                      }}
                    >{tag}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn-primary" onClick={save}>
                  <Save size={15} /> Save Entry
                </motion.button>
                <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries list */}
        {entries.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card"
            style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📓</div>
            <div style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No entries yet</div>
            <div style={{ fontSize: '0.85rem' }}>Write your first journal entry to start tracking your mood.</div>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence>
              {entries.map((entry) => {
                const mood = moods.find(m => m.value === entry.mood)!
                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.35 }}
                    className="glass-card"
                    style={{ padding: '1.25rem 1.5rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.4rem' }}>{mood.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: mood.color }}>{mood.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(entry.date)}</div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteId(entry.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                      >
                        <Trash2 size={15} />
                      </motion.button>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: entry.tags.length ? '0.75rem' : 0 }}>
                      {entry.text}
                    </p>
                    {entry.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {entry.tags.map(tag => (
                          <span key={tag} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Delete confirm dialog */}
        <AnimatePresence>
          {deleteId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
              }}
              onClick={() => setDeleteId(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card"
                style={{ padding: '2rem', maxWidth: 360, width: '90%', textAlign: 'center' }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🗑️</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Delete Entry?</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>This cannot be undone.</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button className="btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                  <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #ef4444, #ec4899)' }} onClick={() => remove(deleteId)}>Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
