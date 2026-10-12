import React, { useState, useEffect } from 'react';

export default function MindFlayerBackdrop({ isFlashing }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Primary Deep Red Upside Down Void Gradient */}
      <div className="absolute inset-0 bg-radial from-[#4a040b]/60 via-[#180105]/90 to-[#050106]" />

      {/* Layer 1: Distant Storm Clouds & Red Atmosphere */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen scale-110 transition-transform duration-700 ease-out"
        style={{
          backgroundImage: "url('/assets/mind-flayer-storm.jpg')",
          transform: `translate(${offset.x * 0.5}px, ${offset.y * 0.5}px) scale(${isFlashing ? 1.04 : 1.02})`,
          filter: isFlashing 
            ? 'brightness(1.9) contrast(1.4) saturate(1.8)' 
            : 'brightness(0.7) contrast(1.2) saturate(1.2)'
        }}
      />

      {/* Layer 2: Volumetric Blood Fog overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-[#050106] via-transparent to-[#280005]/40 opacity-80"
      />

      {/* Layer 3: Red Lightning Horizon Glow (intensifies during lightning strikes) */}
      <div 
        className={`absolute top-0 left-0 right-0 h-[65vh] bg-gradient-to-b from-[#ff1a2b]/30 via-[#880010]/15 to-transparent transition-opacity duration-200 ${
          isFlashing ? 'opacity-100 scale-105' : 'opacity-20'
        }`}
      />

      {/* Layer 4: Distant Mind Flayer Tendril Shadows */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom opacity-50 mix-blend-multiply pointer-events-none transition-all duration-300"
        style={{
          backgroundImage: "url('/assets/mind-flayer-storm.jpg')",
          filter: isFlashing ? 'drop-shadow(0 0 25px rgba(255, 0, 20, 0.9))' : 'none'
        }}
      />

      {/* Layer 5: Dark Vignette Edge Framing (Cinematic Letterbox feel) */}
      <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(3,0,5,0.95)]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050106] via-[#050106]/80 to-transparent" />
    </div>
  );
}
