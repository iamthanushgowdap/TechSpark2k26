import React, { useState, useEffect } from 'react';
import RedPortalCircle from './RedPortalCircle';
import ScrambleText from './ui/ScrambleText';
import { soundEngine } from '../utils/soundEngine';

export default function BenguiatTitle({ 
  isEntered = false, 
  onEnter, 
  modelProgress = 0, 
  isModelLoaded = false 
}) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showHeadline, setShowHeadline] = useState(false);

  // Smoothly interpolate loading progress from 0% to 100%
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const target = isModelLoaded ? 100 : Math.min(95, Math.max(current + 2, modelProgress));
      current += (target - current) * 0.15;
      const rounded = Math.min(100, Math.round(current));
      setDisplayProgress(rounded);

      if (rounded >= 100 && (isModelLoaded || target >= 95)) {
        clearInterval(interval);
        setDisplayProgress(100);
        setIsReady(true);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [modelProgress, isModelLoaded]);

  // Handle Enter trigger: sound + breach callback + choreographed text scramble entrance
  const handleEnterClick = () => {
    if (!isReady || isEntered) return;
    soundEngine.playDemogorgonRoar(0.35);
    if (onEnter) onEnter();

    // Circle energy surge plays first, then the text animation emerges
    setTimeout(() => {
      setShowHeadline(true);
    }, 320);
  };

  // Keyboard shortcut: Press ENTER or Spacebar to enter when ready
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && isReady && !isEntered) {
        handleEnterClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady, isEntered]);

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-5xl mx-auto py-0">
      {/* Top APSCE Logo - Pushed a Little Down */}
      <div className={`transition-all duration-700 ease-out flex items-center justify-center mt-3 sm:mt-5 mb-1 sm:mb-2 ${
        isEntered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 pointer-events-none scale-95'
      }`}>
        <img
          src="/assets/apsce-things-logo.png"
          alt="APSCE THINGS"
          className="w-44 sm:w-56 md:w-64 max-w-[72vw] h-auto object-contain filter drop-shadow-[0_0_18px_rgba(255,25,35,0.85)] drop-shadow-[0_0_45px_rgba(200,0,20,0.5)] select-none pointer-events-none"
        />
      </div>

      {/* Main Interactive Stage: Circle + Text Bar Moved Down (Under 3D Model Face) */}
      <div 
        onClick={!isEntered && isReady ? handleEnterClick : undefined}
        className={`relative w-full min-h-[220px] sm:min-h-[260px] flex items-center justify-center mt-7 sm:mt-11 md:mt-14 transition-all duration-700 ${
          !isEntered && isReady ? 'cursor-pointer' : ''
        }`}
      >
        {/* Flanking Badges: Larger, Left Logo a little Right & Up, Right Logo a little Left & Up */}
        <div className={`absolute -top-7 sm:-top-11 md:-top-13 inset-x-0 mx-auto w-full max-w-[290px] xs:max-w-[320px] sm:max-w-[430px] md:max-w-[500px] flex items-center justify-between px-2 sm:px-4 pointer-events-auto transition-all duration-700 z-25 ${
          isEntered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 pointer-events-none scale-90'
        }`}>
          {/* Green Annotation: APS College Crest (A little Right & Up, Bigger) */}
          <div 
            className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-110 translate-x-1.5 sm:translate-x-3 -translate-y-1 sm:-translate-y-2"
            title="APS College of Engineering"
          >
            <img
              src="/assets/college_logo.png"
              alt="APS College of Engineering Crest"
              className="w-14 h-18 xs:w-16 xs:h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 object-contain college-crest-white select-none pointer-events-none"
            />
          </div>

          {/* Yellow Annotation: TechSpark Emblem (A little Left & Up, Bigger) */}
          <div 
            className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-110 -translate-x-1.5 sm:-translate-x-3 -translate-y-1 sm:-translate-y-2"
            title="TechSpark 2K26"
          >
            <img
              src="/assets/techspark-logo.png"
              alt="TechSpark 2K26 Emblem"
              className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain techspark-emblem-glow select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Subtle Ambient Red Core Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          <div className={`rounded-full bg-red-600/20 blur-3xl transition-all duration-1000 ${
            isEntered ? 'w-80 h-80 sm:w-[500px] sm:h-[500px] bg-red-600/25' : 'w-56 h-56 sm:w-64 sm:h-64 animate-pulse'
          }`} />
        </div>

        {/* The Continuous Red Portal Circle */}
        <div className={`relative flex items-center justify-center transition-all duration-1000 ${
          isEntered ? 'scale-110 opacity-90' : 'scale-100 opacity-100'
        }`}>
          <RedPortalCircle
            isEntered={isEntered}
            radius={isEntered ? 115 : 95}
            particleCount={240}
            color="#ff1e27"
            particleSize={2.4}
            className="w-64 h-64 sm:w-80 sm:h-80"
          />
        </div>

        {/* BEFORE ENTER: Center of the Red Circle Display */}
        {!isEntered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-20">
            {!isReady ? (
              /* Loading Stage: Initializing & Numbering showing as before */
              <div className="flex flex-col items-center animate-fadeIn">
                <div className="font-benguiat text-4xl sm:text-5xl font-bold tracking-wider text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
                  {displayProgress}<span className="text-red-500 text-2xl font-mono-tech ml-0.5">%</span>
                </div>
                <div className="font-mono-tech text-[10px] sm:text-xs tracking-[0.3em] text-red-400 uppercase mt-2">
                  INITIALIZING
                </div>
              </div>
            ) : (
              /* Ready Stage: Middle enter should be white and nothing any other text */
              <button
                onClick={handleEnterClick}
                className="pointer-events-auto flex items-center justify-center cursor-pointer group active:scale-95 transition-transform"
                aria-label="Enter Festival"
              >
                <span className="font-benguiat text-4xl sm:text-5xl font-black tracking-[0.25em] text-white hover:text-red-100 transition-colors uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] drop-shadow-[0_0_35px_rgba(255,30,40,0.8)] animate-pulse">
                  ENTER
                </span>
              </button>
            )}
          </div>
        )}

        {/* AFTER ENTER: Headline Pushed Down UNDER 3D Model Face */}
        {isEntered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-30 pointer-events-none px-2 translate-y-4 sm:translate-y-7 md:translate-y-8">
            <div className={`flex flex-col items-center transition-all duration-700 transform ${
              showHeadline ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              {/* Stranger Things Glowing Top Framing Bar */}
              <div className="w-[88%] sm:w-[82%] h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ff1e27,0_0_25px_#ff1e27] mb-1 sm:mb-2" />

              <ScrambleText
                play={showHeadline}
                speed={40}
                delay={120}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                className="font-stranger-title text-[clamp(2.65rem,11.8vw,7.75rem)] leading-none text-white uppercase select-none scale-y-110"
              >
                TECHSPARK
              </ScrambleText>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Tier Department Lockup - Positioned in the Space Between TECHSPARK & Countdown */}
      {isEntered && (
        <div className={`mt-4 sm:mt-6 flex flex-col items-center justify-center text-center px-4 z-30 pointer-events-none transition-all duration-1000 delay-200 transform ${
          showHeadline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Tier 1: Department Of Kicker */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1">
            <span className="w-6 sm:w-10 h-[1.5px] bg-gradient-to-r from-transparent via-red-600 to-red-400 shadow-[0_0_8px_#ff1e27]" />
            <span className="font-sans text-[10px] xs:text-[11px] sm:text-xs font-bold tracking-[0.38em] text-red-400 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.98)]">
              DEPARTMENT OF
            </span>
            <span className="w-6 sm:w-10 h-[1.5px] bg-gradient-to-l from-transparent via-red-600 to-red-400 shadow-[0_0_8px_#ff1e27]" />
          </div>

          {/* Tier 2: Information Science */}
          <h3 className="font-sans text-base xs:text-lg sm:text-2xl md:text-3xl font-black tracking-[0.2em] sm:tracking-[0.24em] text-white uppercase leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)] drop-shadow-[0_0_18px_rgba(255,30,40,0.65)]">
            INFORMATION SCIENCE
          </h3>

          {/* Tier 3: & Engineering */}
          <p className="font-sans text-xs xs:text-sm sm:text-base md:text-lg font-extrabold tracking-[0.32em] text-red-200/95 uppercase mt-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.98)]">
            &amp; ENGINEERING
          </p>

          {/* Subtle Bottom Glowing Accent Line */}
          <div className="w-24 sm:w-36 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/80 to-transparent shadow-[0_0_10px_#ff1e27] mt-2" />
        </div>
      )}
    </div>
  );
}
