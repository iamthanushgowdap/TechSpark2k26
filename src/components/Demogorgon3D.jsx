import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { soundEngine } from '../utils/soundEngine';
import { Flame, RotateCcw, Skull, Swords, Zap, Activity } from 'lucide-react';

export default function Demogorgon3D() {
  const mountRef = useRef(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentAnimName, setCurrentAnimName] = useState('Idle');
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const activeActionRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 3.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. OrbitControls (Smooth mouse/touch rotation)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 6.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go below ground
    controls.target.set(0, 1.0, 0);
    controlsRef.current = controls;

    // 3. Cinematic Red Lightning & Rim Lights
    const ambientLight = new THREE.AmbientLight(0x1a0508, 1.5);
    scene.add(ambientLight);

    // Front soft light to see textures
    const frontLight = new THREE.DirectionalLight(0xfff0f0, 2.0);
    frontLight.position.set(0, 3, 4);
    scene.add(frontLight);

    // Dramatic Crimson Rim Light 1 (Left Behind)
    const rimLightLeft = new THREE.SpotLight(0xff0515, 12, 15, Math.PI / 3, 0.4);
    rimLightLeft.position.set(-3, 2.5, -2);
    scene.add(rimLightLeft);

    // Dramatic Crimson Rim Light 2 (Right Behind)
    const rimLightRight = new THREE.SpotLight(0xff2030, 10, 15, Math.PI / 3, 0.4);
    rimLightRight.position.set(3, 2.0, -2);
    scene.add(rimLightRight);

    // Ground spotlight for eerie upward shadow
    const underGlow = new THREE.PointLight(0xff0011, 3, 5);
    underGlow.position.set(0, 0.1, 0.5);
    scene.add(underGlow);

    // 4. Load Demogorgon Rig GLB
    const loader = new GLTFLoader();
    let model = null;

    loader.load(
      '/assets/demogorgon_rig.glb',
      (gltf) => {
        model = gltf.scene;

        // Auto-scale and center the creature
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Normalize height to ~2.0 units
        const scale = 2.0 / size.y;
        model.scale.set(scale, scale, scale);
        model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

        // Enhance material shadows and roughness
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.6;
              child.material.metalness = 0.1;
            }
          }
        });

        scene.add(model);

        // 5. Setup Animation Mixer
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          const actionMap = {};

          // Helper to register animations by friendly names
          gltf.animations.forEach((clip) => {
            const clipName = clip.name.toLowerCase();
            const action = mixer.clipAction(clip);

            if (clipName.includes('idle') && !actionMap['Idle']) {
              actionMap['Idle'] = action;
            } else if (clipName.includes('mori') || clipName.includes('roar')) {
              actionMap['Roar'] = action;
            } else if (clipName.includes('swing') || clipName.includes('hit')) {
              actionMap['Swing'] = action;
            } else if (clipName.includes('pounce')) {
              actionMap['Pounce'] = action;
            } else if (clipName.includes('run')) {
              actionMap['Run'] = action;
            }
          });

          // Fallbacks if specific name not found
          if (!actionMap['Idle']) actionMap['Idle'] = mixer.clipAction(gltf.animations[6] || gltf.animations[0]);
          if (!actionMap['Roar']) actionMap['Roar'] = mixer.clipAction(gltf.animations[15] || gltf.animations[0]);
          if (!actionMap['Swing']) actionMap['Swing'] = mixer.clipAction(gltf.animations[46] || gltf.animations[0]);
          if (!actionMap['Pounce']) actionMap['Pounce'] = mixer.clipAction(gltf.animations[19] || gltf.animations[0]);
          if (!actionMap['Run']) actionMap['Run'] = mixer.clipAction(gltf.animations[25] || gltf.animations[0]);

          actionsRef.current = actionMap;

          // Start with Idle
          if (actionMap['Idle']) {
            actionMap['Idle'].play();
            activeActionRef.current = actionMap['Idle'];
            setCurrentAnimName('Idle');
          }
        }

        setIsLoaded(true);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(pct);
        }
      },
      (error) => {
        console.error('Error loading Demogorgon model:', error);
      }
    );

    // 6. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 7. Render Loop
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Smooth Crossfade Between Animations
  const playAnimation = (animKey) => {
    const targetAction = actionsRef.current[animKey];
    if (!targetAction || targetAction === activeActionRef.current) return;

    soundEngine.playPortalGlitch();
    if (animKey === 'Roar') {
      soundEngine.playLightningCrack(0.3);
    }

    const prevAction = activeActionRef.current;
    if (prevAction) {
      prevAction.fadeOut(0.4);
    }

    targetAction.reset().fadeIn(0.4).play();
    activeActionRef.current = targetAction;
    setCurrentAnimName(animKey);
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#120205] via-[#080104] to-[#040003] border border-red-900/50 shadow-[0_0_50px_rgba(255,20,30,0.25)] flex flex-col justify-between">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />

      {/* Top HUD Overlay */}
      <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between pointer-events-none select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-700/60 flex items-center justify-center">
            <Skull className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <div className="font-mono-tech text-xs sm:text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
              SPECIMEN // DEMOGORGON
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
            <div className="font-mono-tech text-[10px] text-red-400 tracking-wider">
              HAWKINS LAB • 3D INTERACTIVE BIO-SCAN
            </div>
          </div>
        </div>

        <button
          onClick={handleResetCamera}
          className="pointer-events-auto px-3 py-1.5 rounded-lg bg-black/60 hover:bg-red-950/40 border border-zinc-800 hover:border-red-600 font-mono-tech text-xs text-zinc-300 flex items-center gap-1.5 backdrop-blur-md transition-all"
          title="Reset Camera View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">RESET VIEW</span>
        </button>
      </div>

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6">
          <Activity className="w-8 h-8 text-red-500 animate-pulse mb-3" />
          <div className="font-mono-tech text-xs sm:text-sm text-red-300 tracking-[0.25em] uppercase mb-2">
            INITIALIZING 3D SPECIMEN SCAN...
          </div>
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-zinc-900 rounded-full overflow-hidden border border-red-900/40">
            <div 
              className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-300 shadow-[0_0_10px_#ff0000]"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <span className="font-mono-tech text-xs text-zinc-500 mt-2">
            {loadProgress}% LOADED
          </span>
        </div>
      )}

      {/* Interactive Controls Bar (Bottom) */}
      <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Touch / Mouse Hint */}
          <div className="font-mono-tech text-[11px] text-zinc-400 tracking-wider flex items-center gap-2">
            <span className="text-red-500">◈</span>
            <span>DRAG TO ROTATE 360° • PINCH TO ZOOM</span>
          </div>

          {/* Animation Action Triggers */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {[
              { key: 'Idle', label: 'STALK', icon: Flame },
              { key: 'Roar', label: 'ROAR', icon: Skull },
              { key: 'Swing', label: 'SLASH', icon: Swords },
              { key: 'Pounce', label: 'POUNCE', icon: Zap },
              { key: 'Run', label: 'RUN', icon: Activity },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => playAnimation(key)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg font-mono-tech text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 border ${
                  currentAnimName === key
                    ? 'bg-red-700 border-red-400 text-white shadow-[0_0_15px_rgba(255,30,40,0.8)] scale-105'
                    : 'bg-black/70 border-zinc-800 text-zinc-400 hover:border-red-700 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
