import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SporeField() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect mobile for particle density optimization
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 350 : 850;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1200
    );
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Performance boost
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create soft glowing circle texture procedurally
    const createSporeTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 60, 70, 0.9)');
      gradient.addColorStop(0.5, 'rgba(200, 10, 20, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      return new THREE.CanvasTexture(canvas);
    };

    const sporeTexture = createSporeTexture();

    // BufferGeometry for GPU instanced performance
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xff2a35); // Crimson
    const color2 = new THREE.Color(0x990011); // Blood red
    const color3 = new THREE.Color(0xff7744); // Ember orange

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 900;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

      // Varied spore sizes
      scales[i] = Math.random() * 8 + 3;

      // Organic drift velocity
      speeds[i * 3] = (Math.random() - 0.5) * 0.25;      // X drift
      speeds[i * 3 + 1] = Math.random() * 0.45 + 0.15;   // Y upward drift
      speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.2;  // Z drift

      // Color variation
      const mix = Math.random();
      const c = mix < 0.6 ? color1 : (mix < 0.85 ? color2 : color3);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 14,
      map: sporeTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse / Touch Interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

      mouse.targetX = (clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Parallax scene tilt
      particles.rotation.y = mouse.x * 0.15;
      particles.rotation.x = -mouse.y * 0.12;

      const posArr = geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        // Upward floating motion with subtle sine turbulence
        posArr[i * 3 + 1] += speeds[i * 3 + 1];
        posArr[i * 3] += speeds[i * 3] + Math.sin(elapsedTime * 0.5 + i) * 0.18;
        posArr[i * 3 + 2] += speeds[i * 3 + 2] + Math.cos(elapsedTime * 0.4 + i) * 0.15;

        // Wrap around boundaries
        if (posArr[i * 3 + 1] > 400) {
          posArr[i * 3 + 1] = -400;
          posArr[i * 3] = (Math.random() - 0.5) * 900;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      sporeTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-15 pointer-events-none overflow-hidden"
    />
  );
}
