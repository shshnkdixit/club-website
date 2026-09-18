'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'interact' | 'text'>('default');
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if touch device or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactable3D = target.closest('[data-cursor="interact"]') || target.closest('canvas');
      const clickable = target.closest('button, a, input, textarea, select, [role="button"]');
      const textElement = target.closest('p, h1, h2, h3, h4, h5, h6, span');

      if (interactable3D) {
        setCursorVariant('interact');
        setCursorText('INTERACT');
      } else if (clickable) {
        setCursorVariant('hover');
        setCursorText('');
      } else if (textElement && target.tagName === 'INPUT') {
        setCursorVariant('text');
        setCursorText('');
      } else {
        setCursorVariant('default');
        setCursorText('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Small Glowing Center Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-cyan-400 mix-blend-screen"
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          width: 6,
          height: 6,
          boxShadow: '0 0 10px #00CFFF, 0 0 20px #00CFFF'
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 600, mass: 0.1 }}
      />

      {/* Outer Follower Ring / Holographic Tag */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full flex items-center justify-center border border-cyan-400/50 backdrop-blur-[1px]"
        animate={{
          x: mousePosition.x - (cursorVariant === 'interact' ? 36 : cursorVariant === 'hover' ? 24 : 16),
          y: mousePosition.y - (cursorVariant === 'interact' ? 36 : cursorVariant === 'hover' ? 24 : 16),
          width: cursorVariant === 'interact' ? 72 : cursorVariant === 'hover' ? 48 : 32,
          height: cursorVariant === 'interact' ? 72 : cursorVariant === 'hover' ? 48 : 32,
          borderColor: cursorVariant === 'interact' ? '#9B5CFF' : cursorVariant === 'hover' ? '#00F5D4' : 'rgba(0, 207, 255, 0.4)',
          backgroundColor: cursorVariant === 'interact' ? 'rgba(155, 92, 255, 0.15)' : cursorVariant === 'hover' ? 'rgba(0, 245, 212, 0.08)' : 'rgba(0, 0, 0, 0)',
          boxShadow: cursorVariant === 'interact' ? '0 0 20px rgba(155, 92, 255, 0.4)' : '0 0 8px rgba(0, 207, 255, 0.2)'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.2 }}
      >
        {cursorText && (
          <span className="text-[9px] font-mono font-bold tracking-widest text-violet-200 uppercase">
            {cursorText}
          </span>
        )}
      </motion.div>
    </>
  );
}
