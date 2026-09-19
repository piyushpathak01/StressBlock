# 🧘 StressBlock — CalmOS

> **A modern, immersive stress management & mental wellness web application built with React, TypeScript, and Vite.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.2-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌟 Overview

**StressBlock (CalmOS)** is an all-in-one digital sanctuary designed to help individuals combat burnout, alleviate anxiety, restore mental focus, and build mindful daily habits. Built with a sleek dark-mode glassmorphism aesthetic and smooth micro-animations, StressBlock provides instant grounding tools right in your browser without tracking or bloatware.

---

## ✨ Features & Modules

### 🌬️ Guided Breathing (`/breathe`)
- **Science-Backed Techniques**: Box Breathing (4-4-4-4), 4-7-8 Relaxation, Deep Calm, and Resonance Frequency.
- **Visual & Audio Pacer**: Expanding and contracting breath sphere synchronized with stage cues (*Inhale*, *Hold*, *Exhale*).
- **Session Progress Tracker**: Real-time cycle count, elapsed timers, and calming ambient guidance.

### 🎧 Ambient Soundscape Synthesizer (`/sounds`)
- **Native Web Audio API Engine**: High-fidelity procedural audio generator — zero external audio download delays.
- **12+ Sound Channels**: Rain, Thunderstorm, Ocean Waves, Crackling Campfire, Forest Birds, Wind, Brown Noise, Pink Noise, White Noise, Binaural Alpha Beats (10 Hz), and Tibetan Singing Bowls.
- **Multitrack Mixer**: Independent volume control for each ambient layer, master volume, and quick mood presets (Deep Sleep, Cozy Cabin, Focus Flow, Zen Garden).

### ⏱️ Focus & Deep Work Timer (`/focus`)
- **Customizable Intervals**: Classic Pomodoro (25/5 min), Deep Flow (50/10 min), and customizable intervals.
- **Embedded Task Checklist**: Track goals and cross off tasks during focused sprints.
- **Visual Progress Dial**: Dynamic countdown ring and subtle notification chimes on completion.

### 📖 Mindfulness Journal & Mood Tracker (`/journal`)
- **Daily Emotional Check-Ins**: Log how you feel with intuitive mood scales.
- **Prompted Reflections**: Gratitude lists, release-of-tension prompts, and freeform journaling.
- **Private & Local**: All journal entries and metrics persist locally in your browser with complete privacy (`localStorage`).

### ✨ Affirmations Deck (`/affirmations`)
- **Categorized Cards**: Browse curated affirmations for anxiety relief, confidence, focus, gratitude, and inner peace.
- **Interactive Card Deck**: Flip, shuffle, and favorite the affirmations that resonate with you.
- **Audio Readout**: Built-in speech synthesis option for audible calming affirmations.

### 📊 CalmOS Dashboard (`/`)
- **Mood Heatmap & Streaks**: Quick check-in widget to track emotional wellness over time.
- **Quick-Access Launchpad**: Rapid entry into any stress-relief tool within one click.
- **Daily Mindful Quotes**: Thoughtful reminders curated to inspire calmness and perspective.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) (lightning-fast HMR and bundling)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (smooth physics-based transitions and gestures)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Synthesis**: Native Browser [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **Styling**: Modern Vanilla CSS with CSS custom properties, glassmorphism, responsive grid layouts, and custom scrollbars.
- **Data Persistence**: Browser `localStorage` (No account creation or cloud tracking required).

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/piyushpathak01/StressBlock.git
   cd StressBlock
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The compiled production assets will be generated in the `dist/` directory.

---

## 📂 Project Structure

```plaintext
StressBlock/
├── public/               # Static assets & icons
├── src/
│   ├── components/       # Shared UI components
│   │   ├── Layout.tsx    # App shell with animated background
│   │   └── Navbar.tsx    # Navigation bar with active indicators
│   ├── hooks/            # Custom hooks
│   │   └── useLocalStorage.ts # Persistent client-side state
│   ├── pages/            # Application views
│   │   ├── Dashboard.tsx # Main dashboard & daily overview
│   │   ├── Breathe.tsx   # Guided breathing exercises
│   │   ├── Sounds.tsx    # Web Audio ambient mixer
│   │   ├── Focus.tsx     # Pomodoro focus session & task manager
│   │   ├── Journal.tsx   # Private mood & thought journal
│   │   └── Affirmations.tsx # Interactive affirmation cards
│   ├── App.tsx           # Router configuration
│   ├── index.css         # Design tokens, themes & global styles
│   └── main.tsx          # Application entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript compiler configurations
├── vercel.json           # SPA routing rewrite configuration for Vercel
└── vite.config.ts        # Vite build configuration
```

---

## 🚢 Deployment

### Deploy to Vercel
StressBlock includes a preconfigured `vercel.json` for seamless Single Page Application (SPA) routing:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpiyushpathak01%2FStressBlock)

Or via the Vercel CLI:
```bash
npm install -g vercel
vercel
```

---

## 🛡️ Privacy & Offline Use

StressBlock is built with a **privacy-first** philosophy:
- **Zero Tracking**: No analytics scripts or third-party behavioral trackers.
- **Local Storage**: All your journal logs, timer settings, and mood history remain stored entirely on your device.
- **No External Media**: Ambient sounds and audio effects are synthetically generated directly inside your browser via the Web Audio API.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
