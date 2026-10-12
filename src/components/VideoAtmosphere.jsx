import React, { useRef, useEffect } from 'react';

export default function VideoAtmosphere() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      // Ensure autoplay succeeds across all mobile browsers
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented, keep muted and try again
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
      }
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#050106]">
      {/* 1. Cinematic Background Video Loop (Optimized WebM + MP4 Fallback) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster="/assets/hero-poster.jpg?v=2"
        className="absolute inset-0 w-full h-full object-cover object-center scale-100 filter contrast-115 brightness-100 transition-transform duration-1000 ease-out"
      >
        <source src="/assets/Background_Video.webm?v=2" type="video/webm" />
        <source src="/assets/Background_Video.mp4?v=2" type="video/mp4" />
      </video>

      {/* 2. Soft Atmospheric Shadow Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#050106]/60" />
      
      {/* 3. Deep Cinematic Edge Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(3,0,5,0.7)]" />

      {/* 4. Bottom Smooth Fade to Black for Clean Scroll Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050106] via-[#050106]/80 to-transparent" />
    </div>
  );
}
