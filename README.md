<div align="center">

# TECHSPARK 2K26 : THE UPSIDE DOWN

**Annual Inter-College Tech & Gaming Fest**  
**Department of Information Science & Engineering (ISE)**  
**APS College of Engineering (APSCE), Bengaluru**  

[![Event Date](https://img.shields.io/badge/Event_Date-October_15,_2026-e50914?style=for-the-badge)](https://github.com/iamthanushgowdap/TechSpark2k26)
[![Prize Pool](https://img.shields.io/badge/Total_Prize_Pool-₹57,000+-f59e0b?style=for-the-badge)](https://github.com/iamthanushgowdap/TechSpark2k26)
[![Built With](https://img.shields.io/badge/Built_With-React_19_%E2%80%A2_Three.js_%E2%80%A2_Tailwind_v4-18181b?style=for-the-badge)](https://github.com/iamthanushgowdap/TechSpark2k26)

</div>

---

## Overview

**TechSpark 2K26** is the official web experience for the annual inter-college technical and gaming fest organized by the **Department of Information Science & Engineering** at **APS College of Engineering, Bengaluru**.

Inspired by the dark cinematic universe of *Stranger Things*, the platform blends real-time **3D WebGL skeletal animation**, **interactive particle physics**, **procedural atmospheric lightning**, and a **responsive editorial interface** engineered for both mobile and desktop devices.

---

## The 4 Flagship Events

| Code | Event | Category | Team Size | Venue | Prize Pool |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **Treasure Hunt** | Clue & Puzzle Hunt | 2 - 4 Members | APSCE Campus | **₹12,000** |
| **02** | **Battle Field** | Gaming Tournament | 4 Members (Squad) | ISE Computer Lab | **₹20,000** |
| **03** | **Escape Room** | 30-Min Puzzle Room | 2 - 3 Members | ISE Block (Room 104) | **₹10,000** |
| **04** | **Cricket** | 6-Over Box Cricket | 6 + 2 Players | College Sports Ground | **₹15,000** |

---

## Key Features & Engineering Highlights

### 1. Real-Time 3D Scrollytelling Engine (`Three.js` + `GLTFLoader`)
- **Skeletal Rig & Custom Animations**: Loads and drives a rigged 3D Demogorgon model (`demogorgon_rig.glb`) with smooth action crossfading between idle stance (`resolved`), scroll-triggered camera leap (`pounce`), and Chapter 3 awakening roar (`pounceHit`).
- **Viewport-Aware Stage Choreography**: Automatically tracks section boundaries (`#chapter-2`, `#developer-spotlight`, `#chapter-3`, `#final-footer`) so the 3D model never obstructs readable content cards or footer media.
- **Volumetric Rim Lighting**: Multi-light setup featuring crimson rim spotlights, eerie teal under-fill lighting, and subtle breathing motion tied to cursor parallax.

### 2. Multi-Layer Atmospheric VFX
- **Dual Video & Fog Backdrop**: Seamless WebM/MP4 background atmosphere layered with blood-moon vignette gradients.
- **Procedural Lightning Canvas**: HTML5 2D canvas rendering branching crimson lightning bolts across the sky.
- **Interactive Upside Down Spores**: Floating ash and spore particle system with cursor repulsion physics.

### 3. Adaptive Mobile & Desktop UX
- **Hero Portal Lockup**: Custom **Zenlith** display typography paired with the glowing crimson Rift portal, flanking institutional emblems, and a live **October 15th** countdown clock.
- **Mobile-First Event Cards**: Full poster cards on desktop/laptop screens and streamlined, fast-scanning detail cards on mobile viewports.
- **Slide-Out Event Drawer**: Clean breakdown of event descriptions, timings, prize distributions, and rules.
- **Smart Foreground Audio Engine**: Continuous ambient audio loop at calibrated `4%` volume that automatically pauses when switching browser tabs, minimizing the window, or backgrounding the app, and resumes on focus.
- **Locked-Down Footer Cinema**: Muted, non-interactive `APSCE THINGS` closing sequence with touch/mouse interaction shielding.

### 4. Bandwidth & Production Optimization
- **Media Compression Pipeline**:
  - `APSCE_THINGS_VID` compressed by **90%** (48.4 MB -> 4.68 MB `.webm` / 5.01 MB `.mp4` at 1080p Full HD).
  - PNG logos, portraits, and embedded GLB textures losslessly/visually optimized by **77%–94%**.
- **Tailwind v4 Scoped Source Scanning**: Configured with `@import "tailwindcss" source(none);` to prevent binary `.glb` scanning and eliminate build-container OOM errors.
- **Edge CDN Caching (`vercel.json`)**: 1-year `immutable` cache headers on `/assets/*` to minimize repeat bandwidth transfer on Vercel.

---

## Tech Stack

- **Frontend Framework**: React 19, Vite 6
- **3D & WebGL**: Three.js (`WebGLRenderer`, `GLTFLoader`, `AnimationMixer`)
- **Styling & Typography**: Tailwind CSS v4, Zenlith Display, Benguiat, Inter
- **Icons**: Lucide React
- **Deployment**: Vercel with custom CDN cache rules

---

## Project Structure

```text
TechSpark-2k26/
├── public/
│   └── assets/                  # Optimized 3D model (.glb), videos (.webm/.mp4), audio, fonts & portraits
├── src/
│   ├── components/
│   │   ├── AudioToggle.jsx      # Header sound ON/OFF controller
│   │   ├── BenguiatTitle.jsx    # Hero emblems, portal aura, and title lockup
│   │   ├── CountdownClock.jsx   # Live countdown timer to October 15, 2026
│   │   ├── LightningCanvas.jsx  # Procedural branching red lightning canvas
│   │   ├── ParticleCanvas.jsx   # Interactive Upside Down spore particle system
│   │   ├── ScrollySections.jsx  # Chapters 1-3, event drawer, HOD & developer cards, footer video
│   │   ├── ScrollytellingCanvas.jsx # Three.js 3D Demogorgon scrollytelling stage
│   │   └── VideoAtmosphere.jsx  # Background atmospheric video layer
│   ├── data/
│   │   └── eventsData.js        # Structured event details, rules, prizes, and registration links
│   ├── utils/
│   │   └── soundEngine.js       # Focus-aware continuous audio loop engine
│   ├── App.jsx                  # Root layout & scroll progress orchestration
│   ├── index.css                # Tailwind v4 configuration, custom fonts & neon utilities
│   └── main.jsx                 # Application entry point
├── index.html
├── package.json
├── vercel.json                  # Immutable caching headers for static assets
└── vite.config.js
```

---

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamthanushgowdap/TechSpark2k26.git
   cd TechSpark2k26
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## Acknowledgements & Credits

- **Head of Department**: **Dr. B. N. Mithun**, Head of the Department of Information Science & Engineering, APS College of Engineering, Bengaluru.
- **Website Developer**: Designed and engineered by **Thanush Gowda P** ([@iamthanushgowdap](https://github.com/iamthanushgowdap)), Department of ISE, APSCE.
