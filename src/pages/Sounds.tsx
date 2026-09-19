import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

// ─── Audio Engine Factories ────────────────────────────────────────────────────
// Each factory sets up a unique Web Audio graph and returns a cleanup function.

type Cleanup = () => void

/** Shared: create a looping white-noise buffer source */
function makeNoiseSource(ctx: AudioContext, seconds = 3): AudioBufferSourceNode {
  const sr = ctx.sampleRate
  const buf = ctx.createBuffer(1, sr * seconds, sr)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true
  return src
}

/** Shared: create a looping brown-noise (integrated) buffer source */
function makeBrownSource(ctx: AudioContext, seconds = 3): AudioBufferSourceNode {
  const sr = ctx.sampleRate
  const buf = ctx.createBuffer(1, sr * seconds, sr)
  const d = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1
    last = (last + 0.02 * w) / 1.02
    d[i] = last * 18 // amplify
  }
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true
  return src
}

// ── RAIN ──────────────────────────────────────────────────────────────────────
// White noise → HPF (400 Hz) → LPF (8 kHz) → gentle tremolo (4 Hz)
function buildRain(ctx: AudioContext, master: GainNode): Cleanup {
  const src = makeNoiseSource(ctx, 4)

  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 400

  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 8000

  // Tremolo: LFO → gainNode to simulate drops hitting
  const tremoloGain = ctx.createGain()
  tremoloGain.gain.value = 0.85
  const lfo = ctx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 4
  const lfoDepth = ctx.createGain()
  lfoDepth.gain.value = 0.12
  lfo.connect(lfoDepth)
  lfoDepth.connect(tremoloGain.gain)
  lfo.start()

  src.connect(hp)
  hp.connect(lp)
  lp.connect(tremoloGain)
  tremoloGain.connect(master)
  src.start()

  return () => {
    try { src.stop(); lfo.stop() } catch { /* ignore */ }
  }
}

// ── OCEAN ─────────────────────────────────────────────────────────────────────
// Brown noise → LPF (500 Hz) → very slow wave-envelope LFO (0.07 Hz)
function buildOcean(ctx: AudioContext, master: GainNode): Cleanup {
  const src = makeBrownSource(ctx, 5)

  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 500
  lp.Q.value = 1.5

  // Very slow swell LFO simulates waves rolling in and out
  const waveGain = ctx.createGain()
  waveGain.gain.value = 0.6
  const waveLFO = ctx.createOscillator()
  waveLFO.type = 'sine'
  waveLFO.frequency.value = 0.07  // one wave every ~14 s
  const waveDepth = ctx.createGain()
  waveDepth.gain.value = 0.4
  waveLFO.connect(waveDepth)
  waveDepth.connect(waveGain.gain)
  waveLFO.start()

  // Add a subtle high rumble layer for surf
  const src2 = makeNoiseSource(ctx, 3)
  const bp2 = ctx.createBiquadFilter()
  bp2.type = 'bandpass'
  bp2.frequency.value = 1200
  bp2.Q.value = 8
  const surfGain = ctx.createGain()
  surfGain.gain.value = 0.08
  src2.connect(bp2)
  bp2.connect(surfGain)
  surfGain.connect(master)
  src2.start()

  src.connect(lp)
  lp.connect(waveGain)
  waveGain.connect(master)

  return () => {
    try { src.stop(); src2.stop(); waveLFO.stop() } catch { /* ignore */ }
  }
}

// ── FOREST ───────────────────────────────────────────────────────────────────
// Pink-ish noise (mild lowpass) for leaf rustle + random chirp oscillators
function buildForest(ctx: AudioContext, master: GainNode): Cleanup {
  // Leaf rustle: mid-band noise
  const rustleSrc = makeNoiseSource(ctx, 4)
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 900
  bp.Q.value = 0.6
  const rustleGain = ctx.createGain()
  rustleGain.gain.value = 0.4
  rustleSrc.connect(bp)
  bp.connect(rustleGain)
  rustleGain.connect(master)
  rustleSrc.start()

  // Bird chirps: short oscillator bursts at random intervals
  const chirps: OscillatorNode[] = []
  const chirpFreqs = [2400, 3100, 2800, 3400, 2200, 4000, 2600]
  let stopped = false

  const scheduleChirp = () => {
    if (stopped) return
    const delay = 0.8 + Math.random() * 2.5
    const freq = chirpFreqs[Math.floor(Math.random() * chirpFreqs.length)]
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq

    const chirpGain = ctx.createGain()
    chirpGain.gain.setValueAtTime(0, ctx.currentTime + delay)
    chirpGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + delay + 0.03)
    chirpGain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + 0.18)

    // Quick frequency slide (chirp up)
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
    osc.frequency.linearRampToValueAtTime(freq * 1.25, ctx.currentTime + delay + 0.12)

    osc.connect(chirpGain)
    chirpGain.connect(master)
    osc.start()
    osc.stop(ctx.currentTime + delay + 0.3)
    chirps.push(osc)

    setTimeout(scheduleChirp, (delay + 0.4) * 1000)
  }
  scheduleChirp()

  return () => {
    stopped = true
    try { rustleSrc.stop() } catch { /* ignore */ }
    chirps.forEach(o => { try { o.stop() } catch { /* ignore */ } })
  }
}

