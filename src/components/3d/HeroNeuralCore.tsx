'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFx } from '@/lib/soundFx';

interface NodeConcept {
  name: string;
  domain: string;
  tag: string;
  position: [number, number, number];
}

const HERO_CONCEPTS: NodeConcept[] = [
  { name: 'Computer Vision', domain: 'Spatial perception & YOLOv10', tag: 'Perception', position: [2.2, 1.2, 0.5] },
  { name: 'Generative AI', domain: 'Diffusion & Transformers', tag: 'Synthesis', position: [-2.0, 1.5, 0.8] },
  { name: 'Autonomous Robotics', domain: '6-DoF Kinematics & ROS2', tag: 'Embodiment', position: [1.8, -1.6, 1.0] },
  { name: 'Neural Networks', domain: 'Deep Tensor Backpropagation', tag: 'Foundational', position: [-1.9, -1.3, -0.6] },
  { name: 'AI Agents', domain: 'Multi-Agent Consensus Graphs', tag: 'Orchestration', position: [0.2, 2.3, -1.0] },
  { name: 'Reinforcement Learning', domain: 'Policy Gradients & MuJoCo', tag: 'Decision', position: [-0.4, -2.2, 1.2] },
];

export default function HeroNeuralCore() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeConcept, setActiveConcept] = useState<NodeConcept | null>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for mouse rotation
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Create Neural Nodes
    const nodeCount = 90;
    const radius = 2.6;
    const nodes: THREE.Vector3[] = [];
    const nodeColors: THREE.Color[] = [];
    const colorsList = [
      new THREE.Color('#FFFFFF'), // Cyan
      new THREE.Color('#8A8A8A'), // Indigo
      new THREE.Color('#8A8A8A'), // Violet
      new THREE.Color('#D4D4D4'), // Mint
      new THREE.Color('#38BDF8')  // Sky
    ];

    // Fibonacci sphere distribution for harmonious node layout
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const jitter = 0.85 + Math.random() * 0.3;
      const x = radius * Math.sin(phi) * Math.cos(theta) * jitter;
      const y = radius * Math.sin(phi) * Math.sin(theta) * jitter;
      const z = radius * Math.cos(phi) * jitter;
      nodes.push(new THREE.Vector3(x, y, z));
      nodeColors.push(colorsList[i % colorsList.length]);
    }

    // Nodes Mesh Points
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodes);
    const colorFloatArray = new Float32Array(nodeCount * 3);
    nodeColors.forEach((col, i) => {
      colorFloatArray[i * 3] = col.r;
      colorFloatArray[i * 3 + 1] = col.g;
      colorFloatArray[i * 3 + 2] = col.b;
    });
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(colorFloatArray, 3));

    // Particle sprite material
    const nodeMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    coreGroup.add(nodePoints);

    // Synaptic Connection Lines
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxDist = 1.4;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < maxDist) {
          linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);

          const c = nodeColors[i % nodeColors.length];
          lineColors.push(c.r, c.g, c.b, 0.4);
          lineColors.push(c.r, c.g, c.b, 0.4);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    coreGroup.add(lines);

    // ──────────────────────────────────────────────────────────
    // VIBRANT NEON MULTI-LAYER CORE SPHERE
    // ──────────────────────────────────────────────────────────
    // 1. Primary Neon Cyan Wireframe Sphere
    const innerCoreGeo = new THREE.IcosahedronGeometry(1.25, 2);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff, // Bright Neon Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCore);

    // 2. Outer Neon Aqua/Mint Geodesic Cage
    const outerLatticeGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const outerLatticeMat = new THREE.MeshBasicMaterial({
      color: 0xd4d4d4, // Neon Mint / Electric Aqua
      wireframe: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const outerLattice = new THREE.Mesh(outerLatticeGeo, outerLatticeMat);
    coreGroup.add(outerLattice);

    // 3. Inner Radiant Holographic Glow Sphere
    const innerGlowGeo = new THREE.SphereGeometry(0.88, 32, 32);
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, // Glowing Electric Blue/Cyan Core
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
    coreGroup.add(innerGlow);

    // 4. Glowing Neon Vertex Junctions on the Sphere
    const sphereNodesMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const sphereNodes = new THREE.Points(innerCoreGeo, sphereNodesMat);
    coreGroup.add(sphereNodes);

    // Floating Stardust Particles
    const dustCount = 200;
    const dustCoords: number[] = [];
    for (let i = 0; i < dustCount; i++) {
      dustCoords.push(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustCoords, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xd4d4d4,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Mouse Parallax Interaction
    let targetRotX = 0;
    let targetRotY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetRotY = mouseX * 0.6;
      targetRotX = -mouseY * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth core rotation + mouse lag
      coreGroup.rotation.y += 0.003;
      coreGroup.rotation.x += 0.001;
      coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.04;
      coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.04;

      // Dynamic Neon Core Pulse & Gyroscope Rotations
      const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.07;
      innerCore.scale.set(pulse, pulse, pulse);
      innerCore.rotation.y -= 0.007;
      innerCore.rotation.x += 0.003;

      sphereNodes.scale.set(pulse, pulse, pulse);
      sphereNodes.rotation.y -= 0.007;
      sphereNodes.rotation.x += 0.003;

      innerGlow.scale.set(pulse * 0.95, pulse * 0.95, pulse * 0.95);

      const outerPulse = 1 + Math.cos(elapsedTime * 2) * 0.05;
      outerLattice.scale.set(outerPulse, outerPulse, outerPulse);
      outerLattice.rotation.y += 0.008;
      outerLattice.rotation.z -= 0.004;

      // Slow drift of dust
      dust.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      nodeGeo.dispose();
      lineGeo.dispose();
      innerCoreGeo.dispose();
      outerLatticeGeo.dispose();
      innerGlowGeo.dispose();
      dustGeo.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[480px] sm:min-h-[580px] flex items-center justify-center">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        data-cursor="interact"
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {/* Floating Holographic Concept Nodes (HTML Overlay around the 3D Sphere) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {HERO_CONCEPTS.map((concept, idx) => {
          const positions = [
            'top-[18%] left-[8%] sm:left-[12%]',
            'top-[16%] right-[8%] sm:right-[12%]',
            'bottom-[24%] left-[6%] sm:left-[10%]',
            'bottom-[20%] right-[6%] sm:right-[10%]',
            'top-[8%] left-[45%]',
            'bottom-[10%] left-[45%]'
          ];

          return (
            <motion.div
              key={concept.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + idx * 0.15 }}
              className={`absolute pointer-events-auto ${positions[idx]}`}
            >
              <button
                onClick={() => {
                  soundFx.playNeuralChime();
                  setActiveConcept(activeConcept?.name === concept.name ? null : concept);
                }}
                onMouseEnter={() => soundFx.playHover()}
                className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0a0a]/80 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400 shadow-none hover:shadow-none transition-all transform hover:scale-105 active:scale-95"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-200 group-hover:text-cyan-300">
                  {concept.name}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  {concept.tag}
                </span>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Holographic Concept Detail Modal HUD */}
      <AnimatePresence>
        {activeConcept && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md p-4 rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-cyan-400/50 shadow-none font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
              <span className="text-cyan-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                NEURAL CORE TELEMETRY
              </span>
              <button
                onClick={() => setActiveConcept(null)}
                className="text-slate-400 hover:text-white px-1 font-bold"
              >
                ✕
              </button>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mb-1">{activeConcept.name}</h4>
            <p className="text-slate-300 text-xs mb-3">{activeConcept.domain}</p>
            <div className="flex items-center justify-between text-[10px] text-cyan-400 bg-cyan-950/40 p-2 rounded-lg border border-cyan-800/40">
              <span>STATUS: ACTIVATED</span>
              <span>SYNAPSE LATENCY: 2.1ms</span>
              <span>NODES: 80+</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WebGL Fallback if canvas failed */}
      {!webGlSupported && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center font-mono text-xs text-cyan-300">
          [ 2D Optimized Neural Canvas Rendering Mode ]
        </div>
      )}
    </div>
  );
}
