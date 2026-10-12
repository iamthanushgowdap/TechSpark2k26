import React, { useState, useEffect } from 'react';
import VideoAtmosphere from './components/VideoAtmosphere';
import ScrollytellingCanvas from './components/ScrollytellingCanvas';
import ScrollySections from './components/ScrollySections';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [modelProgress, setModelProgress] = useState(0);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Disable browser scroll restoration and ensure clean start at top (scrollY = 0)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    setScrollProgress(0);
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setScrollProgress(0);
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!hasEntered) {
        window.scrollTo(0, 0);
        return;
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasEntered]);

  return (
    <main className={`relative min-h-screen bg-[#050106] text-white selection:bg-red-700 selection:text-white overflow-x-hidden ${!hasEntered ? 'overflow-y-hidden max-h-screen' : ''}`}>
      {/* 1. Cinematic Background Video Layer (Fixed full bleed) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <VideoAtmosphere />
      </div>

      {/* 2. 3D Demogorgon Scrollytelling Engine (Fixed, transforms in parallel with scroll) */}
      <ScrollytellingCanvas 
        scrollProgress={scrollProgress}
        onLoadProgress={(p) => setModelProgress(p)}
        onLoadComplete={() => setIsModelLoaded(true)}
        isEntered={hasEntered}
      />

      {/* 3. Subtle CRT Scanlines Overlay */}
      <div className="scanlines fixed inset-0 z-15 pointer-events-none opacity-25" />

      {/* 4. Scrollable Narrative Chapters (400vh parallel parallax content) */}
      <div className="relative z-20">
        <ScrollySections 
          isEntered={hasEntered}
          onEnter={handleEnter}
          modelProgress={modelProgress}
          isModelLoaded={isModelLoaded}
        />
      </div>
    </main>
  );
}
