import React, { useState } from 'react';
import { Terminal, AlertOctagon, FileText, Sparkles, Eye } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import Demogorgon3D from './Demogorgon3D';

export default function HawkinsLabSection() {
  const [decrypted, setDecrypted] = useState(false);

  const handleDecrypt = () => {
    soundEngine.playPortalGlitch();
    setDecrypted(true);
  };

  return (
    <section id="about" className="relative min-h-screen w-full bg-[#050106] py-20 px-4 sm:px-8 overflow-hidden border-t border-red-950/60">
      {/* Background Volumetric Fog & Spores */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen pointer-events-none"
        style={{ backgroundImage: "url('/assets/demogorgon-fog.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050106] via-transparent to-[#050106] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header Marker */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono-tech text-xs text-red-500 tracking-[0.3em] font-bold">
            ( SEC. 002 )
          </span>
          <div className="h-[1px] w-12 bg-red-800" />
          <span className="font-mono-tech text-xs text-zinc-400 tracking-widest uppercase">
            HAWKINS LAB ARCHIVES • 1986
          </span>
        </div>

        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-benguiat text-4xl sm:text-5xl md:text-6xl font-black text-red-100 tracking-tight stranger-title">
              THE UPSIDE DOWN
            </h2>
            <p className="font-mono-tech text-xs sm:text-sm text-red-400 tracking-widest uppercase mt-2">
              WHERE REALITY BENDS AND CODE RESHAPES THE DIMENSION
            </p>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 font-mono-tech text-xs">
            <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse" />
            <span>THREAT LEVEL: OMEGA</span>
          </div>
        </div>

        {/* Main 2-Column Split: Visual 3D Creature Stage + Classified Lab Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive 3D Demogorgon with Animations */}
          <div className="lg:col-span-7">
            <Demogorgon3D />
          </div>

          {/* Right Column: Classified Terminal Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="crimson-glow-card rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-red-900/40">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-red-400" />
                  <span className="font-mono-tech text-xs text-red-300 tracking-wider uppercase font-bold">
                    LAB DOSSIER // DEPT-CSE
                  </span>
                </div>
                <span className="font-mono-tech text-[10px] text-red-500 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                  TOP SECRET
                </span>
              </div>

              {/* Dossier Body Text */}
              <div className="mt-5 space-y-4 font-mono-tech text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <p>
                  In the depths of <strong className="text-red-400">APSCE</strong>, an energy surge opened a tear in the fabric between our world and the Upside Down. 
                  <span className="text-white font-semibold"> TechSpark 2k26</span> is the arena where Karnataka's sharpest minds assemble to battle the anomalies.
                </p>
                <p className="text-zinc-400">
                  Engineers, coders, gamers, and strategists will navigate through high-voltage algorithmic puzzles, robotic combat zones, 36-hour nocturnal hackathons, and enigmatic treasure hunts.
                </p>
                
                {decrypted ? (
                  <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-600/40 text-red-200 text-xs animate-fadeIn space-y-1">
                    <div className="font-bold text-red-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      <span>PHASE 2 UNLOCKED: 3D CREATURE LAB</span>
                    </div>
                    <div>Demogorgon 3D Model viewer & Hawkins Laboratory clearance credentials ready for initialization.</div>
                  </div>
                ) : (
                  <button
                    onClick={handleDecrypt}
                    className="w-full mt-2 py-2.5 px-4 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-700/60 text-red-200 font-mono-tech text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(255,0,0,0.2)]"
                  >
                    <Eye className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                    <span>DECRYPT CLASSIFIED DATA</span>
                  </button>
                )}
              </div>

              {/* Lab Metadata Footer */}
              <div className="mt-6 pt-4 border-t border-red-950/40 flex items-center justify-between text-[11px] font-mono-tech text-zinc-500">
                <span>RECORD ID: #TK-86-UP</span>
                <span>CLEARANCE: LEVEL 4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
