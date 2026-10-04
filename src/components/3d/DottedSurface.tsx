'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = {
  className?: string;
  size?: number;
  opacity?: number;
  amountX?: number;
  amountY?: number;
  separation?: number;
  speed?: number;
};

const COLOR_CYAN = new THREE.Color('#00CFFF');
const COLOR_INDIGO = new THREE.Color('#6366F1');
const COLOR_VIOLET = new THREE.Color('#A855F7');
const BACKGROUND = 0x050816;

function createDotTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.45, 'rgba(255,255,255,0.9)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

export default function DottedSurface({
  className = '',
  size = 9,
  opacity = 0.85,
  amountX = 40,
  amountY = 60,
  separation = 150,
  speed = 0.06,
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(BACKGROUND, 1800, 7000);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(BACKGROUND, 0);
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const positions = new Float32Array(amountX * amountY * 3);
    const colors = new Float32Array(amountX * amountY * 3);
    const tmp = new THREE.Color();
    let i = 0;
    for (let ix = 0; ix < amountX; ix++) {
      const t = ix / (amountX - 1);
      if (t < 0.5) tmp.copy(COLOR_CYAN).lerp(COLOR_INDIGO, t * 2);
      else tmp.copy(COLOR_INDIGO).lerp(COLOR_VIOLET, (t - 0.5) * 2);
      for (let iy = 0; iy < amountY; iy++) {
        positions[i * 3] = ix * separation - (amountX * separation) / 2;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = iy * separation - (amountY * separation) / 2;
        colors[i * 3] = tmp.r;
        colors[i * 3 + 1] = tmp.g;
        colors[i * 3 + 2] = tmp.b;
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const texture = createDotTexture();
    const material = new THREE.PointsMaterial({
      size,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let frameId = 0;
    let visible = true;

    const updateWave = () => {
      const arr = geometry.attributes.position.array as Float32Array;
      let j = 0;
      for (let ix = 0; ix < amountX; ix++) {
        for (let iy = 0; iy < amountY; iy++) {
          arr[j * 3 + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
          j++;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!visible) return;
      updateWave();
      count += speed;
      frameId = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frameId);
      if (prefersReducedMotion) updateWave();
      else frameId = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible) start();
      else cancelAnimationFrame(frameId);
    });
    observer.observe(container);

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) start();
      else cancelAnimationFrame(frameId);
    };
    document.addEventListener('visibilitychange', onVisibility);

    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (prefersReducedMotion) updateWave();
    });
    resizeObserver.observe(container);

    start();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, [size, opacity, amountX, amountY, separation, speed]);

  return <div ref={containerRef} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