// ── FIRE ─────────────────────────────────────────────────────────────────────
// Brown noise → LPF (700 Hz) → crackle layer (random impulse buffer)
function buildFire(ctx: AudioContext, master: GainNode): Cleanup {
  // Base fire roar: brown noise, low-pass
  const src = makeBrownSource(ctx, 4)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 700
  const fireGain = ctx.createGain()
  fireGain.gain.value = 0.9
  src.connect(lp)
  lp.connect(fireGain)
  fireGain.connect(master)
  src.start()

  // Crackle layer: white noise buffer with random amplitude spikes
  const sr = ctx.sampleRate
  const crackBuf = ctx.createBuffer(1, sr * 5, sr)
  const cd = crackBuf.getChannelData(0)
  for (let i = 0; i < cd.length; i++) {
    // Rare sharp spikes → crackle pops
    if (Math.random() < 0.0005) {
      cd[i] = (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.5)
      // decay next few samples
      for (let j = 1; j < 80 && i + j < cd.length; j++) {
        cd[i + j] = cd[i] * Math.exp(-j * 0.12)
      }
    } else {
      cd[i] = (Math.random() * 2 - 1) * 0.04 // low-level hiss
    }
  }
  const crackSrc = ctx.createBufferSource()
  crackSrc.buffer = crackBuf
  crackSrc.loop = true
  const crackLp = ctx.createBiquadFilter()
  crackLp.type = 'lowpass'
  crackLp.frequency.value = 4000
  const crackGain = ctx.createGain()
  crackGain.gain.value = 1.2
  crackSrc.connect(crackLp)
  crackLp.connect(crackGain)
  crackGain.connect(master)
  crackSrc.start()

  return () => {
    try { src.stop(); crackSrc.stop() } catch { /* ignore */ }
  }
}

// ── WIND ─────────────────────────────────────────────────────────────────────
// White noise → BPF with slowly sweeping cutoff (LFO 0.15 Hz, 150–1200 Hz)
function buildWind(ctx: AudioContext, master: GainNode): Cleanup {
  const src = makeNoiseSource(ctx, 4)

  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 600
  bp.Q.value = 0.5

  // Slow sweeping LFO on filter cutoff → wind howling effect
  const lfo = ctx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 0.15
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 500 // sweeps ±500 Hz around centre
  lfo.connect(lfoGain)
  lfoGain.connect(bp.frequency)
  lfo.start()

  // Amplitude envelope also sways (gusts)
  const windGain = ctx.createGain()
  windGain.gain.value = 0.7
  const gustLFO = ctx.createOscillator()
  gustLFO.type = 'sine'
  gustLFO.frequency.value = 0.08
  const gustDepth = ctx.createGain()
  gustDepth.gain.value = 0.3
  gustLFO.connect(gustDepth)
  gustDepth.connect(windGain.gain)
  gustLFO.start()

  src.connect(bp)
  bp.connect(windGain)
  windGain.connect(master)
  src.start()

  return () => {
    try { src.stop(); lfo.stop(); gustLFO.stop() } catch { /* ignore */ }
  }
}

// ── WHITE NOISE ───────────────────────────────────────────────────────────────
// Flat white noise — all frequencies equally, no filtering
function buildWhiteNoise(ctx: AudioContext, master: GainNode): Cleanup {
  const src = makeNoiseSource(ctx, 3)
  src.connect(master)
  src.start()
  return () => { try { src.stop() } catch { /* ignore */ } }
}

// ─── Sound Definitions ────────────────────────────────────────────────────────
type SoundDef = {
  name: string
  emoji: string
  description: string
  gradient: string
  glow: string
  accentColor: string
  build: (ctx: AudioContext, master: GainNode) => Cleanup
}

