import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(true);

  const handleToggle = () => {
    const active = soundEngine.toggleAudio();
    setIsPlaying(active);
  };

  return (
    <button
      onClick={handleToggle}
      className={`group relative flex items-center justify-center gap-2 h-9 px-3 rounded-full border transition-all duration-300 backdrop-blur-md cursor-pointer active:scale-95 ${
        isPlaying 
          ? 'bg-red-950/60 border-red-600/70 text-red-200 shadow-[0_0_16px_rgba(255,20,30,0.5)]' 
          : 'bg-black/60 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
      }`}
      aria-label={isPlaying ? "Mute audio" : "Unmute audio"}
      title={isPlaying ? "Sound: ON (Click to mute)" : "Sound: OFF (Click to unmute)"}
    >
      {/* Sound Speaker Icon with On/Off State Transition */}
      <div className="relative flex items-center justify-center">
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        )}
      </div>

      {/* Animated Equalizer Waveform Bars when ON / Flat when OFF */}
      <div className="flex items-end gap-[2px] h-3.5">
        {isPlaying ? (
          <>
            <span className="w-[2px] h-3.5 bg-red-400 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" />
            <span className="w-[2px] h-2 bg-red-500 rounded-full animate-[bounce_0.8s_ease-in-out_infinite_0.1s]" />
            <span className="w-[2px] h-3 bg-red-400 rounded-full animate-[bounce_0.5s_ease-in-out_infinite_0.2s]" />
            <span className="w-[2px] h-1.5 bg-red-500 rounded-full animate-[bounce_0.7s_ease-in-out_infinite_0.15s]" />
          </>
        ) : (
          <>
            <span className="w-[2px] h-1 bg-zinc-700 rounded-full transition-all" />
            <span className="w-[2px] h-1 bg-zinc-700 rounded-full transition-all" />
            <span className="w-[2px] h-1 bg-zinc-700 rounded-full transition-all" />
            <span className="w-[2px] h-1 bg-zinc-700 rounded-full transition-all" />
          </>
        )}
      </div>
    </button>
  );
}
