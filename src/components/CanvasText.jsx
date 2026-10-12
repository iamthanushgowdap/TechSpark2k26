import * as React from "react";
import { cn } from "@/lib/utils";

const DEFAULT_FONT_FAMILY =
  "'Bebas Neue', 'Anton', sans-serif";

const SPIN_RATE = 0.0024;
/** Soft cap — denser samples are stride-skipped so mobile stays smooth. */
const MAX_PARTICLES = 3600;
const RESIZE_DEBOUNCE_MS = 80;
const TWO_PI = Math.PI * 2;

/**
 * Canvas-backed particle headline. Samples rasterized glyphs into points that
 * load as a spinning portal circle, then morphs into the letterforms upon trigger.
 */
export function CanvasText({
  text = "TECHSPARK",
  color = "#ffffff",
  particleSize = 2.4,
  density = 1.7,
  drift = 0.6,
  scatter = 95,
  loadDuration = 0.3,
  morphDuration = 1.5,
  magnetic = 0.45,
  magneticRadius = 120,
  paused,
  holdOnCircle = false,
  onMorphComplete,
  replayKey,
  className,
  fontSize = 125,
  fontWeight = 900,
  fontFamily = DEFAULT_FONT_FAMILY,
  subtext = "ISE",
}) {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const engineRef = React.useRef(null);
  const offscreenRef = React.useRef(null);
  const rafRef = React.useRef(0);
  const resizeTimerRef = React.useRef(null);
  const wrapRectRef = React.useRef(null);
  const inViewRef = React.useRef(true);
  const pageVisibleRef = React.useRef(true);
  const pausedPropRef = React.useRef(paused);
  const colorPropRef = React.useRef(color);
  const holdOnCirclePropRef = React.useRef(holdOnCircle);
  const onMorphCompleteRef = React.useRef(onMorphComplete);
  const kickLoopRef = React.useRef(null);

  pausedPropRef.current = paused;
  colorPropRef.current = color;
  holdOnCirclePropRef.current = holdOnCircle;
  onMorphCompleteRef.current = onMorphComplete;

  const safeDensity = Math.max(1, Math.round(density));
  const safeParticleSize = Math.max(0.6, particleSize);
  const safeDrift = Math.max(0, drift);
  const safeScatter = Math.max(12, scatter);
  const safeLoadDuration = Math.max(0.2, loadDuration);
  const safeMorphDuration = Math.max(0.2, morphDuration);
  const safeMagnetic = Math.max(0, magnetic);
  const safeMagneticRadius = Math.max(8, magneticRadius);

  const hostMinHeight = Math.max(
    220,
    Math.ceil(safeScatter * 2.3 + safeParticleSize * 4 + 40),
  );

  const liveRef = React.useRef({
    particleSize: safeParticleSize,
    drift: safeDrift,
    magnetic: safeMagnetic,
    magneticRadius: safeMagneticRadius,
    holdOnCircle: holdOnCircle,
  });
  liveRef.current = {
    particleSize: safeParticleSize,
    drift: safeDrift,
    magnetic: safeMagnetic,
    magneticRadius: safeMagneticRadius,
    holdOnCircle: holdOnCircle,
  };

  const rebuild = React.useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const cssW = Math.max(1, wrap.clientWidth);
    const cssH = Math.max(1, wrap.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cx = cssW / 2;
    const cy = cssH / 2;
    const pixelW = Math.max(1, Math.round(cssW * dpr));
    const pixelH = Math.max(1, Math.round(cssH * dpr));

    // Avoid resetting the bitmap (and flashing) when size is unchanged.
    if (canvas.width !== pixelW) canvas.width = pixelW;
    if (canvas.height !== pixelH) canvas.height = pixelH;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    // Reuse the existing 2d context when the canvas bitmaps were not reset.
    const prev = engineRef.current;
    const ctx =
      prev && prev.width === cssW && prev.height === cssH && prev.dpr === dpr
        ? prev.ctx
        : canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resolvedColor = resolveFillColor(wrap, colorPropRef.current);

    let off = offscreenRef.current;
    if (!off) {
      off = document.createElement("canvas");
      offscreenRef.current = off;
    }
    if (off.width !== pixelW) off.width = pixelW;
    if (off.height !== pixelH) off.height = pixelH;

    const octx = off.getContext("2d", { willReadFrequently: true });
    if (!octx) return;

    // Dynamically scale font size so headline never overflows on smaller screens
    // Bebas Neue is a tall condensed font with character aspect ratio ~0.50
    const targetText = text || " ";
    const approxCharWidth = fontSize * 0.52;
    const maxAllowedWidth = cssW * 0.94;
    const computedFontSize =
      targetText.length * approxCharWidth > maxAllowedWidth
        ? Math.max(28, Math.floor(maxAllowedWidth / (targetText.length * 0.52)))
        : fontSize;

    const safeFontSize = Math.max(16, computedFontSize);
    octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    octx.clearRect(0, 0, cssW, cssH);
    octx.fillStyle = "#ffffff";
    if ('letterSpacing' in octx) {
      octx.letterSpacing = "0.03em";
    }
    octx.font = `${fontWeight} ${safeFontSize}px ${fontFamily}`;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(targetText, cx, cy);

    // Read only the glyph bounding box — full-canvas getImageData is expensive.
    const metrics = octx.measureText(targetText);
    const textW = Math.max(
      safeFontSize,
      metrics.width ||
        (metrics.actualBoundingBoxLeft ?? 0) +
        (metrics.actualBoundingBoxRight ?? metrics.width / 2),
    );
    const ascent = metrics.actualBoundingBoxAscent || safeFontSize * 0.78;
    const descent = metrics.actualBoundingBoxDescent || safeFontSize * 0.16;
    const textH = ascent + descent;

    const pad = Math.ceil(safeFontSize * 0.25);
    const boxCssX = Math.max(0, Math.floor(cx - textW / 2 - pad));
    const boxCssY = Math.max(0, Math.floor(cy - ascent - pad));
    const boxCssW = Math.min(cssW - boxCssX, Math.ceil(textW + pad * 2));
    const boxCssH = Math.min(cssH - boxCssY, Math.ceil(textH + pad * 2));
    const boxX = Math.floor(boxCssX * dpr);
    const boxY = Math.floor(boxCssY * dpr);
    const boxW = Math.max(1, Math.ceil(boxCssW * dpr));
    const boxH = Math.max(1, Math.ceil(boxCssH * dpr));

    const textBounds = {
      x: boxCssX,
      y: boxCssY,
      width: boxCssW,
      height: boxCssH,
      textW,
      textH,
      topY: cy - ascent,
      bottomY: cy + descent,
      safeFontSize,
    };

    const {
      data,
      width: dataW,
      height: dataH,
    } = octx.getImageData(boxX, boxY, boxW, boxH);
    let step = Math.max(1, Math.round(safeDensity * dpr));

    // Estimate sample count; widen stride if we'd blow the particle budget.
    const approx = Math.ceil(dataW / step) * Math.ceil(dataH / step) * 0.35;
    if (approx > MAX_PARTICLES) {
      step = Math.max(
        step,
        Math.ceil(Math.sqrt((dataW * dataH * 0.35) / MAX_PARTICLES)),
      );
    }

    const particles = [];
    const invDpr = 1 / dpr;
    const originOffsetX = boxX * invDpr;
    const originOffsetY = boxY * invDpr;

    for (let y = 0; y < dataH; y += step) {
      const row = y * dataW;
      for (let x = 0; x < dataW; x += step) {
        if (data[(row + x) * 4 + 3] < 120) continue;
        const homeX = Math.round(originOffsetX + x * invDpr);
        const homeY = Math.round(originOffsetY + y * invDpr);
        particles.push({
          homeX,
          homeY,
          originX: homeX,
          originY: homeY,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          seed: 0,
          orbitAngle: 0,
          orbitRadius: 0,
        });
        if (particles.length >= MAX_PARTICLES) break;
      }
      if (particles.length >= MAX_PARTICLES) break;
    }

    const orbitJitter = 1.12;
    const edgePad = safeParticleSize * 2 + 10;
    const maxFitRadius =
      Math.max(8, Math.min(cssW, cssH) / 2 - edgePad) / orbitJitter;
    const ringRadius = Math.min(safeScatter, maxFitRadius);
    const count = Math.max(particles.length, 1);
    const twoPiOverCount = TWO_PI / count;

    const isAlreadyMorphed = !holdOnCircle && prev && prev.introElapsed >= (prev.loadMs + prev.morphMs);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const seed = Math.random();
      p.orbitAngle = i * twoPiOverCount + seed * 0.08;
      p.orbitRadius = ringRadius * (0.88 + seed * 0.24);
      p.seed = seed * 1000;

      if (isAlreadyMorphed) {
        p.x = p.homeX;
        p.y = p.homeY;
        p.originX = p.homeX;
        p.originY = p.homeY;
      } else {
        p.x = cx + Math.cos(p.orbitAngle) * p.orbitRadius;
        p.y = cy + Math.sin(p.orbitAngle) * p.orbitRadius;
        p.originX = p.x;
        p.originY = p.y;
      }
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x = p.homeX;
        p.y = p.homeY;
        p.originX = p.homeX;
        p.originY = p.homeY;
      }
    }

    const prevPointer = prev?.pointer ?? {
      x: cx,
      y: cy,
      active: false,
    };

    const live = liveRef.current;
    const now = performance.now();
    engineRef.current = {
      particles,
      width: cssW,
      height: cssH,
      cx,
      cy,
      dpr,
      paintedDpr: -1,
      color: resolvedColor,
      particleSize: live.particleSize,
      drift: live.drift,
      magnetic: live.magnetic,
      magneticRadius: live.magneticRadius,
      holdOnCircle: live.holdOnCircle,
      introElapsed: isAlreadyMorphed ? (safeLoadDuration + safeMorphDuration) * 1000 : 0,
      lastFrameTime: now,
      loadMs: safeLoadDuration * 1000,
      morphMs: safeMorphDuration * 1000,
      morphOriginsReady: isAlreadyMorphed,
      morphDoneFired: isAlreadyMorphed,
      pointer: prevPointer,
      reducedMotion,
      idleLocked: reducedMotion,
      ctx,
      textBounds,
      targetText,
      safeFontSize,
      fontFamily,
      fontWeight,
      subtext,
    };

    wrapRectRef.current = wrap.getBoundingClientRect();
    paintFrame(engineRef.current);
    kickLoopRef.current?.(true);
  }, [
    text,
    fontSize,
    fontWeight,
    fontFamily,
    subtext,
    safeDensity,
    safeScatter,
    safeLoadDuration,
    safeMorphDuration,
    replayKey,
  ]);

  const syncFillColor = React.useCallback(() => {
    const wrap = wrapRef.current;
    const engine = engineRef.current;
    if (!wrap || !engine) return;
    const next = resolveFillColor(wrap, colorPropRef.current);
    if (next === engine.color) return;
    engine.color = next;
    paintFrame(engine);
  }, []);

  // Update dynamic properties
  React.useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.particleSize = safeParticleSize;
    engine.drift = safeDrift;
    engine.magnetic = safeMagnetic;
    if (engine.holdOnCircle && !holdOnCircle) {
      engine.introElapsed = engine.loadMs;
      engine.morphOriginsReady = false;
      engine.lastFrameTime = performance.now();
    }
    engine.holdOnCircle = holdOnCircle;

    if (safeMagnetic <= 0) {
      engine.pointer.active = false;
    }
    // If holdOnCircle changes from true to false, wake up loop to begin morph
    kickLoopRef.current?.(true);
    paintFrame(engine);
  }, [safeParticleSize, safeDrift, safeMagnetic, safeMagneticRadius, holdOnCircle]);

  React.useEffect(() => {
    rebuild();

    const wrap = wrapRef.current;
    if (!wrap) return;

    const scheduleRebuild = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        resizeTimerRef.current = null;
        wrapRectRef.current = wrap.getBoundingClientRect();
        rebuild();
      }, RESIZE_DEBOUNCE_MS);
    };

    const ro = new ResizeObserver(scheduleRebuild);
    ro.observe(wrap);

    const mo = new MutationObserver(() => syncFillColor());
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      ro.disconnect();
      mo.disconnect();
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, [rebuild, syncFillColor]);

  React.useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        rebuild();
      });
    }
  }, [rebuild]);

  React.useEffect(() => {
    syncFillColor();
  }, [color, syncFillColor]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let running = false;

    const shouldRun = () => {
      const engine = engineRef.current;
      if (!engine || engine.reducedMotion) return false;
      if (pausedPropRef.current === true) return false;
      if (engine.idleLocked) return false;
      if (pausedPropRef.current === false) return true;
      return inViewRef.current && pageVisibleRef.current;
    };

    const tick = (now) => {
      const engine = engineRef.current;
      if (!engine || !shouldRun()) {
        running = false;
        if (engine) paintFrame(engine);
        return;
      }

      const stillAnimating = stepParticles(engine, now);
      paintFrame(engine);

      // Check if morph just completed
      if (!stillAnimating && !engine.morphDoneFired && engine.introElapsed >= engine.loadMs + engine.morphMs) {
        engine.morphDoneFired = true;
        onMorphCompleteRef.current?.();
      }

      if (!stillAnimating && engine.drift <= 0 && !engine.pointer.active) {
        engine.idleLocked = true;
        running = false;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const ensureLoop = (force = false) => {
      const engine = engineRef.current;
      if (!engine || engine.reducedMotion) return;
      if (pausedPropRef.current === true) return;

      if (force) engine.idleLocked = false;

      if (engine.idleLocked && engine.drift <= 0 && !engine.pointer.active) {
        return;
      }

      if (
        pausedPropRef.current !== false &&
        !(inViewRef.current && pageVisibleRef.current)
      ) {
        return;
      }

      if (running) return;
      engine.idleLocked = false;
      engine.lastFrameTime = performance.now();
      running = true;
      rafRef.current = requestAnimationFrame(tick);
    };
    kickLoopRef.current = ensureLoop;

    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries.some((e) => e.isIntersecting);
        if (inViewRef.current) ensureLoop();
      },
      { threshold: 0.01 },
    );
    io.observe(wrap);

    const onVisibility = () => {
      pageVisibleRef.current = document.visibilityState !== "hidden";
      if (pageVisibleRef.current) ensureLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    pageVisibleRef.current = document.visibilityState !== "hidden";

    ensureLoop();

    return () => {
      running = false;
      kickLoopRef.current = null;
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused]);

  // Pointer magnetism
  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || safeMagnetic <= 0) return;

    const onMove = (event) => {
      const engine = engineRef.current;
      if (!engine || engine.magnetic <= 0) return;
      const rect = wrap.getBoundingClientRect();
      wrapRectRef.current = rect;
      engine.pointer.x = event.clientX - rect.left;
      engine.pointer.y = event.clientY - rect.top;
      engine.pointer.active = true;
      if (engine.idleLocked) {
        kickLoopRef.current?.(true);
      }
    };

    const onLeave = () => {
      const engine = engineRef.current;
      if (!engine) return;
      engine.pointer.active = false;
      if (engine.drift <= 0) {
        const ps = engine.particles;
        for (let i = 0; i < ps.length; i++) {
          const p = ps[i];
          p.x = p.homeX;
          p.y = p.homeY;
          p.vx = 0;
          p.vy = 0;
        }
        engine.idleLocked = true;
        paintFrame(engine);
      }
    };

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointercancel", onLeave);

    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointercancel", onLeave);
    };
  }, [safeMagnetic]);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative w-full max-w-4xl mx-auto flex items-center justify-center select-none",
        "[--wensity-canvas-text:#ffffff] dark:[--wensity-canvas-text:#ffffff]",
        "text-[color:var(--wensity-canvas-text)]",
        className,
      )}
      style={{ minHeight: hostMinHeight }}
      aria-label={text}
      role="img"
    >
      <span className="sr-only">{text}</span>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full [transform:translateZ(0)] filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] drop-shadow-[0_0_25px_rgba(230,25,55,0.65)] drop-shadow-[0_0_55px_rgba(180,0,25,0.4)]"
        aria-hidden
      />
    </div>
  );
}

