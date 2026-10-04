'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RobotActionState } from '@/types';

interface Robot3DLabProps {
  actionState: RobotActionState;
  onSelectHologram?: (domainKey: string) => void;
}

export default function Robot3DLab({ actionState, onSelectHologram }: Robot3DLabProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef(actionState);
  actionRef.current = actionState;

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    // ==========================================
    // 1. THREE.JS SCENE SETUP (Ultra-HD & Anti-Aliased)
    // ==========================================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030716, 0.026);

    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
    camera.position.set(0, 1.25, 4.8);
    camera.lookAt(0, 1.05, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'highp',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // ==========================================
    // 2. CINEMATIC STUDIO & PORTRAIT LIGHTING
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x1a264a, 2.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(3.5, 6, 4.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7e94e0, 1.8);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    const cyanRim = new THREE.PointLight(0xffffff, 8.5, 15);
    cyanRim.position.set(3.8, 2.4, 0.8);
    scene.add(cyanRim);

    const purpleBack = new THREE.PointLight(0x8a8a8a, 7.5, 18);
    purpleBack.position.set(-3.8, 3.2, -2.2);
    scene.add(purpleBack);

    const floorGlow = new THREE.PointLight(0xffffff, 4.5, 9);
    floorGlow.position.set(0, 0.05, 0);
    scene.add(floorGlow);

    // Ceiling Halo Ring Light
    const haloLight = new THREE.PointLight(0xffffff, 5, 8);
    haloLight.position.set(0, 3.2, 0);
    scene.add(haloLight);

    // ==========================================
    // 3. MATERIALS (High-End Glossy PBR)
    // ==========================================
    const whiteArmour = new THREE.MeshPhysicalMaterial({
      color: 0xf5f7fb,
      roughness: 0.12,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });

    const whiteArmourAccent = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      roughness: 0.18,
      metalness: 0.15,
      clearcoat: 0.8,
    });

    const darkChassis = new THREE.MeshStandardMaterial({
      color: 0x0a0e1a,
      roughness: 0.32,
      metalness: 0.88,
    });

    const darkJoint = new THREE.MeshStandardMaterial({
      color: 0x141b2d,
      roughness: 0.28,
      metalness: 0.92,
    });

    const darkMetallicPiston = new THREE.MeshStandardMaterial({
      color: 0x222a3d,
      roughness: 0.2,
      metalness: 0.95,
    });

    const cyanNeon = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cyanNeonBright = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const purpleNeon = new THREE.MeshBasicMaterial({ color: 0x8a8a8a });

    const holoGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.52,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.85,
      side: THREE.DoubleSide,
    });

    // High-Resolution Smooth Ring generator (96 segments for silky smooth curves)
    const mkRing = (r: number, t: number, color: number) =>
      new THREE.Mesh(new THREE.TorusGeometry(r, t, 32, 96), new THREE.MeshBasicMaterial({ color }));

    const mkFloorRing = (inner: number, outer: number, color: number, opacity: number) => {
      const m = new THREE.Mesh(
        new THREE.RingGeometry(inner, outer, 96),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity })
      );
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.01;
      return m;
    };

    // ==========================================
    // 4. ENVIRONMENT, CEILING HALO & FLOOR
    // ==========================================
    const ceilingHalo = mkRing(1.6, 0.022, 0xffffff);
    ceilingHalo.rotation.x = Math.PI / 2;
    ceilingHalo.position.set(0, 3.2, 0);
    scene.add(ceilingHalo);

    const ceilingHaloInner = mkRing(1.2, 0.014, 0x8a8a8a);
    ceilingHaloInner.rotation.x = Math.PI / 2;
    ceilingHaloInner.position.set(0, 3.25, 0);
    scene.add(ceilingHaloInner);

    // Floor Grid
    const grid = new THREE.GridHelper(30, 60, 0xffffff, 0x0d152a);
    (grid.material as THREE.Material).opacity = 0.35;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    const fr1 = mkFloorRing(1.15, 1.22, 0xffffff, 0.95);
    const fr2 = mkFloorRing(1.65, 1.70, 0xffffff, 0.65);
    const fr3 = mkFloorRing(2.3, 2.34, 0x8a8a8a, 0.45);
    const fr4 = mkFloorRing(3.0, 3.03, 0xf59e0b, 0.28);
    scene.add(fr1, fr2, fr3, fr4);

    // ==========================================
    // 5. ROBOT MODEL (High-Definition Smooth Anatomy)
    // ==========================================
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);

    // ──────────────────────────────────────────
    // 5A. FEET & ANKLES
    // ──────────────────────────────────────────
    const mkFoot = (xPos: number) => {
      const footGrp = new THREE.Group();
      footGrp.position.set(xPos, 0, 0);

      const bootTop = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.16, 24, 36), whiteArmour);
      bootTop.rotation.x = Math.PI / 2.2;
      bootTop.position.set(0, 0.065, 0.02);
      bootTop.scale.set(1.0, 1.0, 0.65);
      footGrp.add(bootTop);

      const toeCap = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.06, 20, 28), darkChassis);
      toeCap.rotation.x = Math.PI / 2;
      toeCap.position.set(0, 0.045, 0.12);
      footGrp.add(toeCap);

      const heelCap = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.09), darkChassis);
      heelCap.position.set(0, 0.04, -0.1);
      footGrp.add(heelCap);

      const soleGlow = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.012, 0.31), cyanNeon);
      soleGlow.position.set(0, 0.006, 0.01);
      footGrp.add(soleGlow);

      const ankleDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 32), darkJoint);
      ankleDisc.rotation.z = Math.PI / 2;
      ankleDisc.position.set(0, 0.09, -0.01);
      footGrp.add(ankleDisc);

      const ankleRing = mkRing(0.065, 0.009, 0xffffff);
      ankleRing.position.set(0, 0.09, -0.01);
      footGrp.add(ankleRing);

      return footGrp;
    };

    robotRoot.add(mkFoot(-0.21), mkFoot(0.21));

    // ──────────────────────────────────────────
    // 5B. SHINS & LEGS (High Tessellation)
    // ──────────────────────────────────────────
    const mkLeg = (xPos: number) => {
      const legGrp = new THREE.Group();
      legGrp.position.set(xPos, 0.09, 0);

      const lowerLeg = new THREE.Group();
      legGrp.add(lowerLeg);

      const shinBone = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.048, 0.42, 32), darkChassis);
      shinBone.position.y = 0.21;
      lowerLeg.add(shinBone);

      const shinArmour = new THREE.Mesh(new THREE.CapsuleGeometry(0.062, 0.28, 24, 36), whiteArmour);
      shinArmour.position.set(0, 0.22, 0.025);
      shinArmour.scale.set(0.95, 1.0, 0.7);
      lowerLeg.add(shinArmour);

      const shinLED = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.24, 0.008), cyanNeon);
      shinLED.position.set(0, 0.23, 0.065);
      lowerLeg.add(shinLED);

      const calfArmour = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.18, 20, 28), whiteArmourAccent);
      calfArmour.position.set(0, 0.24, -0.035);
      calfArmour.scale.set(0.9, 1.0, 0.75);
      lowerLeg.add(calfArmour);

      const kneeHub = new THREE.Group();
      kneeHub.position.y = 0.44;
      legGrp.add(kneeHub);

      const kneeCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.09, 36), darkJoint);
      kneeCyl.rotation.z = Math.PI / 2;
      kneeHub.add(kneeCyl);

      const kRingOuter = mkRing(0.075, 0.011, 0xffffff);
      kRingOuter.rotation.y = Math.PI / 2;
      kRingOuter.position.x = xPos > 0 ? 0.05 : -0.05;
      kneeHub.add(kRingOuter);

      const kneecap = new THREE.Mesh(new THREE.SphereGeometry(0.06, 32, 32, 0, Math.PI, 0, Math.PI), whiteArmour);
      kneecap.rotation.x = -Math.PI / 2;
      kneecap.position.set(0, 0, 0.055);
      kneeHub.add(kneecap);

      const upperLeg = new THREE.Group();
      upperLeg.position.y = 0.44;
      legGrp.add(upperLeg);

      const thighBone = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.048, 0.44, 32), darkChassis);
      thighBone.position.y = 0.22;
      upperLeg.add(thighBone);

      const quadArmour = new THREE.Mesh(new THREE.CapsuleGeometry(0.082, 0.28, 24, 36), whiteArmour);
      quadArmour.position.set(0, 0.23, 0.02);
      quadArmour.scale.set(0.95, 1.0, 0.85);
      upperLeg.add(quadArmour);

      const outerThighPlate = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.22, 20, 28), whiteArmourAccent);
      outerThighPlate.position.set(xPos > 0 ? 0.075 : -0.075, 0.24, 0);
      upperLeg.add(outerThighPlate);

      const thighLED = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.16, 0.012), purpleNeon);
      thighLED.position.set(xPos > 0 ? 0.088 : -0.088, 0.24, 0);
      upperLeg.add(thighLED);

      return legGrp;
    };

    robotRoot.add(mkLeg(-0.21), mkLeg(0.21));

    // ──────────────────────────────────────────
    // 5C. PELVIS & HIPS
    // ──────────────────────────────────────────
    const pelvisGrp = new THREE.Group();
    pelvisGrp.position.set(0, 0.96, 0);
    robotRoot.add(pelvisGrp);

    const pelvisCore = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.18, 36), darkChassis);
    pelvisGrp.add(pelvisCore);

    const lHipPlate = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.12, 20, 28), whiteArmour);
    lHipPlate.rotation.z = 0.25;
    lHipPlate.position.set(-0.19, -0.01, 0.02);
    pelvisGrp.add(lHipPlate);

    const rHipPlate = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.12, 20, 28), whiteArmour);
    rHipPlate.rotation.z = -0.25;
    rHipPlate.position.set(0.19, -0.01, 0.02);
    pelvisGrp.add(rHipPlate);

    const lHipRing = mkRing(0.07, 0.01, 0xffffff);
    lHipRing.rotation.y = Math.PI / 2;
    lHipRing.position.set(-0.24, -0.02, 0);
    pelvisGrp.add(lHipRing);

    const rHipRing = mkRing(0.07, 0.01, 0xffffff);
    rHipRing.rotation.y = Math.PI / 2;
    rHipRing.position.set(0.24, -0.02, 0);
    pelvisGrp.add(rHipRing);

    // ──────────────────────────────────────────
    // 5D. SCULPTED TORSO & CHEST
    // ──────────────────────────────────────────
    const torsoGrp = new THREE.Group();
    torsoGrp.position.set(0, 1.05, 0);
    robotRoot.add(torsoGrp);

    const spineColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.18, 36), darkChassis);
    spineColumn.position.y = 0.07;
    torsoGrp.add(spineColumn);

    for (let r = 0; r < 3; r++) {
      const ribRing = mkRing(0.17 + r * 0.01, 0.005, 0xffffff);
      ribRing.rotation.x = Math.PI / 2;
      ribRing.position.y = 0.01 + r * 0.055;
      torsoGrp.add(ribRing);
    }

    const chestBacking = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.36, 36), darkChassis);
    chestBacking.position.set(0, 0.32, -0.02);
    torsoGrp.add(chestBacking);

    const lPecPlate = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.16, 24, 36), whiteArmour);
    lPecPlate.rotation.set(-0.2, -0.2, 0.15);
    lPecPlate.position.set(-0.15, 0.35, 0.08);
    lPecPlate.scale.set(1.0, 1.0, 0.6);
    torsoGrp.add(lPecPlate);

    const rPecPlate = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.16, 24, 36), whiteArmour);
    rPecPlate.rotation.set(-0.2, 0.2, -0.15);
    rPecPlate.position.set(0.15, 0.35, 0.08);
    rPecPlate.scale.set(1.0, 1.0, 0.6);
    torsoGrp.add(rPecPlate);

    const collarArmour = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.36, 24, 36), whiteArmour);
    collarArmour.rotation.z = Math.PI / 2;
    collarArmour.position.set(0, 0.48, 0.01);
    collarArmour.scale.set(0.65, 1.0, 0.65);
    torsoGrp.add(collarArmour);

    // AI Reactor Core
    const coreHousing = new THREE.Group();
    coreHousing.position.set(0, 0.36, 0.16);
    torsoGrp.add(coreHousing);

    const coreBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 48), darkJoint);
    coreBezel.rotation.x = Math.PI / 2;
    coreHousing.add(coreBezel);

    const coreCenter = new THREE.Mesh(new THREE.SphereGeometry(0.055, 36, 36), cyanNeonBright);
    coreCenter.position.z = 0.02;
    coreHousing.add(coreCenter);

    const coreRing1 = mkRing(0.072, 0.009, 0xffffff);
    coreRing1.position.z = 0.025;
    coreHousing.add(coreRing1);

    const coreRing2 = mkRing(0.096, 0.007, 0xffffff);
    coreRing2.position.z = 0.025;
    coreHousing.add(coreRing2);

    const coreRing3 = mkRing(0.12, 0.005, 0x8b5cf6);
    coreRing3.position.z = 0.025;
    coreHousing.add(coreRing3);

    const emblemPlate = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.065, 0.02), darkChassis);
    emblemPlate.position.set(0, 0.19, 0.16);
    torsoGrp.add(emblemPlate);

    const emblemBorder = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.18, 0.065, 0.02)),
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    emblemBorder.position.copy(emblemPlate.position);
    torsoGrp.add(emblemBorder);

    // ──────────────────────────────────────────
    // 5E. ULTRA-HD SMOOTH ROBOT HEAD (128x128 Tessellation) & POINTER TRACKING VISION
    // ──────────────────────────────────────────
    const headGrp = new THREE.Group();
    headGrp.position.set(0, 0.60, 0.01);
    torsoGrp.add(headGrp);

    // --- Complex Hydraulic Robotic Neck ---
    const neckBase = new THREE.Group();
    headGrp.add(neckBase);

    // Central ribbed black spinal column
    const spineNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.064, 0.15, 32), darkChassis);
    spineNeck.position.set(0, -0.045, -0.01);
    neckBase.add(spineNeck);

    for (let nr = 0; nr < 3; nr++) {
      const nRing = mkRing(0.056 + nr * 0.003, 0.0045, 0xffffff);
      nRing.rotation.x = Math.PI / 2;
      nRing.position.set(0, -0.07 + nr * 0.035, -0.01);
      neckBase.add(nRing);
    }

    // Left & Right Hydraulic Piston Tubes
    const mkPiston = (px: number) => {
      const pGrp = new THREE.Group();
      pGrp.position.set(px, -0.04, 0.02);

      const pRod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.13, 24), darkMetallicPiston);
      pGrp.add(pRod);

      const pCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.04, 24), darkJoint);
      pCollar.position.y = 0.03;
      pGrp.add(pCollar);

      const pLED = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.1, 0.005), cyanNeon);
      pLED.position.set(px > 0 ? -0.008 : 0.008, 0, 0.01);
      pGrp.add(pLED);

      return pGrp;
    };

    neckBase.add(mkPiston(-0.06), mkPiston(0.06));

    // Outer white ceramic neck collar guards
    const lNeckGuard = new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.08, 16, 24), whiteArmour);
    lNeckGuard.position.set(-0.082, -0.04, -0.01);
    neckBase.add(lNeckGuard);

    const rNeckGuard = new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.08, 16, 24), whiteArmour);
    rNeckGuard.position.set(0.082, -0.04, -0.01);
    neckBase.add(rNeckGuard);

    // --- FULL HD SMOOTH HEAD DOME (128x128 Segments for Zero Faceting on Zoom!) ---
    const headDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.195, 128, 128),
      whiteArmour
    );
    headDome.position.set(0, 0.16, 0);
    headGrp.add(headDome);

    // Aerodynamic Dorsal Crest along crown
    const headCrest = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.045, 0.22), whiteArmourAccent);
    headCrest.position.set(0, 0.34, -0.04);
    headGrp.add(headCrest);

    // Symmetrical Slanted Neon Cyan LED Vents on Upper Helmet Brow
    const lHeadVent = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.08, 0.015), cyanNeon);
    lHeadVent.rotation.set(-0.3, 0, 0.5);
    lHeadVent.position.set(-0.14, 0.28, 0.04);
    headGrp.add(lHeadVent);

    const rHeadVent = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.08, 0.015), cyanNeon);
    rHeadVent.rotation.set(-0.3, 0, -0.5);
    rHeadVent.position.set(0.14, 0.28, 0.04);
    headGrp.add(rHeadVent);

    // Sculpted Chin Plate with Integrated Optical Sensor Aperture
    const chinPlate = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.035, 0.04), whiteArmourAccent);
    chinPlate.position.set(0, -0.015, 0.17);
    headGrp.add(chinPlate);

    const chinInset = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.018, 0.012), darkChassis);
    chinInset.position.set(0, -0.015, 0.188);
    headGrp.add(chinInset);

    // Chin Optical Camera Lens
    const chinLens = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.008, 24), cyanNeonBright);
    chinLens.rotation.x = Math.PI / 2;
    chinLens.position.set(0, -0.015, 0.193);
    headGrp.add(chinLens);

    // ──────────────────────────────────────────
    // PURE 3D LIGHT FACE (Ultra HD Smooth + Active Pointer Gaze Tracking!)
    // ──────────────────────────────────────────
    const eyeLightParticles: THREE.Mesh[] = [];

    // --- 1. CIRCULAR LIGHT EYES WITH ACTIVE PUPIL GAZE GROUP ---
    const mk3DEye = (ex: number, ey: number, ez: number, rotY: number, isRight: boolean) => {
      const eyeGrp = new THREE.Group();
      eyeGrp.position.set(ex, ey, ez);
      eyeGrp.rotation.set(-0.06, rotY, 0); // Hugs the spherical cheek contour!
      headGrp.add(eyeGrp);

      // Depth Layer 1 (Outer Atmospheric Soft Glow Disc - 64 Segments)
      const glowDisc = new THREE.Mesh(
        new THREE.RingGeometry(0.014, 0.040, 64),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.40,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        })
      );
      eyeGrp.add(glowDisc);

      // Depth Layer 2 (Outer Glowing Cyan Torus Ring - 96 Segments)
      const outerRing = mkRing(0.032, 0.0028, 0xffffff);
      outerRing.position.z = 0.003;
      eyeGrp.add(outerRing);

      // Depth Layer 3 (Intermediate Concentric Electric-Blue Ring)
      const midRing = mkRing(0.022, 0.0024, 0xffffff);
      midRing.position.z = 0.006;
      eyeGrp.add(midRing);

      // --- DYNAMIC PUPIL & IRIS GROUP (Follows Pointer Gaze Directly!) ---
      const pupilIrisGrp = new THREE.Group();
      eyeGrp.add(pupilIrisGrp);

      // Depth Layer 4 (Inner Glowing White/Cyan Ring)
      const innerRing = mkRing(0.013, 0.0018, 0xffffff);
      innerRing.position.z = 0.009;
      pupilIrisGrp.add(innerRing);

      // Depth Layer 5 (Dark Central Pupil Core - 48 Segments)
      const pupilCore = new THREE.Mesh(
        new THREE.CircleGeometry(0.010, 48),
        new THREE.MeshBasicMaterial({ color: 0x020510, side: THREE.DoubleSide })
      );
      pupilCore.position.z = 0.011;
      pupilIrisGrp.add(pupilCore);

      // Depth Layer 6 (Bright Glowing Central Focal Lens Dot - 24x24 Segments)
      const pupilDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.004, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      pupilDot.position.z = 0.013;
      pupilIrisGrp.add(pupilDot);

      // Orbiting Neural Light Particles (Layer 7)
      for (let p = 0; p < 6; p++) {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.0022, 16, 16), cyanNeonBright);
        dot.position.z = 0.008;
        pupilIrisGrp.add(dot);
        eyeLightParticles.push(dot);
      }

      // Happy Smiling Light Arc Eyes (Visible in happy/welcome states)
      const happyArc = new THREE.Mesh(
        new THREE.TorusGeometry(0.028, 0.0038, 24, 64, Math.PI * 0.8),
        cyanNeonBright
      );
      happyArc.rotation.z = Math.PI;
      happyArc.position.set(0, -0.006, 0.014);
      happyArc.visible = false;
      eyeGrp.add(happyArc);

      // Error X Cross (Visible in error state)
      const errCrossGrp = new THREE.Group();
      errCrossGrp.position.z = 0.014;
      const xBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.0045, 0.003), new THREE.MeshBasicMaterial({ color: 0xa3a3a3 }));
      xBar1.rotation.z = Math.PI / 4;
      const xBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.0045, 0.003), new THREE.MeshBasicMaterial({ color: 0xa3a3a3 }));
      xBar2.rotation.z = -Math.PI / 4;
      errCrossGrp.add(xBar1, xBar2);
      errCrossGrp.visible = false;
      eyeGrp.add(errCrossGrp);

      return { eyeGrp, glowDisc, outerRing, midRing, innerRing, pupilIrisGrp, pupilDot, happyArc, errCrossGrp };
    };

    // Positioned flush along head sphere radius R=0.195 at y=0.18
    const leftEye3D = mk3DEye(-0.058, 0.18, 0.184, -0.30, false);
    const rightEye3D = mk3DEye(0.058, 0.18, 0.184, 0.30, true);

    // --- 2. HOLOGRAPHIC LIGHT EYEBROWS (Horizontal Arched Brows ⏜ ⏜) ---
    const lEyebrowLight = new THREE.Mesh(
      new THREE.TorusGeometry(0.026, 0.0024, 16, 48, Math.PI * 0.52),
      cyanNeon
    );
    lEyebrowLight.rotation.set(-0.32, -0.28, Math.PI * 0.24);
    lEyebrowLight.position.set(-0.058, 0.230, 0.178);
    headGrp.add(lEyebrowLight);

    const rEyebrowLight = new THREE.Mesh(
      new THREE.TorusGeometry(0.026, 0.0024, 16, 48, Math.PI * 0.52),
      cyanNeon
    );
    rEyebrowLight.rotation.set(-0.32, 0.28, Math.PI * 0.24);
    rEyebrowLight.position.set(0.058, 0.230, 0.178);
    headGrp.add(rEyebrowLight);

    // --- 3. MOUTH MADE BY LIGHT (Curvature Hugging Smile Arc) ---
    const mouthLightGrp = new THREE.Group();
    mouthLightGrp.position.set(0, 0.108, 0.188);
    mouthLightGrp.rotation.set(0.24, 0, 0); // Hugs lower sphere curvature!
    headGrp.add(mouthLightGrp);

    // Smooth Glowing Light Smile Arc ( ‿ )
    const mouthSmileArc = new THREE.Mesh(
      new THREE.TorusGeometry(0.030, 0.0028, 24, 64, Math.PI * 0.65),
      cyanNeonBright
    );
    mouthSmileArc.rotation.set(0, 0, -Math.PI * 0.825);
    mouthLightGrp.add(mouthSmileArc);

    const mouthSmileCore = new THREE.Mesh(
      new THREE.TorusGeometry(0.030, 0.0014, 20, 48, Math.PI * 0.45),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    mouthSmileCore.rotation.set(0, 0, -Math.PI * 0.725);
    mouthSmileCore.position.z = 0.0015;
    mouthLightGrp.add(mouthSmileCore);

    // Equalizer voice waveform bars for speech
    const mouthBars: THREE.Mesh[] = [];
    const barCount = 9;
    for (let b = 0; b < barCount; b++) {
      const bMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.0045, 0.003, 0.002),
        cyanNeonBright
      );
      bMesh.position.set(-0.024 + b * 0.006, 0, 0.002);
      bMesh.visible = false;
      mouthLightGrp.add(bMesh);
      mouthBars.push(bMesh);
    }

    // --- 4. FOREHEAD HOLOGRAPHIC AIML BRAIN EMBLEM (Curvature Hugging) ---
    const foreheadBadgeGrp = new THREE.Group();
    foreheadBadgeGrp.position.set(0, 0.275, 0.155);
    foreheadBadgeGrp.rotation.set(-0.55, 0, 0); // Hugs upper forehead dome!
    headGrp.add(foreheadBadgeGrp);

    // Hexagonal Dark Glass Badge Plate
    const badgePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.030, 0.035, 0.004, 6),
      darkChassis
    );
    badgePlate.rotation.x = Math.PI / 2;
    badgePlate.rotation.y = Math.PI / 6;
    foreheadBadgeGrp.add(badgePlate);

    const badgeBorder = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.030, 0.035, 0.004, 6)),
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    badgeBorder.rotation.copy(badgePlate.rotation);
    foreheadBadgeGrp.add(badgeBorder);

    // Glowing 3D Neural Brain Icon inside badge
    const brainIcon = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.012, 1),
      new THREE.MeshBasicMaterial({ color: 0x8a8a8a, wireframe: true })
    );
    brainIcon.position.set(0, 0.004, 0.005);
    foreheadBadgeGrp.add(brainIcon);

    const brainCoreDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.0045, 16, 16),
      cyanNeonBright
    );
    brainCoreDot.position.set(0, 0.004, 0.007);
    foreheadBadgeGrp.add(brainCoreDot);

    // --- Sleek Small Cylindrical Ear Pods (Matching Reference Image!) ---
    const mkEar = (xPos: number) => {
      const earGrp = new THREE.Group();
      earGrp.position.set(xPos, 0.16, 0);

      // 1. Dark attachment collar flush against head
      const earCollar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.034, 0.034, 0.008, 32),
        darkChassis
      );
      earCollar.rotation.z = Math.PI / 2;
      earGrp.add(earCollar);

      // 2. Compact White Ceramic Cylindrical Body
      const podBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.030, 0.030, 0.034, 32),
        whiteArmour
      );
      podBody.rotation.z = Math.PI / 2;
      podBody.position.x = xPos > 0 ? 0.017 : -0.017;
      earGrp.add(podBody);

      // 3. Lower Cyan Neon Accent Band
      const cyanBand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0305, 0.0305, 0.012, 32),
        cyanNeon
      );
      cyanBand.rotation.z = Math.PI / 2;
      cyanBand.position.x = xPos > 0 ? 0.014 : -0.014;
      earGrp.add(cyanBand);

      // 4. Glowing Cyan Rim Ring
      const podRing = mkRing(0.029, 0.0028, 0xffffff);
      podRing.rotation.y = Math.PI / 2;
      podRing.position.x = xPos > 0 ? 0.034 : -0.034;
      earGrp.add(podRing);

      // 5. Subtle Inner Purple Accent Ring
      const podRingPurple = mkRing(0.020, 0.002, 0x8a8a8a);
      podRingPurple.rotation.y = Math.PI / 2;
      podRingPurple.position.x = xPos > 0 ? 0.0345 : -0.0345;
      earGrp.add(podRingPurple);

      // 6. Outer Beveled Cap
      const outerCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.026, 0.029, 0.004, 32),
        whiteArmourAccent
      );
      outerCap.rotation.z = Math.PI / 2;
      outerCap.position.x = xPos > 0 ? 0.035 : -0.035;
      earGrp.add(outerCap);

      // 7. Center Small Glowing Sensor Lens Dot
      const centerSensor = new THREE.Mesh(
        new THREE.SphereGeometry(0.0065, 16, 16),
        cyanNeonBright
      );
      centerSensor.position.x = xPos > 0 ? 0.037 : -0.037;
      earGrp.add(centerSensor);

      return { earGrp, podRing, podRingPurple, centerSensor };
    };

    const leftEar = mkEar(-0.192);
    const rightEar = mkEar(0.192);
    headGrp.add(leftEar.earGrp, rightEar.earGrp);

    // Subtle Sleek Slanted Antennas
    const mkAntenna = (isRight: boolean) => {
      const antGrp = new THREE.Group();
      const side = isRight ? 1 : -1;
      antGrp.position.set(0.13 * side, 0.31, 0.02);
      antGrp.rotation.set(-0.15, 0, -0.55 * side);

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.004, 0.055, 16),
        whiteArmour
      );
      stem.position.y = 0.0275;
      antGrp.add(stem);

      const tip = new THREE.Mesh(
        new THREE.SphereGeometry(0.005, 16, 16),
        cyanNeonBright
      );
      tip.position.y = 0.055;
      antGrp.add(tip);

      return antGrp;
    };

    headGrp.add(mkAntenna(true), mkAntenna(false));

    // ──────────────────────────────────────────
    // 5F. RIGHT ARM (Muscular Sculpted Anatomy & Welcoming Gesture)
    // ──────────────────────────────────────────
    const rShoulder = new THREE.Group();
    rShoulder.position.set(0.38, 0.44, 0);
    torsoGrp.add(rShoulder);

    const rShBall = new THREE.Mesh(new THREE.SphereGeometry(0.078, 24, 24), darkJoint);
    rShoulder.add(rShBall);

    const rShRing = mkRing(0.092, 0.012, 0xffffff);
    rShRing.rotation.y = Math.PI / 2;
    rShoulder.add(rShRing);

    // Muscular Deltoid Pauldron Cap
    const rPauldron = new THREE.Mesh(
      new THREE.SphereGeometry(0.132, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.65),
      whiteArmour
    );
    rPauldron.scale.set(1.2, 0.9, 1.2);
    rPauldron.position.set(0.02, 0.04, 0);
    rShoulder.add(rPauldron);

    const rPauldronRidge = new THREE.Mesh(
      new THREE.SphereGeometry(0.136, 32, 32, 0, Math.PI * 2, 0, Math.PI / 3.5),
      whiteArmourAccent
    );
    rPauldronRidge.position.set(0.02, 0.04, 0);
    rShoulder.add(rPauldronRidge);

    // Muscular Bicep Belly & Tricep Architecture
    const rBicep = new THREE.Mesh(new THREE.CapsuleGeometry(0.072, 0.20, 24, 32), whiteArmour);
    rBicep.position.set(0, -0.16, 0.01);
    rShoulder.add(rBicep);

    const rTricepPlate = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.18, 20, 28), whiteArmourAccent);
    rTricepPlate.position.set(0, -0.16, -0.03);
    rShoulder.add(rTricepPlate);

    const rBicepCore = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.22, 24), darkChassis);
    rBicepCore.position.set(0, -0.16, 0);
    rShoulder.add(rBicepCore);

    const rBicepLED = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.16, 0.01), cyanNeon);
    rBicepLED.position.set(0.072, -0.16, 0.01);
    rShoulder.add(rBicepLED);

    // Muscular Elbow Joint Hub
    const rElbow = new THREE.Group();
    rElbow.position.set(0, -0.30, 0);
    rShoulder.add(rElbow);

    const rElbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.065, 24, 24), darkJoint);
    rElbow.add(rElbowJoint);

    const rElbowRing = mkRing(0.072, 0.009, 0xffffff);
    rElbow.add(rElbowRing);

    // Muscular Contoured Forearm (Brachioradialis & Flexors)
    const rForearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.068, 0.20, 24, 32), whiteArmour);
    rForearm.position.set(0, -0.15, 0);
    rElbow.add(rForearm);

    const rForeFlexor = new THREE.Mesh(new THREE.CapsuleGeometry(0.046, 0.18, 20, 28), whiteArmourAccent);
    rForeFlexor.position.set(0.02, -0.15, -0.03);
    rElbow.add(rForeFlexor);

    const rForeLED = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.18, 0.012), cyanNeon);
    rForeLED.position.set(0, -0.15, 0.068);
    rElbow.add(rForeLED);

    const rWristCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.062, 0.04, 32), darkJoint);
    rWristCuff.position.set(0, -0.27, 0);
    rElbow.add(rWristCuff);

    const rWristRing = mkRing(0.062, 0.007, 0xffffff);
    rWristRing.rotation.x = Math.PI / 2;
    rWristRing.position.set(0, -0.27, 0);
    rElbow.add(rWristRing);

    // ──────────────────────────────────────────
    // MASTERCLASS 5-FINGER ARTICULATED ROBOTIC HAND (Appropriately Scaled & Muscular)
    // ──────────────────────────────────────────
    const mkRoboticHand = (isRight: boolean, isHoldingTablet: boolean = false) => {
      const handGrp = new THREE.Group();
      const side = isRight ? 1 : -1;

      // 1. Wrist Joint Hub & Spherical Rotator (Proportionate to 0.062 wrist cuff)
      const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(0.038, 24, 24), darkJoint);
      handGrp.add(wristJoint);

      const wristRingMesh = mkRing(0.052, 0.005, 0xffffff);
      wristRingMesh.rotation.x = Math.PI / 2;
      handGrp.add(wristRingMesh);

      // 2. Palm Shell (Sculpted Ceramic Metacarpus - Scaled Appropriately!)
      const palmCenter = new THREE.Group();
      palmCenter.position.set(0, -0.040, 0);
      handGrp.add(palmCenter);

      // White ceramic dorsal shell (Width: 0.092, Length: 0.072)
      const dorsalPlate = new THREE.Mesh(new THREE.BoxGeometry(0.092, 0.072, 0.028), whiteArmour);
      dorsalPlate.position.set(0, 0, -0.003);
      palmCenter.add(dorsalPlate);

      // Knuckle ridge armor accent bar
      const knuckleBar = new THREE.Mesh(new THREE.BoxGeometry(0.096, 0.018, 0.030), whiteArmourAccent);
      knuckleBar.position.set(0, -0.028, -0.002);
      palmCenter.add(knuckleBar);

      // Dark palmar grip chassis
      const palmarGrip = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.062, 0.024), darkChassis);
      palmarGrip.position.set(0, 0, 0.006);
      palmCenter.add(palmarGrip);

      // Central Palm Optic Sensor / Repulsor Core Lens
      const palmCore = new THREE.Mesh(new THREE.SphereGeometry(0.015, 20, 20), cyanNeonBright);
      palmCore.position.set(0, 0, 0.018);
      palmCenter.add(palmCore);

      const palmCoreRing = mkRing(0.019, 0.0028, 0xffffff);
      palmCoreRing.position.set(0, 0, 0.019);
      palmCenter.add(palmCoreRing);

      // 3. Articulated Finger Builder (Dual-Segment Phalanges + Knuckles)
      const mkDigit = (
        x: number,
        y: number,
        z: number,
        length: number,
        baseAngleX: number,
        baseAngleZ: number,
        curl: number
      ) => {
        const fingerRoot = new THREE.Group();
        fingerRoot.position.set(x, y, z);
        fingerRoot.rotation.set(baseAngleX, 0, baseAngleZ);
        palmCenter.add(fingerRoot);

        // Metacarpophalangeal Knuckle Ball
        const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.0095, 16, 16), darkJoint);
        fingerRoot.add(knuckle);

        // Segment 1: Proximal Phalanx
        const seg1Len = length * 0.52;
        const seg1 = new THREE.Group();
        fingerRoot.add(seg1);

        const bone1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.0085, seg1Len, 16, 20), whiteArmour);
        bone1.position.y = -seg1Len / 2;
        seg1.add(bone1);

        const pad1 = new THREE.Mesh(new THREE.BoxGeometry(0.012, seg1Len * 0.8, 0.006), darkChassis);
        pad1.position.set(0, -seg1Len / 2, 0.008);
        seg1.add(pad1);

        // Interphalangeal Knuckle Joint
        const joint2 = new THREE.Group();
        joint2.position.set(0, -seg1Len, 0);
        joint2.rotation.x = curl; // Articulated natural finger curl!
        seg1.add(joint2);

        const joint2Ball = new THREE.Mesh(new THREE.SphereGeometry(0.0078, 14, 14), darkJoint);
        joint2.add(joint2Ball);

        const joint2Ring = mkRing(0.0095, 0.0018, 0xffffff);
        joint2Ring.rotation.y = Math.PI / 2;
        joint2.add(joint2Ring);

        // Segment 2: Distal Phalanx (Fingertip)
        const seg2Len = length * 0.44;
        const bone2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.0075, seg2Len, 16, 20), whiteArmour);
        bone2.position.y = -seg2Len / 2;
        joint2.add(bone2);

        // Sensory Optic Fingertip Node
        const tipGlow = new THREE.Mesh(new THREE.SphereGeometry(0.0065, 14, 14), cyanNeonBright);
        tipGlow.position.set(0, -seg2Len, 0.002);
        joint2.add(tipGlow);

        return fingerRoot;
      };

      if (!isHoldingTablet) {
        // Welcoming Forward Hand: 4 Articulated Extended Fingers + Opposable Thumb
        const s = side;
        mkDigit(-0.035 * s, -0.036, 0, 0.082, -0.22, 0.22 * s, -0.25); // Index (0.082 len)
        mkDigit(-0.012 * s, -0.038, 0, 0.096, -0.16, 0.06 * s, -0.20); // Middle (0.096 len - longest)
        mkDigit(0.012 * s, -0.037, 0, 0.090, -0.18, -0.08 * s, -0.22); // Ring (0.090 len)
        mkDigit(0.035 * s, -0.033, 0, 0.074, -0.25, -0.24 * s, -0.30); // Pinky (0.074 len)

        // Opposable Muscular Thumb
        const thumbGrp = new THREE.Group();
        thumbGrp.position.set(-0.050 * s, 0.004, 0.010);
        thumbGrp.rotation.set(-0.35, 0.32 * s, 0.75 * s);
        palmCenter.add(thumbGrp);

        const tKnuckle = new THREE.Mesh(new THREE.SphereGeometry(0.011, 16, 16), darkJoint);
        thumbGrp.add(tKnuckle);

        const tBone1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.0095, 0.040, 16, 20), whiteArmour);
        tBone1.position.y = -0.020;
        thumbGrp.add(tBone1);

        const tJoint2 = new THREE.Group();
        tJoint2.position.set(0, -0.040, 0);
        tJoint2.rotation.x = -0.35;
        thumbGrp.add(tJoint2);

        const tBone2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.0085, 0.036, 16, 20), whiteArmour);
        tBone2.position.y = -0.018;
        tJoint2.add(tBone2);

        const tTip = new THREE.Mesh(new THREE.SphereGeometry(0.0075, 14, 14), cyanNeonBright);
        tTip.position.set(0, -0.036, 0.003);
        tJoint2.add(tTip);

      } else {
        // Left Tablet Grip Hand: Fingers wrapped around tablet edge
        mkDigit(-0.033, -0.036, 0, 0.078, -0.45, 0.12, -0.65);
        mkDigit(-0.011, -0.038, 0, 0.088, -0.45, 0.04, -0.65);
        mkDigit(0.011, -0.037, 0, 0.082, -0.45, -0.06, -0.65);
        mkDigit(0.033, -0.033, 0, 0.068, -0.45, -0.15, -0.65);

        // Thumb pinching tablet front face
        const thumbGrp = new THREE.Group();
        thumbGrp.position.set(0.048, 0.006, 0.012);
        thumbGrp.rotation.set(0.25, -0.2, -0.65);
        palmCenter.add(thumbGrp);

        const tBone = new THREE.Mesh(new THREE.CapsuleGeometry(0.009, 0.055, 16, 20), whiteArmour);
        tBone.position.y = -0.0275;
        thumbGrp.add(tBone);

        const tTip = new THREE.Mesh(new THREE.SphereGeometry(0.0075, 14, 14), cyanNeonBright);
        tTip.position.set(0, -0.055, 0.003);
        thumbGrp.add(tTip);
      }

      return handGrp;
    };

    // Right Hand (Proper Proportionate Articulated Robot Hand)
    const rHand = mkRoboticHand(true, false);
    rHand.position.set(0, -0.30, 0);
    rElbow.add(rHand);

    rShoulder.rotation.set(-0.68, 0.1, 0.42);
    rElbow.rotation.set(-0.32, 0, 0);

    // ──────────────────────────────────────────
    // 5G. LEFT ARM (Muscular Sculpted Anatomy & Holographic Tablet)
    // ──────────────────────────────────────────
    const lShoulder = new THREE.Group();
    lShoulder.position.set(-0.38, 0.44, 0);
    torsoGrp.add(lShoulder);

    const lShBall = new THREE.Mesh(new THREE.SphereGeometry(0.078, 24, 24), darkJoint);
    lShoulder.add(lShBall);

    const lShRing = mkRing(0.092, 0.012, 0xffffff);
    lShRing.rotation.y = Math.PI / 2;
    lShoulder.add(lShRing);

    // Muscular Left Deltoid Pauldron Cap
    const lPauldron = new THREE.Mesh(
      new THREE.SphereGeometry(0.132, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.65),
      whiteArmour
    );
    lPauldron.scale.set(1.2, 0.9, 1.2);
    lPauldron.position.set(-0.02, 0.04, 0);
    lShoulder.add(lPauldron);

    const lPauldronRidge = new THREE.Mesh(
      new THREE.SphereGeometry(0.136, 32, 32, 0, Math.PI * 2, 0, Math.PI / 3.5),
      whiteArmourAccent
    );
    lPauldronRidge.position.set(-0.02, 0.04, 0);
    lShoulder.add(lPauldronRidge);

    // Muscular Left Bicep & Tricep
    const lBicep = new THREE.Mesh(new THREE.CapsuleGeometry(0.072, 0.20, 24, 32), whiteArmour);
    lBicep.position.set(0, -0.16, 0.01);
    lShoulder.add(lBicep);

    const lTricepPlate = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.18, 20, 28), whiteArmourAccent);
    lTricepPlate.position.set(0, -0.16, -0.03);
    lShoulder.add(lTricepPlate);

    const lBicepCore = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.22, 24), darkChassis);
    lBicepCore.position.set(0, -0.16, 0);
    lShoulder.add(lBicepCore);

    const lElbow = new THREE.Group();
    lElbow.position.set(0, -0.30, 0);
    lShoulder.add(lElbow);

    const lElbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.065, 24, 24), darkJoint);
    lElbow.add(lElbowJoint);

    const lElbowRing = mkRing(0.072, 0.009, 0xffffff);
    lElbow.add(lElbowRing);

    // Muscular Left Forearm
    const lForearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.068, 0.20, 24, 32), whiteArmour);
    lForearm.position.set(0, -0.15, 0);
    lElbow.add(lForearm);

    const lForeFlexor = new THREE.Mesh(new THREE.CapsuleGeometry(0.046, 0.18, 20, 28), whiteArmourAccent);
    lForeFlexor.position.set(-0.02, -0.15, -0.03);
    lElbow.add(lForeFlexor);

    const lWristCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.062, 0.04, 32), darkJoint);
    lWristCuff.position.set(0, -0.27, 0);
    lElbow.add(lWristCuff);

    // Left Hand (Proper Proportionate Articulated Robot Hand gripping tablet)
    const lHand = mkRoboticHand(false, true);
    lHand.position.set(0, -0.30, 0);
    lElbow.add(lHand);

    lShoulder.rotation.set(-0.48, 0, -0.32);
    lElbow.rotation.set(-0.62, 0, 0.38);

    // Holographic Tablet
    const tabletGrp = new THREE.Group();
    tabletGrp.position.set(0.14, -0.04, 0.20);
    tabletGrp.rotation.set(-0.35, 0.22, -0.08);
    lHand.add(tabletGrp);

    const tabletGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.40), holoGlassMat);
    tabletGrp.add(tabletGlass);

    const tabletBorder = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.52, 0.40)),
      new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
    );
    tabletGrp.add(tabletBorder);

    const tabletInner = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.46, 0.34)),
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    tabletInner.position.z = 0.001;
    tabletGrp.add(tabletInner);

    const chartBars: THREE.Mesh[] = [];
    for (let b = 0; b < 6; b++) {
      const bH = 0.04 + (b % 3) * 0.03;
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.028, bH, 0.002),
        new THREE.MeshBasicMaterial({ color: b % 2 === 0 ? 0xffffff : 0x8a8a8a })
      );
      bar.position.set(-0.13 + b * 0.052, -0.06 + bH / 2, 0.002);
      tabletGrp.add(bar);
      chartBars.push(bar);
    }

    const tabletScan = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.003, 0.001), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    tabletScan.position.z = 0.002;
    tabletGrp.add(tabletScan);

    // ==========================================
    // 7. LAB AMBIENCE & FX
    // ==========================================
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xd4d4d4,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const laserBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 2.2, 4.0, 32, 1, true), laserMat);
    laserBeam.position.y = 1.7;
    scene.add(laserBeam);

    // ==========================================
    // 8. INTERACTIVE POINTER TRACKING & ROTATION
    // ==========================================
    let isDragging = false;
    let prevMX = 0, prevMY = 0, targetRotY = 0, targetRotX = 0;
    let pointerNormX = 0, pointerNormY = 0;
    let curHeadRotY = 0, curHeadRotX = 0;
    let curGazeX = 0, curGazeY = 0;

    const onMD = (e: MouseEvent) => {
      isDragging = true;
      prevMX = e.clientX;
      prevMY = e.clientY;
    };

    const onMM = (e: MouseEvent) => {
      // Global screen normalized coordinates (-1 to 1)
      pointerNormX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNormY = (e.clientY / window.innerHeight) * 2 - 1;

      if (isDragging) {
        targetRotY += (e.clientX - prevMX) * 0.007;
        targetRotX += (e.clientY - prevMY) * 0.005;
        targetRotX = Math.max(-0.35, Math.min(0.35, targetRotX));
        prevMX = e.clientX;
        prevMY = e.clientY;
      }
    };

    const onMU = () => { isDragging = false; };

    container.addEventListener('mousedown', onMD);
    window.addEventListener('mousemove', onMM);
    window.addEventListener('mouseup', onMU);

    const onTS = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMX = e.touches[0].clientX;
        prevMY = e.touches[0].clientY;
        pointerNormX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        pointerNormY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
      }
    };

    const onTM = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        pointerNormX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        pointerNormY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
        if (isDragging) {
          targetRotY += (e.touches[0].clientX - prevMX) * 0.008;
          targetRotX += (e.touches[0].clientY - prevMY) * 0.005;
          targetRotX = Math.max(-0.35, Math.min(0.35, targetRotX));
          prevMX = e.touches[0].clientX;
          prevMY = e.touches[0].clientY;
        }
      }
    };

    const onTE = () => { isDragging = false; };

    container.addEventListener('touchstart', onTS, { passive: true });
    window.addEventListener('touchmove', onTM, { passive: true });
    window.addEventListener('touchend', onTE);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 9. ANIMATION LOOP & ACTIVE VISION TRACKING
    // ==========================================
    let animId: number;
    let t = 0;
    let prevAct = actionRef.current;
    let actionStartTime = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;
      const act = actionRef.current;

      // Track action changes and reset kinematics
      if (act !== prevAct) {
        prevAct = act;
        actionStartTime = t;

        // When ending turn_around spin, normalize angle to [-PI, PI] for smooth lerp back to 0
        if (act !== 'turn_around') {
          robotRoot.rotation.y = ((robotRoot.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          if (robotRoot.rotation.y > Math.PI) {
            robotRoot.rotation.y -= Math.PI * 2;
          }
        }
      }

      const elapsed = t - actionStartTime;

      // --- ROBOT'S VISION ACTIVELY TRACKS POINTER (Gaze & Pupil Movement) ---
      const targetGazeX = Math.max(-0.008, Math.min(0.008, pointerNormX * 0.007));
      const targetGazeY = Math.max(-0.006, Math.min(0.006, -pointerNormY * 0.005));
      curGazeX += (targetGazeX - curGazeX) * 0.14;
      curGazeY += (targetGazeY - curGazeY) * 0.14;

      leftEye3D.pupilIrisGrp.position.set(curGazeX, curGazeY, 0);
      rightEye3D.pupilIrisGrp.position.set(curGazeX, curGazeY, 0);

      // --- HEAD FOLLOWS POINTER SMOOTHLY ---
      const targetHeadY = pointerNormX * 0.38;
      const targetHeadX = -pointerNormY * 0.22;
      curHeadRotY += (targetHeadY - curHeadRotY) * 0.08;
      curHeadRotX += (targetHeadX - curHeadRotX) * 0.08;

      // --- 3D Light Eyes Dynamics ---
      const isHappy = act === 'wave' || act === 'welcome' || act === 'success' || act === 'celebrate';
      const isErr = act === 'error';
      const isThink = act === 'thinking' || act === 'processing' || act === 'neural_network';

      // Toggle Eye Expression States
      leftEye3D.happyArc.visible = isHappy;
      rightEye3D.happyArc.visible = isHappy;
      leftEye3D.errCrossGrp.visible = isErr;
      rightEye3D.errCrossGrp.visible = isErr;

      const showNormalIris = !isHappy && !isErr;
      leftEye3D.outerRing.visible = showNormalIris;
      rightEye3D.outerRing.visible = showNormalIris;
      leftEye3D.midRing.visible = showNormalIris;
      rightEye3D.midRing.visible = showNormalIris;
      leftEye3D.innerRing.visible = showNormalIris;
      rightEye3D.innerRing.visible = showNormalIris;
      leftEye3D.pupilDot.visible = showNormalIris;
      rightEye3D.pupilDot.visible = showNormalIris;

      // Concentric Light Ring Rotations for 3D Optical Parallax Depth
      leftEye3D.outerRing.rotation.z = t * 1.5;
      rightEye3D.outerRing.rotation.z = -t * 1.5;
      leftEye3D.midRing.rotation.z = -t * 2.2;
      rightEye3D.midRing.rotation.z = t * 2.2;

      // Central Pupil Light Pulse
      const pScale = 1 + Math.sin(t * 4.5) * 0.15;
      leftEye3D.pupilDot.scale.setScalar(pScale);
      rightEye3D.pupilDot.scale.setScalar(pScale);

      // Orbiting Neural Light Particles inside the 3D Eyes
      const pSpeed = isThink ? 6.5 : 1.8;
      for (let p = 0; p < 6; p++) {
        const ang = t * pSpeed + (p * Math.PI * 2) / 6;
        const rad = 0.020;
        const pL = eyeLightParticles[p];
        if (pL) {
          pL.position.set(Math.cos(ang) * rad, Math.sin(ang) * rad, 0.008);
          pL.visible = showNormalIris;
        }
        const pR = eyeLightParticles[p + 6];
        if (pR) {
          pR.position.set(Math.cos(-ang) * rad, Math.sin(-ang) * rad, 0.008);
          pR.visible = showNormalIris;
        }
      }

      // --- 3D Light Eyebrows Dynamics (Natural Horizontal Arches) ---
      if (act === 'thinking') {
        lEyebrowLight.rotation.z = Math.PI * 0.18;
        rEyebrowLight.rotation.z = Math.PI * 0.30;
        lEyebrowLight.position.y = 0.236;
        rEyebrowLight.position.y = 0.226;
      } else if (act === 'listening') {
        lEyebrowLight.rotation.z = Math.PI * 0.24;
        rEyebrowLight.rotation.z = Math.PI * 0.24;
        lEyebrowLight.position.y = 0.235;
        rEyebrowLight.position.y = 0.235;
      } else if (act === 'error') {
        lEyebrowLight.rotation.z = Math.PI * 0.36;
        rEyebrowLight.rotation.z = Math.PI * 0.12;
      } else {
        lEyebrowLight.rotation.z = Math.PI * 0.24;
        rEyebrowLight.rotation.z = Math.PI * 0.24;
        lEyebrowLight.position.y = 0.230;
        rEyebrowLight.position.y = 0.230;
      }

      // --- 3D Light Mouth (Light Smile Arc & Voice Equalizer) ---
      const isSpeaking = act === 'wave' || act === 'welcome' || act === 'explaining' || act === 'show_projects' || act === 'show_events' || act === 'success';
      mouthSmileArc.visible = !isSpeaking;
      mouthSmileCore.visible = !isSpeaking;

      mouthBars.forEach((bar, idx) => {
        bar.visible = isSpeaking;
        if (isSpeaking) {
          const wave = Math.abs(Math.sin(t * 18 + idx * 0.9) * Math.cos(t * 12 + idx * 0.5));
          bar.scale.y = 1 + wave * 4.2;
        }
      });

      // --- Forehead Holographic Brain Icon Dynamics ---
      brainIcon.rotation.y = t * 1.6;
      brainIcon.rotation.x = t * 0.9;
      const bScale = isThink ? 1.25 + Math.sin(t * 8) * 0.15 : 1.0;
      foreheadBadgeGrp.scale.setScalar(bScale);

      // --- Breathing & subtle organic motion ---
      const breath = Math.sin(t * 2.2) * 0.012;
      torsoGrp.position.y = 1.05 + breath;

      // Ceiling Halo gentle float & pulse
      ceilingHalo.rotation.z = t * 0.3;
      ceilingHaloInner.rotation.z = -t * 0.25;

      // Core Reactor concentric rotation
      coreCenter.scale.setScalar(1 + Math.sin(t * 4.5) * 0.14);
      coreRing1.rotation.z = t * 2.2;
      coreRing2.rotation.z = -t * 1.6;
      coreRing3.rotation.z = t * 1.1;

      // Floor rings
      fr1.rotation.z = t * 0.12;
      fr2.rotation.z = -t * 0.08;
      fr3.rotation.z = t * 0.06;

      // Tablet scan line & chart pulse
      tabletScan.position.y = -0.1 + Math.sin(t * 3.2) * 0.12;
      chartBars.forEach((bar, idx) => {
        bar.scale.y = 1 + Math.sin(t * 4 + idx * 0.8) * 0.3;
      });

      // Smooth Orbit Lerping
      if (act !== 'turn_around') {
        robotRoot.rotation.y += (targetRotY - robotRoot.rotation.y) * 0.08;
      }
      robotRoot.rotation.x += (targetRotX - robotRoot.rotation.x) * 0.08;

      // Dynamic Camera Vertical Frustum Tracking (Guarantees zero head cropping during jumps)
      camera.position.y += (1.25 + robotRoot.position.y * 0.35 - camera.position.y) * 0.1;
      camera.lookAt(0, 1.05 + robotRoot.position.y * 0.45, 0);

      // Action State Machine & Custom Motion Kinematics
      if (act === 'dancing') {
        // 🕺 Rhythmic AI Groove Dance
        torsoGrp.rotation.z = Math.sin(t * 7.5) * 0.16;
        torsoGrp.rotation.y = Math.cos(t * 3.75) * 0.18;
        torsoGrp.position.x = Math.sin(t * 7.5) * 0.04;
        torsoGrp.position.y = 1.05 + Math.abs(Math.sin(t * 7.5)) * 0.04;
        headGrp.rotation.set(Math.sin(t * 15) * 0.08, Math.cos(t * 7.5) * 0.16, -Math.sin(t * 7.5) * 0.12);
        rShoulder.rotation.set(-0.3 + Math.sin(t * 7.5) * 0.5, 0, 1.8 + Math.cos(t * 7.5) * 0.35);
        lShoulder.rotation.set(-0.3 - Math.sin(t * 7.5) * 0.5, 0, -1.8 - Math.cos(t * 7.5) * 0.35);
        rElbow.rotation.set(-0.5 + Math.sin(t * 7.5) * 0.4, 0, 0);
        lElbow.rotation.set(-0.5 - Math.sin(t * 7.5) * 0.4, 0, 0);
        coreRing1.rotation.z = t * 10;
        coreRing2.rotation.z = -t * 8;
        leftEye3D.happyArc.visible = true;
        rightEye3D.happyArc.visible = true;
        leftEar.podRing.scale.setScalar(1 + Math.sin(t * 15) * 0.3);
        rightEar.podRing.scale.setScalar(1 + Math.sin(t * 15) * 0.3);

      } else if (act === 'running') {
        // 🏃 High-Velocity Cyber Sprint
        torsoGrp.rotation.x = 0.32;
        torsoGrp.rotation.z = Math.sin(t * 16) * 0.04;
        torsoGrp.position.y = 1.05 + Math.abs(Math.sin(t * 16)) * 0.05;
        headGrp.rotation.set(curHeadRotX - 0.2, curHeadRotY, 0);
        rShoulder.rotation.set(Math.sin(t * 16) * 1.15 - 0.2, 0, 0.25);
        lShoulder.rotation.set(-Math.sin(t * 16) * 1.15 - 0.2, 0, -0.25);
        rElbow.rotation.set(-1.1, 0, 0);
        lElbow.rotation.set(-1.1, 0, 0);
        coreRing1.rotation.z = t * 12;
        grid.position.z = (t * 4) % 1;

      } else if (act === 'angry') {
        // 😡 Crimson Overdrive Protocol
        const shakeX = (Math.random() - 0.5) * 0.012;
        const shakeY = (Math.random() - 0.5) * 0.012;
        torsoGrp.position.x = shakeX;
        torsoGrp.position.y = 1.05 + shakeY;
        headGrp.rotation.set(curHeadRotX + 0.16, curHeadRotY, (Math.random() - 0.5) * 0.03);
        rShoulder.rotation.set(-0.45, 0, 0.7);
        lShoulder.rotation.set(-0.45, 0, -0.7);
        rElbow.rotation.set(-0.6, 0, -0.2);
        lElbow.rotation.set(-0.6, 0, 0.2);
        lEyebrowLight.rotation.z = Math.PI * 0.42;
        rEyebrowLight.rotation.z = 0.06;
        lEyebrowLight.position.y = 0.218;
        rEyebrowLight.position.y = 0.218;
        leftEye3D.errCrossGrp.visible = true;
        rightEye3D.errCrossGrp.visible = true;
        laserMat.opacity = 0.6 + Math.sin(t * 22) * 0.3;
        coreRing1.rotation.z = t * 14;
        coreRing2.rotation.z = -t * 12;

      } else if (act === 'sleep') {
        // 😴 Low-Power Regenerative Standby
        torsoGrp.position.y = 1.05 + Math.sin(t * 1.2) * 0.006;
        headGrp.rotation.set(0.34, 0, 0.04);
        rShoulder.rotation.set(-0.06, 0, 0.16);
        lShoulder.rotation.set(-0.06, 0, -0.16);
        rElbow.rotation.set(-0.1, 0, 0);
        lElbow.rotation.set(-0.1, 0, 0);
        leftEye3D.outerRing.visible = false;
        rightEye3D.outerRing.visible = false;
        leftEye3D.midRing.visible = false;
        rightEye3D.midRing.visible = false;
        leftEye3D.pupilDot.scale.setScalar(0.18);
        rightEye3D.pupilDot.scale.setScalar(0.18);
        lEyebrowLight.position.y = 0.222;
        rEyebrowLight.position.y = 0.222;
        coreRing1.rotation.z = t * 0.5;

      } else if (act === 'combat') {
        // 🥋 6-DoF Multi-Stage Martial Arts Fight Routine (Extended 10s Sequence)
        const cPeriod = 10.0;
        const cTime = elapsed % cPeriod;

        if (cTime < 2.2) {
          // 1. FIGHT MODE ON: Low Boxing/Karate Guard Stance & Combat Stance
          torsoGrp.rotation.y = 0.48;
          torsoGrp.rotation.z = -0.05;
          torsoGrp.position.y = 1.02;
          torsoGrp.position.x = 0;
          headGrp.rotation.set(curHeadRotX + 0.04, curHeadRotY - 0.42, 0.06);
          
          // Left Lead Guard Fist
          lShoulder.rotation.set(-0.95, -0.3, -0.45);
          lElbow.rotation.set(-1.45, 0, 0.3);
          
          // Right Power Guard Fist by cheek
          rShoulder.rotation.set(-0.85, 0.4, 0.45);
          rElbow.rotation.set(-1.65, 0, -0.3);

          lEyebrowLight.rotation.z = Math.PI * 0.38;
          rEyebrowLight.rotation.z = 0.08;
          coreRing1.rotation.z = t * 16;
          coreRing2.rotation.z = -t * 14;

        } else if (cTime < 4.5) {
          // 2. STRIKE 1: Explosive Left Lead Jab Punch Combo!
          const jabProgress = Math.sin(((cTime - 2.2) / 2.3) * Math.PI);
          torsoGrp.rotation.y = 0.48 - jabProgress * 0.35;
          torsoGrp.position.x = -0.04 * jabProgress;
          torsoGrp.position.y = 1.03;
          headGrp.rotation.set(curHeadRotX, curHeadRotY - 0.2, 0);

          // Left fist drives forward
          lShoulder.rotation.set(-1.55 * jabProgress - 0.95 * (1 - jabProgress), 0.15 * jabProgress, -0.1 * jabProgress - 0.45 * (1 - jabProgress));
          lElbow.rotation.set(-0.1 * jabProgress - 1.45 * (1 - jabProgress), 0, 0.3 * (1 - jabProgress));

          // Right arm remains tucked in defense
          rShoulder.rotation.set(-0.85, 0.4, 0.45);
          rElbow.rotation.set(-1.65, 0, -0.3);

          laserMat.opacity = jabProgress * 0.5;
          leftEar.podRing.scale.setScalar(1 + jabProgress * 0.35);

        } else if (cTime < 7.0) {
          // 3. STRIKE 2: Heavy Cyber Cross Power Punch!
          const crossProgress = Math.sin(((cTime - 4.5) / 2.5) * Math.PI);
          torsoGrp.rotation.y = 0.2 - crossProgress * 0.55;
          torsoGrp.position.x = 0.04 * crossProgress;
          torsoGrp.position.y = 1.03;
          headGrp.rotation.set(curHeadRotX, curHeadRotY + 0.15, 0);

          // Left arm returns to tight guard
          lShoulder.rotation.set(-0.95, -0.3, -0.45);
          lElbow.rotation.set(-1.45, 0, 0.3);

          // Right power cross launches full extension
          rShoulder.rotation.set(-1.55 * crossProgress - 0.85 * (1 - crossProgress), -0.15 * crossProgress, 0.1 * crossProgress + 0.45 * (1 - crossProgress));
          rElbow.rotation.set(-0.08 * crossProgress - 1.65 * (1 - crossProgress), 0, -0.3 * (1 - crossProgress));

          laserMat.opacity = crossProgress * 0.7;
          rightEar.podRing.scale.setScalar(1 + crossProgress * 0.35);
          coreRing1.rotation.z = t * 22;

        } else if (cTime < 8.8) {
          // 4. HIGH CYBER BLOCK & DEFENSE STANCE
          torsoGrp.rotation.set(0, 0.1, 0);
          torsoGrp.position.set(0, 1.04, 0);
          headGrp.rotation.set(curHeadRotX + 0.08, curHeadRotY, 0);

          // Right arm high defense block
          rShoulder.rotation.set(-1.75, 0.35, 0.85);
          rElbow.rotation.set(-1.4, 0, 0);

          // Left fist chambered at hip
          lShoulder.rotation.set(-0.25, -0.3, -0.55);
          lElbow.rotation.set(-1.3, 0, 0);

          leftEar.podRing.scale.setScalar(1.2);
          rightEar.podRing.scale.setScalar(1.2);

        } else {
          // 5. MARTIAL ARTS RESPECT BOW & RETURN
          const bowProgress = ((cTime - 8.8) / 1.2);
          torsoGrp.rotation.set(0, 0, 0);
          torsoGrp.position.set(0, 1.05, 0);
          headGrp.rotation.set(Math.sin(bowProgress * Math.PI) * 0.2, 0, 0);

          rShoulder.rotation.set(-0.58, 0.05, 0.38);
          lShoulder.rotation.set(-0.48, -0.05, -0.35);
          rElbow.rotation.set(-0.32, 0, 0);
          lElbow.rotation.set(-0.35, 0, 0);
        }

      } else if (act === 'fly') {
        // 🚀 High-Energy Rocket Jump with Headroom Protection (Extended 10s Sequence)
        const jPeriod = 10.0;
        const jTime = elapsed % jPeriod;
        let jumpY = 0;

        if (jTime < 1.2) {
          // 1. Booster pre-charge crouch
          const crouchRatio = Math.sin((jTime / 1.2) * Math.PI);
          jumpY = -0.15 * crouchRatio;
          torsoGrp.rotation.x = 0.28 * crouchRatio;
          rShoulder.rotation.set(0.4 * crouchRatio, 0, 0.3);
          lShoulder.rotation.set(0.4 * crouchRatio, 0, -0.3);
          rElbow.rotation.set(-0.5 * crouchRatio, 0, 0);
          lElbow.rotation.set(-0.5 * crouchRatio, 0, 0);
          floorGlow.intensity = 10 + crouchRatio * 15;

        } else if (jTime < 3.0) {
          // 2. Heroic upward rocket thruster launch (Aerodynamic posture)
          const launchRatio = (jTime - 1.2) / 1.8;
          jumpY = Math.sin(launchRatio * Math.PI * 0.5) * 0.45;
          torsoGrp.rotation.x = -0.2;
          
          // Arms swept back as aerodynamic thrusters
          rShoulder.rotation.set(0.55, 0, 0.35);
          lShoulder.rotation.set(0.55, 0, -0.35);
          rElbow.rotation.set(-0.2, 0, 0);
          lElbow.rotation.set(-0.2, 0, 0);
          floorGlow.intensity = 28;

        } else if (jTime < 8.5) {
          // 3. Extended Balanced weightless hover & gliding
          const hoverTime = jTime - 3.0;
          jumpY = 0.45 + Math.sin(hoverTime * 3) * 0.05 - (hoverTime / 5.5) * 0.08;
          torsoGrp.rotation.x = -0.1 + Math.sin(hoverTime * 2.5) * 0.04;
          torsoGrp.rotation.z = Math.sin(hoverTime * 2) * 0.04;
          
          rShoulder.rotation.set(-0.35, 0, 0.65 + Math.sin(hoverTime * 2.5) * 0.06);
          lShoulder.rotation.set(-0.35, 0, -0.65 - Math.sin(hoverTime * 2.5) * 0.06);
          rElbow.rotation.set(-0.45, 0, 0);
          lElbow.rotation.set(-0.45, 0, 0);
          floorGlow.intensity = 16 + Math.sin(t * 8) * 4;

        } else {
          // 4. Soft controlled touchdown
          const landRatio = (jTime - 8.5) / 1.5;
          jumpY = (1 - landRatio) * 0.37;
          torsoGrp.rotation.x = 0.15 * Math.sin(landRatio * Math.PI);
          rShoulder.rotation.set(-0.55, 0, 0.45 * (1 - landRatio) + 0.42);
          lShoulder.rotation.set(-0.55, 0, -0.45 * (1 - landRatio) - 0.32);
          rElbow.rotation.set(-0.32, 0, 0);
          lElbow.rotation.set(-0.35, 0, 0);
          floorGlow.intensity = 12 * (1 - landRatio) + 4.5;
        }

        robotRoot.position.y = jumpY;
        headGrp.rotation.set(curHeadRotX - 0.08, curHeadRotY, 0);
        coreRing1.rotation.z = t * 16;
        coreRing2.rotation.z = -t * 14;

      } else if (act === 'turn_around') {
        // 🔄 360-Degree Panoramic Spin (3 Full Fluid Revolutions per 9.6s)
        const spinAngle = (elapsed / 3.2) * (Math.PI * 2);
        robotRoot.rotation.y = spinAngle;
        torsoGrp.rotation.x = Math.sin(t * 7.6) * 0.06;
        torsoGrp.rotation.z = Math.cos(t * 7.6) * 0.06;
        headGrp.rotation.set(0, Math.sin(t * 7.6) * 0.15, 0);
        rShoulder.rotation.set(-0.25, 0, 1.25 + Math.sin(t * 7.6) * 0.1);
        lShoulder.rotation.set(-0.25, 0, -1.25 - Math.sin(t * 7.6) * 0.1);
        rElbow.rotation.set(-0.3, 0, 0);
        lElbow.rotation.set(-0.3, 0, 0);
        laserMat.opacity = 0.6 + Math.sin(t * 16) * 0.2;
        coreRing1.rotation.z = t * 16;
        coreRing2.rotation.z = -t * 14;
        leftEar.podRing.scale.setScalar(1 + Math.sin(t * 16) * 0.25);
        rightEar.podRing.scale.setScalar(1 + Math.sin(t * 16) * 0.25);
        fr1.rotation.z = t * 2.5;
        fr2.rotation.z = -t * 2.5;

      } else if (act === 'matrix') {
        // 🧠 Quantum Mainframe Overclock
        torsoGrp.position.y = 1.05 + Math.sin(t * 6) * 0.008;
        headGrp.rotation.set(curHeadRotX + Math.sin(t * 10) * 0.08, curHeadRotY + Math.cos(t * 12) * 0.12, 0);
        rShoulder.rotation.set(-0.6, 0, 0.5);
        lShoulder.rotation.set(-0.6, 0, -0.5);
        rElbow.rotation.set(-0.3, 0, 0);
        lElbow.rotation.set(-0.3, 0, 0);
        coreRing1.rotation.z = t * 16;
        coreRing2.rotation.z = -t * 14;
        coreRing3.rotation.z = t * 12;
        foreheadBadgeGrp.scale.setScalar(1.35 + Math.sin(t * 16) * 0.2);
        laserMat.opacity = 0.5 + Math.sin(t * 18) * 0.3;

      } else if (act === 'wave' || act === 'welcome') {
        rShoulder.rotation.set(-0.3, 0, 2.35 + Math.sin(t * 12) * 0.38);
        rElbow.rotation.set(-0.2, 0, -0.35);
        lShoulder.rotation.set(-0.48, 0, -0.32);
        lElbow.rotation.set(-0.35, 0, 0);
        headGrp.rotation.set(curHeadRotX, curHeadRotY + Math.sin(t * 3.5) * 0.15, -0.06);
        leftEar.podRing.scale.setScalar(1 + Math.sin(t * 8) * 0.2);
        rightEar.podRing.scale.setScalar(1 + Math.sin(t * 8) * 0.2);

      } else if (act === 'listening') {
        rShoulder.rotation.set(-0.5, 0, 0.2);
        rElbow.rotation.set(-0.2, 0, 0);
        lShoulder.rotation.set(-0.48, 0, -0.32);
        lElbow.rotation.set(-0.35, 0, 0);
        headGrp.rotation.set(curHeadRotX + 0.08, curHeadRotY + 0.18, 0.05);
        leftEar.podRing.scale.setScalar(1 + Math.sin(t * 10) * 0.28);
        rightEar.podRing.scale.setScalar(1 + Math.sin(t * 10) * 0.28);

      } else if (act === 'thinking') {
        rShoulder.rotation.set(-0.6, 0, 0.8);
        rElbow.rotation.set(-0.3, 0, -1.15);
        lShoulder.rotation.set(-0.48, 0, -0.32);
        lElbow.rotation.set(-0.35, 0, 0);
        headGrp.rotation.set(curHeadRotX + 0.12, curHeadRotY + 0.2, 0);
        coreRing1.rotation.z = t * 4.5;
        coreRing2.rotation.z = -t * 3.5;
        leftEar.podRing.rotation.x = t * 4;
        rightEar.podRing.rotation.x = -t * 4;

      } else if (act === 'processing') {
        rShoulder.rotation.set(-0.45, 0, 0.3);
        rElbow.rotation.set(-0.15, 0, 0);
        lShoulder.rotation.set(-0.48, 0, -0.32);
        lElbow.rotation.set(-0.35, 0, 0);
        headGrp.rotation.set(curHeadRotX, curHeadRotY + Math.sin(t * 8) * 0.08, 0);
        coreRing1.rotation.z = t * 8;
        coreRing2.rotation.z = -t * 6;
        leftEar.podRing.rotation.x = t * 6;
        rightEar.podRing.rotation.x = -t * 6;

      } else if (act === 'diagnostics') {
        rShoulder.rotation.set(-0.3, 0, 0.3);
        rElbow.rotation.set(-0.15, 0, 0);
        lShoulder.rotation.set(-0.48, 0, -0.32);
        lElbow.rotation.set(-0.35, 0, 0);
        headGrp.rotation.set(curHeadRotX + Math.cos(t * 2.5) * 0.12, curHeadRotY + Math.sin(t * 4.5) * 0.4, 0);
        laserMat.opacity = 0.45 + Math.sin(t * 14) * 0.2;

      } else if (act === 'neural_network') {
        rShoulder.rotation.set(-0.45, 0, 0.6);
        rElbow.rotation.set(-0.25, 0, -0.5);
        lShoulder.rotation.set(-0.48, 0, -0.32);
        lElbow.rotation.set(-0.35, 0, 0);
        headGrp.rotation.set(curHeadRotX - 0.12, curHeadRotY - 0.3, 0);

      } else if (act === 'computer_vision') {
        rShoulder.rotation.set(-0.5, 0, 0.3);
        rElbow.rotation.set(-0.25, 0, 0);
        lShoulder.rotation.set(-0.48, 0, -0.32);
        lElbow.rotation.set(-0.35, 0, 0);
        headGrp.rotation.set(curHeadRotX + 0.1, curHeadRotY + Math.sin(t * 6) * 0.2, 0);

      } else if (act === 'explaining' || act === 'show_projects' || act === 'show_events' || act === 'point_hologram') {
        rShoulder.rotation.set(-0.4, 0, 1.35);
        rElbow.rotation.set(0, 0, 0.1);
        lShoulder.rotation.set(-0.48, 0, -0.32);
        lElbow.rotation.set(-0.35, 0, 0);
        headGrp.rotation.set(curHeadRotX, curHeadRotY - 0.35, 0);

      } else if (act === 'success' || act === 'celebrate') {
        rShoulder.rotation.set(-0.5, 0, 1.0 + Math.sin(t * 8) * 0.15);
        rElbow.rotation.set(-0.3, 0, -0.3);
        lShoulder.rotation.set(-0.48, 0, -0.32);
        lElbow.rotation.set(-0.35, 0, 0);
        headGrp.rotation.set(curHeadRotX, curHeadRotY + Math.sin(t * 2) * 0.1, -0.05);

      } else if (act === 'error') {
        rShoulder.rotation.set(-0.3, 0, 0.6);
        rElbow.rotation.set(-0.2, 0, -0.2);
        lShoulder.rotation.set(-0.48, 0, -0.32);
        lElbow.rotation.set(-0.35, 0, 0);
        headGrp.rotation.set(curHeadRotX, curHeadRotY, Math.sin(t * 8) * 0.05);

      } else {
        // --- BASELINE IDLE RESTING POSTURE (Smooth Return to Normal) ---
        headGrp.rotation.set(curHeadRotX, curHeadRotY, 0);
        
        // Right Arm: Relaxed natural posture
        rShoulder.rotation.set(-0.68 + Math.sin(t * 1.5) * 0.02, 0.1, 0.42 + Math.cos(t * 1.2) * 0.015);
        rElbow.rotation.set(-0.32, 0, 0);

        // Left Arm: Naturally holds holographic tablet at hip
        lShoulder.rotation.set(-0.48 + Math.sin(t * 1.5) * 0.02, 0, -0.32 + Math.cos(t * 1.2) * 0.015);
        lElbow.rotation.set(-0.35, 0, 0);

        // Torso & Root baseline alignment
        torsoGrp.rotation.set(0, 0, 0);
        torsoGrp.position.x += (0 - torsoGrp.position.x) * 0.1;
        robotRoot.position.y += (0 - robotRoot.position.y) * 0.1;

        // Reset effects & auxiliary accessories
        laserMat.opacity += (0 - laserMat.opacity) * 0.1;
        floorGlow.intensity += (4.5 - floorGlow.intensity) * 0.1;
        leftEar.podRing.scale.setScalar(1.0);
        rightEar.podRing.scale.setScalar(1.0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMD);
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('mouseup', onMU);
      container.removeEventListener('touchstart', onTS);
      window.removeEventListener('touchmove', onTM);
      window.removeEventListener('touchend', onTE);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[560px] flex items-center justify-center select-none overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Futuristic Hologram Quick Controls */}
      <div className="absolute top-3 left-4 pointer-events-none z-10 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0a0a0a]/75 border border-cyan-500/30 backdrop-blur-md">
          <span className={`w-2 h-2 rounded-full animate-pulse ${
            actionState === 'angry' ? 'bg-rose-500' :
            actionState === 'dancing' ? 'bg-fuchsia-400' :
            actionState === 'running' ? 'bg-amber-400' :
            actionState === 'sleep' ? 'bg-indigo-400' :
            actionState === 'matrix' ? 'bg-emerald-400' :
            actionState === 'combat' ? 'bg-orange-400' :
            actionState === 'fly' ? 'bg-sky-400' :
            actionState === 'turn_around' ? 'bg-yellow-400' :
            'bg-cyan-400'
          }`} />
          <span className="font-mono text-[11px] font-bold tracking-wider text-cyan-300">
            NOVA AI // NEURAL OPERATING ENGINE
          </span>
        </div>
        <div className={`text-[10px] font-mono pl-1 font-bold tracking-wider ${
          actionState === 'angry' ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' :
          actionState === 'dancing' ? 'text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]' :
          actionState === 'running' ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' :
          actionState === 'sleep' ? 'text-indigo-300 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]' :
          actionState === 'matrix' ? 'text-emerald-300 drop-shadow-none' :
          actionState === 'combat' ? 'text-orange-300 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]' :
          actionState === 'fly' ? 'text-sky-300 drop-shadow-none' :
          actionState === 'turn_around' ? 'text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]' :
          'text-cyan-400/90'
        }`}>
          MODE: {actionState === 'turn_around' ? '360° SPIN' : actionState.toUpperCase()}
        </div>
      </div>

      {/* Holographic Domain Status Tags */}
      <div className="absolute bottom-4 left-4 pointer-events-none hidden md:flex flex-col gap-1 z-10">
        <div className="text-[9px] font-mono text-cyan-400/70 tracking-wider">
          ACTIVE LAB SUBSYSTEMS:
        </div>
        <div className="flex flex-wrap gap-1.5 max-w-xs">
          {['NEURAL NETWORKS', 'COMPUTER VISION', 'ROBOTICS KINEMATICS', 'GENERATIVE AI'].map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300/80 border border-cyan-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* HUD Orbit Buttons */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
        {[
          { key: 'computer-vision', label: 'CV PERCEPTION', pos: 'top-[20%] right-[2%] sm:right-[6%]', color: 'border-cyan-400 text-cyan-300' },
          { key: 'generative-ai', label: 'GEN AI CORE', pos: 'top-[34%] right-[2%] sm:right-[6%]', color: 'border-teal-400 text-teal-300' },
          { key: 'robotics', label: '6-DoF KINEMATICS', pos: 'bottom-[28%] right-[2%] sm:right-[6%]', color: 'border-rose-400 text-rose-300' },
          { key: 'deep-learning', label: 'NEURAL WEIGHTS', pos: 'bottom-[14%] right-[2%] sm:right-[6%]', color: 'border-violet-400 text-violet-300' },
        ].map(item => (
          <button
            key={item.key}
            type="button"
            onClick={(e) => { e.preventDefault(); onSelectHologram?.(item.key); }}
            className={`absolute pointer-events-auto ${item.pos} px-3 py-1.5 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-md border ${item.color} shadow-none hover:shadow-none font-mono text-[10px] sm:text-xs font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Orbit & Drag hint */}
      <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] font-mono text-cyan-400/60 bg-slate-900/50 px-2 py-0.5 rounded border border-cyan-500/15 z-10">
        ⇄ DRAG TO ROTATE 3D
      </div>
    </div>
  );
}
