import React, { useState, useEffect } from 'react';

export default function CountdownClock() {
  // Target fest date: October 15th, 2026
  const targetDate = new Date('2026-10-15T09:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n) => String(n).padStart(2, '0');

  const timeSegments = [
    { label: 'DAYS', value: pad(timeLeft.days) },
    { label: 'HOURS', value: pad(timeLeft.hours) },
    { label: 'MINUTES', value: pad(timeLeft.minutes) },
    { label: 'SECONDS', value: pad(timeLeft.seconds) },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* October 15th Header - Bold, Energetic, Elegant 3D Beveled Typography */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-8 sm:w-14 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-red-400 shadow-[0_0_10px_#ff1e27]" />
          <span className="text-red-500 text-[9px] sm:text-[10px] drop-shadow-[0_0_8px_#ff1e27]">◆</span>
        </div>
        <span className="font-cinzel text-base xs:text-lg sm:text-xl md:text-2xl font-black tracking-[0.28em] sm:tracking-[0.34em] text-white uppercase scale-y-105 select-none">
          OCTOBER 15TH
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-red-500 text-[9px] sm:text-[10px] drop-shadow-[0_0_8px_#ff1e27]">◆</span>
          <span className="w-8 sm:w-14 h-[2px] bg-gradient-to-l from-transparent via-red-600 to-red-400 shadow-[0_0_10px_#ff1e27]" />
        </div>
      </div>

      {/* Retro LED Countdown Boxes */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 rounded-xl bg-black/60 border border-red-900/40 backdrop-blur-md shadow-[0_0_30px_rgba(255,20,30,0.15)]">
        {timeSegments.map((item, idx) => (
          <React.Fragment key={item.label}>
            <div className="flex flex-col items-center min-w-[56px] sm:min-w-[70px] md:min-w-[80px]">
              {/* Digit Box */}
              <div className="w-full py-1.5 sm:py-2 px-1 text-center bg-gradient-to-b from-[#220205] to-[#0c0003] border border-red-800/50 rounded-lg shadow-[inset_0_1px_0_rgba(255,80,80,0.3)]">
                <span className="font-retro-terminal text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-red-200 drop-shadow-[0_0_10px_rgba(255,30,40,0.9)]">
                  {item.value}
                </span>
              </div>
              {/* Label */}
              <span className="text-[9px] sm:text-[10px] font-mono-tech tracking-wider text-red-400/80 mt-1 uppercase font-semibold">
                {item.label}
              </span>
            </div>

            {/* Glowing Colon Separator */}
            {idx < timeSegments.length - 1 && (
              <span className="font-retro-terminal text-xl sm:text-2xl text-red-500 animate-pulse -mt-4">
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
