import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wind, BookOpen, Music, Timer, Sparkles, Home } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/breathe', label: 'Breathe', icon: Wind },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/sounds', label: 'Sounds', icon: Music },
  { to: '/focus', label: 'Focus', icon: Timer },
  { to: '/affirmations', label: 'Affirm', icon: Sparkles },
]

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(10, 10, 26, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #7c3aed, #14b8a6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
        }}>
          <span style={{ fontSize: 16 }}>🧘</span>
        </div>
        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1rem', lineHeight: 1 }}>
            StressBlock
          </div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(240,240,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            CalmOS v1.0
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 9999,
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  background: isActive ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                  color: isActive ? '#a78bfa' : 'rgba(240,240,255,0.55)',
                  border: isActive ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <Icon size={14} />
                <span>{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  )
}