const soundDefs: SoundDef[] = [
  {
    name: 'Rain',
    emoji: '🌧️',
    description: 'Gentle rainfall on leaves',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    glow: 'rgba(99,102,241,0.4)',
    accentColor: '#818cf8',
    build: buildRain,
  },
  {
    name: 'Ocean',
    emoji: '🌊',
    description: 'Soothing ocean waves rolling in',
    gradient: 'linear-gradient(135deg, #06b6d4, #14b8a6)',
    glow: 'rgba(6,182,212,0.4)',
    accentColor: '#22d3ee',
    build: buildOcean,
  },
  {
    name: 'Forest',
    emoji: '🌲',
    description: 'Birds chirping & rustling trees',
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    glow: 'rgba(16,185,129,0.4)',
    accentColor: '#34d399',
    build: buildForest,
  },
  {
    name: 'Fire',
    emoji: '🔥',
    description: 'Crackling campfire with pops',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    glow: 'rgba(245,158,11,0.4)',
    accentColor: '#fbbf24',
    build: buildFire,
  },
  {
    name: 'Wind',
    emoji: '💨',
    description: 'Howling mountain breeze & gusts',
    gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    glow: 'rgba(167,139,250,0.4)',
    accentColor: '#c4b5fd',
    build: buildWind,
  },
  {
    name: 'White Noise',
    emoji: '📻',
    description: 'Flat white noise for focus',
    gradient: 'linear-gradient(135deg, #6b7280, #374151)',
    glow: 'rgba(107,114,128,0.4)',
    accentColor: '#9ca3af',
    build: buildWhiteNoise,
  },
]

// ─── SoundCard ────────────────────────────────────────────────────────────────
type SoundCardProps = { sound: SoundDef; index: number }

function SoundCard({ sound, index }: SoundCardProps) {
  const [active, setActive] = useState(false)
  const [volume, setVolume] = useState(0.6)

  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const cleanupRef = useRef<Cleanup | null>(null)

  // Start / stop audio engine
  useEffect(() => {
    if (active) {
      if (!ctxRef.current) ctxRef.current = new AudioContext()
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      const master = ctx.createGain()
      master.gain.value = volume * 0.35
      master.connect(ctx.destination)
      masterRef.current = master

      cleanupRef.current = sound.build(ctx, master)
    } else {
      // Fade out then stop
      if (masterRef.current) {
        const g = masterRef.current
        g.gain.setTargetAtTime(0, g.context.currentTime, 0.4)
      }
      const cleanup = cleanupRef.current
      setTimeout(() => { cleanup?.() }, 600)
      cleanupRef.current = null
      masterRef.current = null
    }

    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  // Volume change
  const handleVolume = useCallback((v: number) => {
    setVolume(v)
    if (masterRef.current) {
      masterRef.current.gain.setTargetAtTime(v * 0.35, masterRef.current.context.currentTime, 0.05)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="glass-card"
      style={{
        padding: '1.5rem',
        border: active ? `1px solid ${sound.accentColor}44` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: active ? `0 0 30px ${sound.glow}` : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Icon */}
      <motion.div
        animate={{ scale: active ? [1, 1.1, 1] : 1 }}
        transition={{ repeat: active ? Infinity : 0, duration: 2.2, ease: 'easeInOut' }}
        style={{
          width: 56, height: 56, borderRadius: 16,
          background: sound.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem', marginBottom: '1rem',
          boxShadow: active ? `0 4px 20px ${sound.glow}` : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {sound.emoji}
      </motion.div>

      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
        {sound.name}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
        {sound.description}
      </div>

      {/* Volume slider */}
      {active && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ marginBottom: '1rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <VolumeX size={13} color="var(--text-muted)" />
            <input
              type="range" min={0} max={1} step={0.01} value={volume}
              onChange={e => handleVolume(Number(e.target.value))}
              style={{
                flex: 1, appearance: 'none', height: 4, borderRadius: 9999, outline: 'none', cursor: 'pointer',
                background: `linear-gradient(to right, ${sound.accentColor} ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%)`,
              }}
            />
            <Volume2 size={13} color="var(--text-muted)" />
          </div>
        </motion.div>
      )}

      {/* Play / Pause button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActive(a => !a)}
        style={{
          width: '100%', padding: '0.6rem', borderRadius: 10, border: 'none',
          background: active ? sound.gradient : 'rgba(255,255,255,0.07)',
          color: active ? 'white' : 'var(--text-secondary)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, fontSize: '0.85rem', fontWeight: 600,
          boxShadow: active ? `0 4px 16px ${sound.glow}` : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {active ? <><Pause size={15} /> Playing</> : <><Play size={15} /> Play</>}
      </motion.button>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Sounds() {
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="page-title"><span className="gradient-text-pink">Ambient Sounds</span></h1>
        <p className="page-subtitle">Mix nature sounds to create your perfect calm environment</p>

        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 14, padding: '0.75rem 1.25rem', marginBottom: '2rem',
          fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>💡</span>
          <span>Each sound uses a unique audio engine — rain, ocean waves, bird chirps, fire crackles, wind gusts, and white noise are all distinctly generated.</span>
        </div>

        <div className="grid-3">
          {soundDefs.map((s, i) => <SoundCard key={s.name} sound={s} index={i} />)}
        </div>
      </motion.div>
    </div>
  )
}