function resolveFillColor(wrap, color) {
  if (color && color.trim()) return color.trim();

  const token = getComputedStyle(wrap)
    .getPropertyValue("--wensity-canvas-text")
    .trim();
  if (token) return token;

  const inherited = getComputedStyle(wrap).color;
  if (inherited && inherited !== "rgba(0, 0, 0, 0)") return inherited;

  return "#ffffff";
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/**
 * Advance particle simulation.
 */
function stepParticles(engine, now) {
  const {
    particles,
    drift,
    magnetic,
    magneticRadius,
    pointer,
    loadMs,
    morphMs,
    cx,
    cy,
    holdOnCircle,
  } = engine;

  const elapsed = Math.max(
    0,
    engine.introElapsed + Math.max(0, now - engine.lastFrameTime),
  );
  engine.lastFrameTime = now;
  const pointerLive = pointer.active && magnetic > 0;
  const len = particles.length;

  // Phase 1 — Loading portal circle
  // When holdOnCircle is true, spin indefinitely until pressed
  if (holdOnCircle || elapsed < loadMs) {
    // If holding on circle, spin smoothly and keep introElapsed locked at 0
    if (holdOnCircle) {
      engine.introElapsed = 0;
      engine.morphOriginsReady = false;
    } else {
      engine.introElapsed = elapsed;
    }

    const spin = (now * SPIN_RATE) % TWO_PI;
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      const angle = p.orbitAngle + spin;
      p.x = cx + Math.cos(angle) * p.orbitRadius;
      p.y = cy + Math.sin(angle) * p.orbitRadius;
      p.vx = 0;
      p.vy = 0;
    }
    return true;
  }

  engine.introElapsed = elapsed;

  // Phase 2 — Morph ring → text (starts immediately when load ends / hold is released)
  const morphElapsed = elapsed - loadMs;
  if (morphElapsed < morphMs) {
    if (!engine.morphOriginsReady) {
      // Freeze live ring positions once — no per-frame trig during morph.
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        p.originX = p.x;
        p.originY = p.y;
      }
      engine.morphOriginsReady = true;
    }

    const raw = Math.min(1, morphElapsed / Math.max(1, morphMs));

    for (let i = 0; i < len; i++) {
      const p = particles[i];
      const stagger = (p.seed % 180) / 1000;
      const delayed = Math.min(
        1,
        Math.max(0, (raw - stagger * 0.12) / (1 - stagger * 0.12)),
      );
      const u = easeOutCubic(delayed);

      if (u >= 0.995) {
        p.x = p.homeX;
        p.y = p.homeY;
        p.vx = 0;
        p.vy = 0;
        continue;
      }

      p.x = p.originX + (p.homeX - p.originX) * u;
      p.y = p.originY + (p.homeY - p.originY) * u;
      p.vx = 0;
      p.vy = 0;
    }
    return true;
  }

  // Phase 3 — Settled lattice with drift and magnetic pointer interaction
  if (!pointerLive && drift <= 0) {
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      p.x = p.homeX;
      p.y = p.homeY;
      p.vx = 0;
      p.vy = 0;
    }
    return false;
  }

  const radiusSq = magneticRadius * magneticRadius;

  for (let i = 0; i < len; i++) {
    const p = particles[i];
    let targetX = p.homeX;
    let targetY = p.homeY;

    if (drift > 0) {
      targetX += Math.sin(now * 0.0012 + p.seed) * drift;
      targetY += Math.cos(now * 0.0015 + p.seed * 1.3) * drift;
    }

    if (pointerLive) {
      const dx = p.homeX - pointer.x;
      const dy = p.homeY - pointer.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < radiusSq && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const falloff = 1 - dist / magneticRadius;
        const push = magnetic * falloff * falloff * 28;
        targetX += (dx / dist) * push;
        targetY += (dy / dist) * push;
      }
    }

    p.vx = (p.vx + (targetX - p.x) * 0.22) * 0.76;
    p.vy = (p.vy + (targetY - p.y) * 0.22) * 0.76;
    p.x += p.vx;
    p.y += p.vy;
  }

  return true;
}

