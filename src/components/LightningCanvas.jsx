import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../utils/soundEngine';

export default function LightningCanvas({ onFlashChange }) {
  const canvasRef = useRef(null);
  const boltsRef = useRef([]);
  const animFrameRef = useRef(null);
  const nextStrikeTimerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI display
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create a branching fractal lightning bolt
    const createBolt = (startX, startY, endX, endY, intensity = 1) => {
      const segments = [];
      const branches = [];

      const generateBranch = (x1, y1, x2, y2, depth = 0, maxDepth = 3) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 15 || depth > maxDepth) {
          segments.push({ x1, y1, x2, y2, depth });
          return;
        }

        // Jagged midpoint displacement
        const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * (dist * 0.35);
        const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * (dist * 0.2);

        generateBranch(x1, y1, midX, midY, depth, maxDepth);
        generateBranch(midX, midY, x2, y2, depth, maxDepth);

        // Chance to spawn side-branch
        if (depth < 2 && Math.random() < 0.45) {
          const branchAngle = (Math.random() - 0.5) * 1.2;
          const branchLen = dist * 0.45;
          const branchEndX = midX + Math.cos(branchAngle) * branchLen + (Math.random() - 0.5) * 40;
          const branchEndY = midY + Math.sin(branchAngle) * branchLen + 50;
          generateBranch(midX, midY, branchEndX, branchEndY, depth + 1, maxDepth);
        }
      };

      generateBranch(startX, startY, endX, endY);

      return {
        segments,
        alpha: 1,
        fadeSpeed: 0.04 + Math.random() * 0.04,
        intensity,
      };
    };

    // Trigger a lightning strike sequence
    const triggerStrike = (targetX = null, targetY = null) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const startX = targetX !== null ? targetX + (Math.random() - 0.5) * 100 : Math.random() * w;
      const startY = 0;
      const endX = targetX !== null ? targetX : startX + (Math.random() - 0.5) * (w * 0.3);
      const endY = targetY !== null ? targetY : h * (0.4 + Math.random() * 0.5);

      const bolt = createBolt(startX, startY, endX, endY);
      boltsRef.current.push(bolt);

      // Trigger screen strobe flash
      if (onFlashChange) {
        onFlashChange(true);
        setTimeout(() => onFlashChange(false), 220);
      }

      // Audio trigger with realistic propagation delay
      soundEngine.playLightningCrack(0.35);
      setTimeout(() => {
        soundEngine.playThunder(0.5);
      }, 180 + Math.random() * 150);

      // Chance of rapid double-strike (very common in Stranger Things storms)
      if (Math.random() < 0.4) {
        setTimeout(() => {
          const secondBolt = createBolt(startX + (Math.random() - 0.5) * 80, 0, endX + (Math.random() - 0.5) * 50, endY);
          boltsRef.current.push(secondBolt);
          if (onFlashChange) {
            onFlashChange(true);
            setTimeout(() => onFlashChange(false), 160);
          }
          soundEngine.playLightningCrack(0.25);
        }, 120 + Math.random() * 100);
      }
    };

    // Automated periodic storm strikes
    const scheduleNextStrike = () => {
      const delay = 4500 + Math.random() * 6500; // between 4.5s and 11s
      nextStrikeTimerRef.current = setTimeout(() => {
        triggerStrike();
        scheduleNextStrike();
      }, delay);
    };

    scheduleNextStrike();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = boltsRef.current.length - 1; i >= 0; i--) {
        const bolt = boltsRef.current[i];
        bolt.alpha -= bolt.fadeSpeed;

        if (bolt.alpha <= 0) {
          boltsRef.current.splice(i, 1);
          continue;
        }

        // Draw multiple passes for glowing bloom
        bolt.segments.forEach(seg => {
          const branchFactor = 1 / (seg.depth + 1);

          // Pass 1: Outer Crimson Bloom
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.strokeStyle = `rgba(255, 20, 30, ${bolt.alpha * 0.6 * branchFactor})`;
          ctx.lineWidth = 9 * branchFactor;
          ctx.shadowColor = '#ff0015';
          ctx.shadowBlur = 30;
          ctx.stroke();

          // Pass 2: Vivid Red Core
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.strokeStyle = `rgba(255, 70, 70, ${bolt.alpha * 0.9 * branchFactor})`;
          ctx.lineWidth = 3.5 * branchFactor;
          ctx.shadowBlur = 12;
          ctx.stroke();

          // Pass 3: Piercing White-Pink Filament
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.strokeStyle = `rgba(255, 240, 240, ${bolt.alpha * 0.95})`;
          ctx.lineWidth = 1.2 * branchFactor;
          ctx.shadowBlur = 4;
          ctx.stroke();
        });
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Interactive click: summon lightning at touch or cursor point!
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      triggerStrike(x, y);
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(nextStrikeTimerRef.current);
    };
  }, [onFlashChange]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-auto cursor-crosshair opacity-90 transition-opacity"
      title="Click anywhere to summon red lightning"
    />
  );
}
