<div align="center">

# TECHSPARK 2K26 : THE UPSIDE DOWN

**Official Interactive WebGL & Scrollytelling Platform**  
**Annual Inter-College Technical & Gaming Symposium**  
**Department of Information Science & Engineering (ISE) • APS College of Engineering, Bengaluru**

[![Event Date](https://img.shields.io/badge/Event_Date-October_15,_2026-e50914?style=for-the-badge)](https://github.com/iamthanushgowdap/TechSpark2k26)
[![Architecture](https://img.shields.io/badge/Engine-Three.js_WebGL_%E2%80%A2_HTML5_Canvas-991b1b?style=for-the-badge)](https://github.com/iamthanushgowdap/TechSpark2k26)
[![Frontend](https://img.shields.io/badge/Stack-React_19_%E2%80%A2_Vite_6_%E2%80%A2_Tailwind_v4-18181b?style=for-the-badge)](https://github.com/iamthanushgowdap/TechSpark2k26)

</div>

---

## 1. Executive Summary & Vision

**TechSpark 2K26** is not a standard static event landing page. It is a custom-engineered, multi-layer **real-time 3D scrollytelling experience** built from the ground up to serve as the digital gateway for the annual inter-college fest of the **Department of Information Science & Engineering at APS College of Engineering (APSCE)**.

Inspired by the atmospheric visual language of *Stranger Things*, the platform synchronizes a **60 FPS Three.js WebGL skeletal animation stage**, **procedural fractal lightning synthesis**, **interactive 2D spore particle physics**, **multi-codec atmospheric video**, and a **focus-aware ambient audio engine** into a single cohesive narrative divided into three interactive chapters:

- **Chapter 01 — The Gate**: Dimensional entry sequence, live October 15 countdown telemetry, institutional emblem lockup, and the stalking 3D Demogorgon silhouette.
- **Chapter 02 — The 4 Trials**: Adaptive event discovery grid with slide-out briefing drawers, dual viewport layout geometry (full poster cards on desktop vs. high-density numeric dossier cards on mobile), and interactive rule breakdowns.
- **Chapter 03 — Survival Clearance**: Live venue navigation, Google Maps telemetry integration, full-stage 3D Demogorgon awakening choreography, developer spotlight modal, and an interaction-shielded `APSCE THINGS` closing cinema sequence.

---

## 2. The 4 Flagship Events

| Code | Event Title | Domain / Format | Team Composition | Campus Venue |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Treasure Hunt** | Campus-Wide Clue & Logic Hunt | 2 – 4 Members | APSCE Campus |
| **02** | **Battle Field** | Competitive Squad Gaming (`BGMI`) | 4 Members (Squad) | ISE Computer Lab |
| **03** | **Escape Room** | 30-Minute Timed Lockdown Chamber | 2 – 3 Members | ISE Block (Room 104) |
| **04** | **Cricket** | High-Pace 6-Over Box Cricket | 6 + 2 Players | College Sports Ground |

---

## 3. System Architecture & 6-Layer Visual Compositor

To achieve cinematic depth without sacrificing scroll responsiveness or frame pacing on mobile GPUs, the viewport is architected as a **6-layer hardware-accelerated compositor stack**:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ LAYER 6 (z-100+) : Interactive Modals, Slide-Out Event Drawer & Audio HUD   │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 5 (z-20)   : DOM Scrollytelling Narrative (Chapters 1, 2, 3 & Footer) │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 4 (z-10)   : Three.js WebGL Stage (Rigged 3D Demogorgon + Rim Lights) │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 3 (z-3)    : Interactive Spore Particle Physics Engine (2D Canvas)    │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 2 (z-2)    : Procedural Fractal Lightning Solver (2D High-DPI Canvas) │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 1 (z-0)    : Dual-Codec Atmospheric Video Loop & Blood-Moon Vignette  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.1. Three.js WebGL Scrollytelling Engine (`ScrollytellingCanvas.jsx`)
Rather than relying on pre-rendered video sequences, the centerpiece of the experience is a real-time **Three.js WebGL scene** driving a fully rigged 3D Demogorgon (`demogorgon_rig.glb`) via `THREE.GLTFLoader` and `THREE.AnimationMixer`.

- **Tone Mapping & Material Calibration**: Rendered using `THREE.ACESFilmicToneMapping` (`exposure: 1.35`) with `PCFSoftShadowMap` and dynamic DPR clamping (`Math.min(window.devicePixelRatio, 1.8)`) to prevent thermal throttling on high-density mobile OLED screens. Mesh materials are traversed at load time and calibrated to `roughness: 0.55` and `metalness: 0.15` so crimson rim lights catch organic specular highlights across the creature's musculature.
- **5-Point Volumetric Lighting Rig**:
  - **Ambient Base**: Deep blood-shadow fill (`#220508`, intensity `1.8`).
  - **Front Key Directional Light**: Warm off-white (`#fff5f5`, intensity `2.5`) positioned at `(0, 4, 5)`.
  - **Asymmetric Dual Crimson Rim Spotlights**: Left (`#ff0a18`, intensity `14`, angle `π/3`, penumbra `0.4` at `(-4, 3, -2)`) and Right (`#ff1828`, intensity `12` at `(4, 2.5, -2)`) to carve a sharp silhouette edge against the dark fog.
  - **Abyssal Under-Glow**: Point light (`#ff0015`, intensity `4`, distance `8` at `(0, -1, 1)`) simulating light radiating upward from the dimensional rift.
- **Scroll-Synchronized Skeletal State Machine**:
  - **Stage 1 (`0.00 ≤ p < 0.16` — Hero Stalk)**: The model stands centered behind the typography at `(0, -0.92, 0)` running the skeletal `idle` clip with subtle sinusoidal vertical breathing (`Math.sin(t * 2) * 0.015`) and damped cursor/gyro parallax (`lerp factor: 0.05`).
  - **Stage 2 (`0.16 ≤ p < 0.30` — Camera Pounce Transition)**: As the user scrolls past the hero section, normalized jump progress `jumpP = (p - 0.16) / 0.14` drives a rapid forward lunge across the Z-axis (`z: 0 → +5.2`, `y: -0.92 → -0.07`) while crossfading (`0.3s` blend) into the `pounce` animation clip (`THREE.LoopOnce` with `clampWhenFinished`), making the Demogorgon leap directly over the user's camera plane.
  - **Stage 3 (DOM Bounding-Box Occlusion Guard)**: During Chapter 2 (Event Cards), the Developer Spotlight, and the Final Footer Cinema, the engine queries live `getBoundingClientRect()` telemetry on `#chapter-3` and `#final-footer` every frame. The 3D mesh is dynamically culled (`model.visible = false`) whenever readable UI cards or footer video occupy the viewport, and re-materializes exclusively inside the dedicated Chapter 3 clearance window (`c3Rect.top < innerHeight * 0.55 && footerRect.top >= innerHeight * 0.65`) to execute its `pounceHit` awakening roar sequence.

### 3.2. Recursive Fractal Lightning Solver (`LightningCanvas.jsx`)
The storm sky is powered by a custom 2D procedural lightning engine using **recursive midpoint displacement**:
- **Subdivision Geometry**: Each bolt starts at the upper viewport boundary and recursively subdivides line segments `(x1, y1) → (x2, y2)` until segment length drops below `15px` or recursion depth reaches `maxDepth = 3`.
- **Stochastic Forking**: At each midpoint, perpendicular displacement is injected (`±0.35 * dist` on X, `±0.20 * dist` on Y) with a `45%` probability of spawning secondary forked branches angled at `±1.2 rad`.
- **Double-Strike Storm Cadence**: Mimicking practical *Stranger Things* storm sequences, `40%` of primary strikes trigger a secondary twin discharge `120–220ms` later along a neighbouring trajectory, coupled with full-viewport crimson strobe flashes and realistic acoustic propagation delay (`180–330ms`) before thunder synthesis.

### 3.3. Interactive Upside Down Spore Physics (`ParticleCanvas.jsx`)
- Simulates floating organic ash and dimensional spores drifting across the viewport with multi-plane depth scaling, sinusoidal horizontal turbulence, and interactive pointer repulsion vectors.

### 3.4. Focus-Aware Audio Lifecycle Engine (`soundEngine.js`)
Web audio on immersive sites often becomes intrusive if left playing when users switch tabs or minimize the browser. The custom audio engine solves this with a strict **Foreground-Only Lifecycle Controller**:
- **Global Singleton Synchronization**: Attaches to `window.__techsparkAudio` so Vite HMR reloads or React component re-mounts never spawn duplicate overlapping audio tracks.
- **Multi-Event Visibility Guards**: Listens simultaneously to `document.visibilitychange`, `window.blur`, `window.focus`, `window.pagehide`, and `window.beforeunload`. The moment the user switches tabs, minimizes Chrome, or switches apps on mobile, playback is immediately suspended (`wasPlayingBeforeHide = true`) and seamlessly resumed only when the document regains active foreground focus—while strictly respecting manual user mute state.
- **Calibrated Gain Staging**: Ambient score is locked to a subtle `4%` linear gain (`0.04`) so atmospheric tension enhances rather than overpowers the browsing experience.

---

## 4. Engineering Challenges & Production War Stories

Building TechSpark 2K26 required overcoming multiple non-trivial engineering roadblocks across build infrastructure, 3D viewport math, mobile UX ergonomics, and cloud bandwidth constraints.

### Challenge 1: The Vercel 8GB RAM `SIGKILL` Out-Of-Memory (OOM) Crash
- **The Problem**: During production deployment on Vercel (`2 cores, 8 GB RAM` build container), `vite build` hung at the `transforming...` stage for over 85 seconds before the Linux kernel terminated the process with `SIGKILL (Out of Memory)`.
- **Root Cause Analysis**: Tailwind CSS v4's new Rust/Oxide scanner automatically crawls all files in the repository workspace by default when `@import "tailwindcss";` is declared. Because `public/assets/demogorgon_rig.glb` is a ~37 MB binary 3D asset containing raw vertex buffers and embedded textures, Tailwind's content extractor attempted to parse millions of binary bytes as UTF-8 candidate class strings, exhausting all 8 GB of container heap memory.
- **The Engineering Fix**: Reconfigured `src/index.css` to explicitly disable automatic workspace-wide binary crawling using `@import "tailwindcss" source(none);` and whitelisted only `./index.html` and `./src/**/*.{js,ts,jsx,tsx}` via `@source` directives. Build time dropped from an 85-second OOM crash to **under 4.5 seconds**.

### Challenge 2: 3D Demogorgon Viewport Collision vs. Footer Video & Mobile Text
- **The Problem**: Because the WebGL canvas is fixed (`position: fixed; inset: 0`) while the DOM narrative scrolls over it, fixed scroll-percentage thresholds (`scrollProgress > 0.65`) behaved differently across tall mobile screens (`9:19.5` aspect ratio) and wide laptop monitors (`16:9`). On laptops, the footer video overlapped the 3D Demogorgon's torso; on mobile, collapsed spacing caused the creature's face to clip behind paragraph text.
- **The Engineering Fix**:
  1. Replaced static percentage guesswork in Stage 3 with **real-time DOM bounding-box intersection math** (`getBoundingClientRect()`) tracking `#chapter-3` and `#final-footer` on every animation frame.
  2. Separated `#final-footer` into its own isolated structural section below `#chapter-3` and engineered a dedicated `min-h-[52vh] sm:min-h-[56vh]` 3D showcase clearing window between the Chapter 3 survival copy and the location/footer blocks.

### Challenge 3: Vercel Free-Tier Bandwidth Protection & 90% Media Re-Encoding Pipeline
- **The Problem**: High-resolution uncompressed assets (`48.4 MB` footer video, `39.8 MB` GLB model, multi-megabyte PNG emblems and portraits) would rapidly exhaust Vercel's Free Tier monthly bandwidth quota under heavy student traffic.
- **The Engineering Fix**: Executed a full-asset transcoding and optimization pipeline without visible quality degradation:
  - **Dual-Stream Video Transcoding**: Re-encoded `APSCE_THINGS_VID` at full `1920×1080` resolution using **VP9 (`.webm`, CRF 33)** down to **`4.68 MB`** and **H.264 (`.mp4`, CRF 27, `-movflags +faststart`)** down to **`5.01 MB`**—achieving a **90.3% size reduction** while stripping unused audio tracks (`-an`).
  - **GLB Internal Texture Recompression**: Extracted and optimized embedded high-res textures inside `demogorgon_rig.glb`, saving `3 MB` directly from the binary payload.
  - **Lossless/Perceptual Image Quantization**: Compressed institutional emblems and portraits by **77%–95%** (`college_logo.png`: `1.2 MB → 64 KB`, `apsce-things-logo.png`: `1.8 MB → 104 KB`, `techspark-logo.png`: `1.2 MB → 122 KB`).
  - **Edge CDN Immutable Caching (`vercel.json`)**: Configured `Cache-Control: public, max-age=31536000, immutable` across `/assets/(.*)` so repeat visits and page refreshes consume zero origin bandwidth.

### Challenge 4: Dual-Layout Responsive Ergonomics (Desktop Poster Cards vs. Mobile Compact Cards)
- **The Problem**: Tall `440px` poster cards with background imagery looked cinematic on desktop monitors but forced excessive vertical scrolling and visual clutter on mobile viewports.
- **The Engineering Fix**: Engineered a responsive dual-presentation card architecture in `ScrollySections.jsx`. Desktop viewports (`sm:` and above) render full atmospheric imagery, category badges, and hover zoom physics, whereas mobile viewports (`< 640px`) automatically strip the background image and top category row, collapsing into a compact, fast-scanning editorial dossier card anchored by outlined neon `01`–`04` indices.

### Challenge 5: Non-Interactive Cinema Footer Shielding
- **The Problem**: Mobile browsers (iOS Safari / Android Chrome) aggressively inject native video controls, double-tap fullscreen triggers, pinch-to-zoom, and long-press context menus onto `<video>` elements.
- **The Engineering Fix**: Wrapped the muted `APSCE_THINGS_VID` cinema player in a multi-attribute lockdown (`controls={false}`, `disablePictureInPicture`, `disableRemotePlayback`, `controlsList="nodownload nofullscreen noremoteplayback"`, `pointer-events-none`) backed by a transparent absolute interaction-shield layer (`z-10`) that intercepts and cancels `onContextMenu`, `onDoubleClick`, and touch gestures.

---

## 5. Tech Stack & Core Dependencies

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core UI Framework** | **React 19** (`v19.2.4`) | Component state orchestration, modal portals, and reactive scroll telemetry |
| **Build & Bundler** | **Vite 6** (`v6.4.4`) | Lightning-fast ESM HMR and optimized production rollups |
| **3D WebGL Engine** | **Three.js** (`v0.183.2`) | Real-time skeletal mesh rendering, `GLTFLoader`, `AnimationMixer`, and volumetric lighting |
| **Styling System** | **Tailwind CSS v4** (`@tailwindcss/vite`) | Scoped utility styling, custom responsive breakpoints, and neon glow shadows |
| **Typography** | **Zenlith • Benguiat • Cinzel • Space Grotesk** | Authentic 1980s supernatural title lockups paired with clean technical sans-serif body copy |
| **Iconography** | **Lucide React** | Sharp vector technical icons for telemetry, audio controls, and event drawers |
| **Deployment & CDN** | **Vercel** | Edge network hosting with custom immutable asset caching headers |

---

## 6. Repository Structure

```text
TechSpark-2k26/
├── public/
│   └── assets/
│       ├── demogorgon_rig.glb        # Rigged 3D Demogorgon mesh & skeletal animation clips
│       ├── APSCE_THINGS_VID.webm     # 1080p VP9 compressed closing cinema sequence (4.68 MB)
│       ├── APSCE_THINGS_VID.mp4      # 1080p H.264 fallback closing cinema sequence (5.01 MB)
│       ├── header-video.webm / .mp4  # Background dimensional rift video atmosphere
│       ├── stranger-things-theme.mp3 # Ambient background score loop
│       ├── demogorgon-roar.mp3       # Acoustic roar sample
│       ├── Zenlith.otf               # Custom display font for hero & chapter titles
│       └── *.png / *.jpeg            # Optimized institutional emblems & profile assets
├── src/
│   ├── components/
│   │   ├── AudioToggle.jsx           # Fixed top-right sound status HUD controller
│   │   ├── BenguiatTitle.jsx         # Hero emblem lockup, glowing portal aura & title typography
│   │   ├── CountdownClock.jsx        # Real-time telemetry countdown to October 15, 2026
│   │   ├── LightningCanvas.jsx       # Recursive midpoint-displacement 2D lightning solver
│   │   ├── ParticleCanvas.jsx        # Interactive Upside Down spore & ash particle canvas
│   │   ├── ScrollySections.jsx       # Narrative chapters, adaptive event cards, drawers & modals
│   │   ├── ScrollytellingCanvas.jsx  # Three.js WebGL 60FPS skeletal animation & camera stage
│   │   └── VideoAtmosphere.jsx       # Background atmospheric video & blood-moon vignette layer
│   ├── data/
│   │   └── eventsData.js             # Structured event metadata, schedules, rules & registration config
│   ├── utils/
│   │   └── soundEngine.js            # Focus-aware singleton audio engine with tab-visibility guards
│   ├── App.jsx                       # Root state container, entry gate & scroll progress normalizer
│   ├── index.css                     # Tailwind v4 source scoping, font-face rules & neon CSS utilities
│   └── main.jsx                      # React 19 DOM root mount
├── index.html                        # Viewport metadata, preconnect hints & root container
├── vercel.json                       # Edge CDN immutable cache-control rules for /assets/*
├── vite.config.js                    # Vite 6 + Tailwind v4 build pipeline configuration
└── package.json                      # Project manifest & scripts
```

---

## 7. Local Development & Build Instructions

### Prerequisites
- **Node.js** `v18.0.0+` (Recommended: `v20 LTS` or `v22`)
- **npm** `v9+`

### 1. Clone the Repository
```bash
git clone https://github.com/iamthanushgowdap/TechSpark2k26.git
cd TechSpark2k26
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser to inspect the live WebGL stage and scrollytelling pipeline.

### 4. Production Build & Verification
```bash
npm run build
npm run preview
```

---

## 8. Credits & Engineering

- **Designed & Engineered by**: **Thanush Gowda P** ([@iamthanushgowdap](https://github.com/iamthanushgowdap))  
  *Department of Information Science & Engineering (ISE), APS College of Engineering (APSCE), Bengaluru*
