import React, { useRef, useEffect, useCallback } from "react";

const TWO_PI = Math.PI * 2;
const BASE_SPIN_RATE = 0.0022;

export function RedPortalCircle({
  isEntered = false,
  radius = 95,
  particleCount = 240,
  color = "#ff1e27",
  particleSize = 2.4,
  className = "",
}) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const initParticles = useCallback((cx, cy, currentRadius) => {
    const particles = [];
    const count = particleCount;
    const angleStep = TWO_PI / count;

    for (let i = 0; i < count; i++) {
      const seed = Math.random();
      const orbitAngle = i * angleStep + seed * 0.12;
      const r = currentRadius * (0.86 + seed * 0.28);
      particles.push({
        orbitAngle,
        baseRadius: r,
        currentRadius: r,
        x: cx + Math.cos(orbitAngle) * r,
        y: cy + Math.sin(orbitAngle) * r,
        seed: seed * 1000,
        sizeMod: 0.75 + seed * 0.5,
        alpha: 0.7 + seed * 0.3,
      });
    }
    return particles;
  }, [particleCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = Math.max(1, rect.width || radius * 2 + 80);
    const cssH = Math.max(1, rect.height || radius * 2 + 80);

    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const cx = cssW / 2;
    const cy = cssH / 2;

    const currentRadius = Math.min(radius, Math.min(cssW, cssH) * 0.42);
    const particles = initParticles(cx, cy, currentRadius);

    engineRef.current = {
      ctx,
      dpr,
      cssW,
      cssH,
      cx,
      cy,
      particles,
      targetRadius: currentRadius,
      actualRadius: currentRadius,
      spinSpeed: BASE_SPIN_RATE,
      color,
    };
  }, [radius, color, initParticles]);

  // Adjust dynamics on enter
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (isEntered) {
      // Energetic flare upon breach, then continuous smooth portal rotation
      engine.spinSpeed = BASE_SPIN_RATE * 1.5;
      engine.targetRadius = engine.actualRadius * 1.08;
    } else {
      engine.spinSpeed = BASE_SPIN_RATE;
      engine.targetRadius = Math.min(radius, Math.min(engine.cssW, engine.cssH) * 0.42);
    }
  }, [isEntered, radius]);

  // Pointer interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointercancel", onPointerLeave);

    return () => {
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointercancel", onPointerLeave);
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    let running = true;

    const tick = (now) => {
      if (!running) return;
      const engine = engineRef.current;
      if (engine) {
        const { ctx, dpr, cssW, cssH, cx, cy, particles, spinSpeed } = engine;

        // Smoothly interpolate radius if target shifted
        engine.actualRadius += (engine.targetRadius - engine.actualRadius) * 0.05;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, cssW, cssH);

        const spin = (now * spinSpeed) % TWO_PI;
        const mouse = mouseRef.current;
        const mouseRadius = 90;
        const mouseRadiusSq = mouseRadius * mouseRadius;

        ctx.fillStyle = color;
        ctx.beginPath();

        const len = particles.length;
        const baseSize = particleSize;

        for (let i = 0; i < len; i++) {
          const p = particles[i];
          const angle = p.orbitAngle + spin;
          // Organic pulsing radial wave
          const wave = Math.sin(now * 0.0022 + p.seed) * 3;
          let r = engine.actualRadius * (p.baseRadius / (radius || 95)) + wave;

          let px = cx + Math.cos(angle) * r;
          let py = cy + Math.sin(angle) * r;

          // Pointer magnetism / flare
          if (mouse.active) {
            const dx = px - mouse.x;
            const dy = py - mouse.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < mouseRadiusSq && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const push = (1 - dist / mouseRadius) * 16;
              px += (dx / dist) * push;
              py += (dy / dist) * push;
            }
          }

          const dotR = (baseSize * p.sizeMod) * 0.5;
          ctx.moveTo(px + dotR, py);
          ctx.arc(px, py, dotR, 0, TWO_PI);
        }

        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [color, particleSize, radius]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-auto filter drop-shadow-[0_0_12px_rgba(255,20,30,0.85)] drop-shadow-[0_0_28px_rgba(220,0,20,0.6)]"
      />
    </div>
  );
}

export default RedPortalCircle;
