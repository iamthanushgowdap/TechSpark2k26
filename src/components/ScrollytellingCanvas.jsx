import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { soundEngine } from '../utils/soundEngine';

export default function ScrollytellingCanvas({ 
  scrollProgress, 
  onLoadProgress, 
  onLoadComplete,
  isEntered = false 
}) {
  const mountRef = useRef(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // References for render loop
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const activeActionRef = useRef(null);
  const scrollRef = useRef(0);
  const isEnteredRef = useRef(isEntered);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const hasRoaredRef = useRef(false);

  // Keep isEnteredRef and model visibility synced & reset orientation to forward on enter
  useEffect(() => {
    isEnteredRef.current = isEntered;
    if (modelRef.current) {
      modelRef.current.visible = isEntered;
    }
    if (isEntered) {
      // Force reset to Chapter 1 Idle forward pose upon entering
      scrollRef.current = 0;
      hasRoaredRef.current = false;
      mouseRef.current.x = 0;
      mouseRef.current.y = 0;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      if (actionsRef.current && actionsRef.current['idle']) {
        if (activeActionRef.current && activeActionRef.current !== 'idle' && actionsRef.current[activeActionRef.current]) {
          actionsRef.current[activeActionRef.current].fadeOut(0.2);
        }
        actionsRef.current['idle'].reset().fadeIn(0.2).play();
        activeActionRef.current = 'idle';
      }
    }
  }, [isEntered]);

  // Keep scrollRef updated with latest scrollProgress without re-running effects
  useEffect(() => {
    if (isEntered) {
      scrollRef.current = scrollProgress;
    } else {
      scrollRef.current = 0;
    }
  }, [scrollProgress, isEntered]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.4, 4.2);
    cameraRef.current = camera;

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 3. Cinematic Red Lightning & Rim Lighting System
    const ambientLight = new THREE.AmbientLight(0x220508, 1.8);
    scene.add(ambientLight);

    // Front key light
    const frontLight = new THREE.DirectionalLight(0xfff5f5, 2.5);
    frontLight.position.set(0, 4, 5);
    scene.add(frontLight);

    // Left Crimson Rim Spotlight (Volumetric silhouette edge)
    const rimLeft = new THREE.SpotLight(0xff0a18, 14, 20, Math.PI / 3, 0.4);
    rimLeft.position.set(-4, 3, -2);
    scene.add(rimLeft);

    // Right Crimson Rim Spotlight
    const rimRight = new THREE.SpotLight(0xff1828, 12, 20, Math.PI / 3, 0.4);
    rimRight.position.set(4, 2.5, -2);
    scene.add(rimRight);

    // Deep Blood-Red Ground Fill
    const underGlow = new THREE.PointLight(0xff0015, 4, 8);
    underGlow.position.set(0, -1, 1);
    scene.add(underGlow);

    // 4. Load the 3D Demogorgon Rig Model
    const loader = new GLTFLoader();
    loader.load(
      '/assets/demogorgon_rig.glb',
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        // Auto-scale to standard height (~2.2 units)
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = 2.3 / size.y;

        model.scale.set(scale, scale, scale);
        model.position.set(0, -1.2, 0);

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.55;
              child.material.metalness = 0.15;
            }
          }
        });

        model.visible = isEnteredRef.current;
        scene.add(model);

        // 5. Setup Animation Mixer with Key Actions
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          const actionMap = {};

          // Specific clip mapping based on inspection:
          // 6: Idle
          // 19: Pounce (The leaping jump)
          // 20: PounceHit (Landed down, wake up and roar - explicitly requested)
          // 15: Mori (Roar)
          if (gltf.animations[6]) actionMap['idle'] = mixer.clipAction(gltf.animations[6]);
          if (gltf.animations[19]) actionMap['pounce'] = mixer.clipAction(gltf.animations[19]);
          if (gltf.animations[20]) actionMap['pounceHit'] = mixer.clipAction(gltf.animations[20]);
          if (gltf.animations[15]) actionMap['roar'] = mixer.clipAction(gltf.animations[15]);

          // Fallbacks by search
          gltf.animations.forEach((clip) => {
            const clipName = clip.name.toLowerCase();
            const action = mixer.clipAction(clip);

            if (clipName.includes('pouncehit') && !actionMap['pounceHit']) actionMap['pounceHit'] = action;
            if (clipName.includes('idle') && !actionMap['idle']) actionMap['idle'] = action;
            if (clipName.includes('pounce') && !clipName.includes('hit') && !actionMap['pounce']) actionMap['pounce'] = action;
            if ((clipName.includes('mori') || clipName.includes('roar')) && !actionMap['roar']) actionMap['roar'] = action;
          });

          // Secondary fallbacks
          if (!actionMap['idle']) actionMap['idle'] = mixer.clipAction(gltf.animations[0]);
          if (!actionMap['pounce']) actionMap['pounce'] = mixer.clipAction(gltf.animations[19] || gltf.animations[0]);
          if (!actionMap['pounceHit']) actionMap['pounceHit'] = mixer.clipAction(gltf.animations[20] || gltf.animations[15] || gltf.animations[0]);
          if (!actionMap['roar']) actionMap['roar'] = mixer.clipAction(gltf.animations[15] || gltf.animations[0]);

          actionsRef.current = actionMap;

          // Start in idle stalk
          if (actionMap['idle']) {
            actionMap['idle'].play();
            activeActionRef.current = 'idle';
          }
        }

        setIsLoaded(true);
        if (onLoadComplete) onLoadComplete();
      },
      (xhr) => {
        if (xhr.total > 0) {
          const p = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(p);
          if (onLoadProgress) onLoadProgress(p);
        }
      },
      (err) => {
        console.error('Failed to load Demogorgon model:', err);
        if (onLoadComplete) onLoadComplete();
      }
    );

    // 6. Pointer Movement for Micro-Parallax
    const handlePointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || window.innerWidth / 2;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || window.innerHeight / 2;

      mouseRef.current.targetX = (clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (clientY / window.innerHeight - 0.5) * 2;
    };

    const handlePointerReset = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerReset);
    window.addEventListener('touchcancel', handlePointerReset);
    window.addEventListener('mouseleave', handlePointerReset);

    // 7. Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 8. Main 60FPS Scrollytelling Render Loop
    const clock = new THREE.Clock();
    let animId;

    // Target positions & rotations interpolated across scroll stages
    const currentPos = new THREE.Vector3(0, -0.92, 0);
    const targetPos = new THREE.Vector3(0, -0.92, 0);
    let currentRotY = 0;
    let targetRotY = 0;
    let currentCamZ = 4.0;
    let targetCamZ = 4.0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Update animation mixer
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const p = Math.max(0, Math.min(1, scrollRef.current));
      const isMobile = window.innerWidth < 768;

      // =========================================================================
      // SCROLL TIMELINE: INTERPOLATE 3D MODEL & CAMERA THROUGH CHAPTERS
      // =========================================================================
      if (!isEnteredRef.current) {
        if (modelRef.current) modelRef.current.visible = false;
      } else if (p < 0.16) {
        // CHAPTER 1: THE GATE (Hero Stage)
        // Standing directly behind TECHSPARK text, subtle stalk stance
        if (modelRef.current) modelRef.current.visible = true;
        targetPos.set(0, -0.92, 0);
        targetRotY = 0 + mouseRef.current.x * 0.25;
        targetCamZ = 4.0;

        switchAction('idle', false); // loop in idle
        hasRoaredRef.current = false;
      } else if (p < 0.30) {
        // SCROLL TRANSITION: JUMP & ZOOM UP TO FRONT
        // As you scroll down from hero: zooms up and comes front, jumping past the camera!
        if (modelRef.current) modelRef.current.visible = true;
        const jumpP = (p - 0.16) / 0.14; // 0 to 1

        // Zoom rapidly forward past the camera plane with upward leap
        targetPos.set(0, -0.92 + jumpP * 0.85, jumpP * 5.2);
        targetRotY = 0 + mouseRef.current.x * 0.15;
        targetCamZ = 4.0 - jumpP * 0.5;

        // Leaping jump animation (pounce)
        switchAction('pounce', true); // play jump leap once
        hasRoaredRef.current = false;
      } else if (p < 0.70) {
        // CHAPTER 2: THE FOUR ARENAS
        // "It should not be visible in the second section."
        if (modelRef.current) modelRef.current.visible = false;

        // Stop the jump animation so it never stays stuck in the jumping stage
        if (activeActionRef.current === 'pounce' && actionsRef.current && actionsRef.current['pounce']) {
          actionsRef.current['pounce'].stop();
          activeActionRef.current = null;
        }

        // Already jumped and DOWN in the third section
        currentPos.set(0, -1.0, -0.2);
        targetPos.set(0, -1.0, -0.2);
        targetRotY = 0;
        targetCamZ = 3.6;
        hasRoaredRef.current = false;
      } else {
        // CHAPTER 3: SURVIVAL CLEARANCE (Last Section)
        // "So, what has to be happen means it needs to be already jumped to the third one
        // and it needs to be down. So, when we go to the third chapter,
        // then it will wake up and it will roar. That is the name of the animation:
        // demogorgon_ref_demogorgon_head1_skeleton|PounceHit"
        if (modelRef.current) modelRef.current.visible = true;
        targetPos.set(0, -1.0, -0.2);
        targetRotY = 0 + mouseRef.current.x * 0.25;
        targetCamZ = 3.6;

        // Play the user's uploaded animation: PounceHit (wakes up and roars!) in loop
        switchAction('pounceHit', false);
      }

      // Smooth damped lerp towards target coordinates
      currentPos.lerp(targetPos, 0.08);
      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentCamZ += (targetCamZ - currentCamZ) * 0.08;

      if (modelRef.current) {
        modelRef.current.position.copy(currentPos);
        modelRef.current.rotation.y = currentRotY;
        // Subtle vertical breathing bob
        modelRef.current.position.y += Math.sin(clock.getElapsedTime() * 2) * 0.015;
      }

      camera.position.z = currentCamZ;
      camera.position.x = mouseRef.current.x * 0.15;
      camera.position.y = 0.4 - mouseRef.current.y * 0.1;
      camera.lookAt(currentPos.x * 0.3, 0.3, 0);

      renderer.render(scene, camera);
    };

    // Helper to crossfade animation actions smoothly with LoopOnce option
    function switchAction(name, loopOnce = false) {
      if (!actionsRef.current || !actionsRef.current[name]) return;
      if (activeActionRef.current === name) return;

      const prevName = activeActionRef.current;
      const prevAction = prevName ? actionsRef.current[prevName] : null;
      const nextAction = actionsRef.current[name];

      if (prevAction) {
        prevAction.fadeOut(0.3);
      }

      if (loopOnce) {
        nextAction.setLoop(THREE.LoopOnce, 1);
        nextAction.clampWhenFinished = true;
      } else {
        nextAction.setLoop(THREE.LoopRepeat, Infinity);
        nextAction.clampWhenFinished = false;
      }

      nextAction.reset().fadeIn(0.3).play();
      activeActionRef.current = name;
    }

    animate();

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 z-10 pointer-events-none w-screen h-screen overflow-hidden transition-opacity duration-1000 ${
        isEntered ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