/** Paint particles as halftone screenprint dots with authentic Stranger Things poster gradient & rim highlight */
function paintFrame(engine) {
  const { 
    ctx, 
    dpr, 
    particles, 
    particleSize, 
    width, 
    height, 
    holdOnCircle, 
    introElapsed, 
    loadMs, 
    morphMs,
    textBounds,
    targetText,
    safeFontSize,
    fontFamily,
    fontWeight,
    cx,
    cy,
    subtext,
  } = engine;

  if (engine.paintedDpr !== dpr) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    engine.paintedDpr = dpr;
  }
  ctx.clearRect(0, 0, width, height);

  const len = particles.length;
  if (len === 0) return;

  // Determine vertical gradient bounds matching the uploaded reference poster:
  // Top: pure white (#ffffff) -> coral pink (#ffb5bf) -> crimson (#e61937) -> dark blood red (#6e000d)
  const topY = textBounds ? textBounds.topY - 2 : cy - 50;
  const bottomY = textBounds ? textBounds.bottomY + 2 : cy + 50;

  const grad = ctx.createLinearGradient(0, topY, 0, bottomY);
  grad.addColorStop(0.0, "#ffffff");
  grad.addColorStop(0.24, "#ffffff");
  grad.addColorStop(0.48, "#ffb5bf");
  grad.addColorStop(0.74, "#e61937");
  grad.addColorStop(1.0, "#6e000d");

  ctx.fillStyle = grad;

  // Render particles as crisp circular halftone dots
  const r = particleSize * 0.5;
  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const p = particles[i];
    ctx.moveTo(p.x + r, p.y);
    ctx.arc(p.x, p.y, r, 0, TWO_PI);
  }
  ctx.fill();

  // Morph progress: 0 when holding on circle, 0->1 during morph
  const morphProgress = holdOnCircle || introElapsed < loadMs 
    ? 0 
    : Math.min(1, Math.max(0, (introElapsed - loadMs) / morphMs));

  // Crisp razor-sharp white rim / stroke around the letterforms (from uploaded poster)
  // Fades in smoothly as particles assemble (from 35% morph onwards)
  if (morphProgress > 0.35 && targetText && safeFontSize) {
    const strokeAlpha = Math.min(0.95, ((morphProgress - 0.35) / 0.65) * 0.95);
    ctx.save();
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = "0.03em";
    }
    ctx.font = `${fontWeight} ${safeFontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = `rgba(255, 255, 255, ${strokeAlpha})`;
    ctx.lineWidth = Math.max(1.2, safeFontSize * 0.015);
    ctx.lineJoin = "round";
    ctx.strokeText(targetText, cx, cy);

    // ISE department badge in the bottom-left corner directly under the letters 'T' and 'E'
    if (subtext && textBounds) {
      const iseSize = Math.max(14, Math.round(safeFontSize * 0.22));
      const iseX = cx - (textBounds.textW / 2) + Math.round(safeFontSize * 0.04);
      const iseY = textBounds.bottomY + Math.round(iseSize * 0.45);

      ctx.font = `800 ${iseSize}px 'Cinzel', 'ITC Benguiat', serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      // Halftone-matching gradient fill for ISE
      const iseGrad = ctx.createLinearGradient(0, iseY - iseSize / 2, 0, iseY + iseSize / 2);
      iseGrad.addColorStop(0.0, "#ffffff");
      iseGrad.addColorStop(0.4, "#ffcbd5");
      iseGrad.addColorStop(1.0, "#d91b35");

      ctx.globalAlpha = strokeAlpha;
      ctx.fillStyle = iseGrad;
      ctx.fillText(subtext, iseX, iseY);

      // Fine white stroke on ISE
      ctx.strokeStyle = `rgba(255, 255, 255, ${strokeAlpha * 0.85})`;
      ctx.lineWidth = 0.8;
      ctx.strokeText(subtext, iseX, iseY);
    }
    ctx.restore();
  }
}

export default CanvasText;
