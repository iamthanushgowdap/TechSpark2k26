import React from 'react';

export default function CountdownClock() {
  return (
    <div className="flex flex-col items-center select-none font-sans">
      {/* October 15th & 16th Header - Bold, Energetic, Elegant 3D Beveled Typography */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-8 sm:w-14 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-red-400 shadow-[0_0_10px_#ff1e27]" />
          <span className="text-red-500 text-[9px] sm:text-[10px] drop-shadow-[0_0_8px_#ff1e27]">◆</span>
        </div>
        <span className="font-cinzel text-xs xs:text-sm sm:text-lg md:text-xl font-black tracking-[0.2em] sm:tracking-[0.28em] text-white uppercase scale-y-105 whitespace-nowrap">
          OCTOBER 15TH &amp; 16TH • MISSION COMPLETE
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-red-500 text-[9px] sm:text-[10px] drop-shadow-[0_0_8px_#ff1e27]">◆</span>
          <span className="w-8 sm:w-14 h-[2px] bg-gradient-to-l from-transparent via-red-600 to-red-400 shadow-[0_0_10px_#ff1e27]" />
        </div>
      </div>

      {/* Retro Sci-Fi Concluded Console */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#160105]/95 via-black/95 to-[#160105]/95 border border-red-800/60 backdrop-blur-xl shadow-[0_0_40px_rgba(255,20,30,0.25)]">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-700/70">
          <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ff1e27] animate-pulse" />
          <span className="font-benguiat text-xs sm:text-sm font-bold tracking-wider text-red-200 uppercase">
            EVENT CONCLUDED
          </span>
        </div>

        <span className="hidden sm:inline text-red-900">•</span>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
          <span className="font-sans font-medium text-zinc-200">
            All event gates are officially closed.
          </span>
          <span className="text-zinc-500 hidden md:inline">|</span>
          <span className="text-red-400/90 text-xs hidden md:inline">
            Thank you to all squads, participants &amp; survivors!
          </span>
        </div>
      </div>
    </div>
  );
}
