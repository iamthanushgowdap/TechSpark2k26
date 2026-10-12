import React, { useState } from 'react';
import { ShieldAlert, Zap, Radio, ChevronDown, Compass, Flame } from 'lucide-react';
import VideoAtmosphere from './VideoAtmosphere';
import BenguiatTitle from './BenguiatTitle';
import CountdownClock from './CountdownClock';
import AudioToggle from './AudioToggle';
import { soundEngine } from '../utils/soundEngine';

export default function HeroSection({ onEnterUpsideDown }) {
  const [activeTab, setActiveTab] = useState('gate');

  const handlePortalEnter = () => {
    soundEngine.playPortalGlitch();
    soundEngine.playClockChime();
    if (onEnterUpsideDown) {
      onEnterUpsideDown();
    } else {
      const target = document.getElementById('about');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#050106]">
      {/* 1. Cinematic Background Video Loop (Optimized WebM + MP4 Fallback) */}
      <VideoAtmosphere />

      {/* 2. CRT Scanlines & Atmospheric Vignette */}
      <div className="scanlines absolute inset-0 z-20 pointer-events-none opacity-30" />

      {/* 5. TOP COMMAND NAVIGATION BAR */}
      <header className="relative z-30 w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between border-b border-red-950/40 bg-black/40 backdrop-blur-md">
        {/* Left: Hawkins Lab Seal */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-red-600/60 bg-red-950/30 flex items-center justify-center shadow-[0_0_12px_rgba(255,20,30,0.5)]">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <div>
            <div className="font-mono-tech text-xs sm:text-sm font-bold tracking-widest text-zinc-200 uppercase flex items-center gap-2">
              HAWKINS NATIONAL LAB
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] bg-red-900/60 text-red-300 border border-red-700/50 rounded">
                SEC-4
              </span>
            </div>
            <div className="font-mono-tech text-[10px] text-red-400/80 tracking-wider">
              DEPT OF ENERGY • RESTRICTED ARCHIVE
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Chapter Markers */}
        <nav className="hidden lg:flex items-center gap-6 font-mono-tech text-xs tracking-widest text-zinc-400">
          <a href="#hero" className="text-red-400 flex items-center gap-1.5 hover:text-red-300 transition-colors">
            <span className="text-[10px] text-red-500 font-bold">[01]</span> THE GATE
          </a>
          <a href="#about" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-600 font-bold">[02]</span> HAWKINS LAB
          </a>
          <a href="#events" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-600 font-bold">[03]</span> ARENAS
          </a>
          <a href="#schedule" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-600 font-bold">[04]</span> VECNA'S CLOCK
          </a>
          <a href="#register" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-600 font-bold">[05]</span> PORTAL PASS
          </a>
        </nav>

        {/* Right: Audio Toggle & Quick Lightning Summoner */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundEngine.playLightningCrack(0.4);
              setTimeout(() => soundEngine.playThunder(0.55), 240);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-900/60 bg-red-950/20 text-red-300 font-mono-tech text-xs hover:bg-red-900/40 hover:border-red-600 transition-all shadow-[0_0_10px_rgba(255,0,0,0.2)]"
            title="Play lightning sound"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/50" />
            <span>DISCHARGE</span>
          </button>
          
          <AudioToggle />
        </div>
      </header>

      {/* 6. MAIN HERO STAGE CONTENT */}
      <div className="relative z-30 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 text-center max-w-5xl mx-auto w-full">
        {/* Top Warning Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/50 border border-red-600/40 text-red-300 font-mono-tech text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-4 shadow-[0_0_15px_rgba(255,20,30,0.25)]">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-bounce" />
          <span>PORTAL ACTIVE // DIMENSIONAL ANOMALY DETECTED</span>
        </div>

        {/* The Iconic Benguiat Title */}
        <BenguiatTitle />

        {/* Countdown Clock to Fest Launch */}
        <div className="mt-5 sm:mt-7">
          <CountdownClock />
        </div>

        {/* Primary Interactive CTAs - Inspired by Reference 0cd48c1c05d0c25b12c752f1e6b669e8.jpg */}
        <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Main Enter Portal Button */}
          <button
            onClick={handlePortalEnter}
            className="group relative px-7 py-3 rounded-md bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white font-mono-tech font-bold text-xs sm:text-sm tracking-[0.2em] uppercase border border-red-500/60 shadow-[0_0_20px_rgba(255,20,30,0.4)] hover:shadow-[0_0_35px_rgba(255,30,40,0.7)] transition-all duration-300 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>ENTER THE UPSIDE DOWN</span>
          </button>

          {/* Reference Style Underline Button: "BACK TO HAWKINS" */}
          <a
            href="#about"
            onClick={() => soundEngine.playPortalGlitch()}
            className="group inline-flex flex-col items-center cursor-pointer text-zinc-300 hover:text-white transition-colors"
          >
            <span className="font-mono-tech text-xs sm:text-sm tracking-[0.25em] uppercase font-bold text-zinc-200 group-hover:text-red-300 transition-colors">
              BACK TO HAWKINS
            </span>
            <span className="h-[2px] w-full bg-red-600 mt-1 shadow-[0_0_8px_#ff1e27] group-hover:bg-red-500 transition-colors" />
          </a>
        </div>
      </div>

      {/* 7. BOTTOM LIVE TELEMETRY & HUD METRICS */}
      <footer className="relative z-30 w-full border-t border-red-950/40 bg-black/70 backdrop-blur-lg px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left font-mono-tech text-[10px] sm:text-xs text-zinc-400">
          {/* Coordinates & Location */}
          <div className="flex items-center gap-4">
            <span className="text-red-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              PORTAL: [ HAWKINS LAB - GRID 07 ]
            </span>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <span className="hidden sm:inline text-zinc-400">
              COORDS: 40.0488° N, 86.5517° W
            </span>
          </div>

          {/* Fest Highlights / Telemetry Metrics */}
          <div className="flex items-center gap-3 sm:gap-6 text-zinc-300">
            <div>
              <span className="text-red-400 font-bold">10+</span> ARENAS
            </div>
            <span className="text-zinc-700">|</span>
            <div>
              <span className="text-red-400 font-bold">₹50,000+</span> PRIZES
            </div>
            <span className="text-zinc-700">|</span>
            <div>
              <span className="text-red-400 font-bold">36 HRS</span> HACKATHON
            </div>
            <span className="text-zinc-700">|</span>
            <div className="text-red-400 font-semibold animate-pulse">
              BREACH DETECTED
            </div>
          </div>

          {/* Scroll Down Hint */}
          <div className="hidden lg:flex items-center gap-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer">
            <span>SCROLL TO PROCEED</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </div>
      </footer>
    </section>
  );
}
