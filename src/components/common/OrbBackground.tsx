'use client';

import React from 'react';
import Orb from './Orb';

export default function OrbBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Primary Top/Center Glowing React Bits Orb */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] max-w-[140vw] max-h-[140vw] shrink-0 opacity-90">
        <Orb
          hue={0}
          hoverIntensity={0.5}
          rotateOnHover
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </div>

      {/* Lower Page Atmosphere Orb */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] max-w-[120vw] max-h-[120vw] shrink-0 opacity-70">
        <Orb
          hue={45}
          hoverIntensity={0.4}
          rotateOnHover
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </div>

      {/* Cyber Grid overlay */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
    </div>
  );
}
