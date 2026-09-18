'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFx } from '@/lib/soundFx';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  const statuses = [
    'INITIALIZING AI CORE...',
    'CONNECTING NEURAL SYNAPSES...',
    'CALIBRATING 6-DoF ROBOTICS...',
    'SYSTEM ONLINE // LAB READY'
  ];

  useEffect(() => {
    // Check if preloader was already displayed in this session
    const hasLoaded = sessionStorage.getItem('aiml_preloaded');
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    const t1 = setTimeout(() => {
      setPhase(1);
    }, 400);

    const t2 = setTimeout(() => {
      setPhase(2);
    }, 800);

    const t3 = setTimeout(() => {
      setPhase(3);
      soundFx.playNeuralChime();
    }, 1200);

    const t4 = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('aiml_preloaded', 'true');
    }, 1600);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] bg-[#050816] flex flex-col items-center justify-center p-6 overflow-hidden select-none"
        >
          {/* Cyber Background Grid */}
          <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

          {/* Radial Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

          {/* Central Neural Node Cluster SVG */}
          <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer pulsing ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#00CFFF"
                strokeWidth="0.5"
                strokeDasharray="4 4"
                className="animate-[spin_10s_linear_infinite]"
                opacity="0.4"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#6C63FF"
                strokeWidth="1"
                strokeDasharray="8 6"
                className="animate-[spin_6s_linear_infinite_reverse]"
                opacity="0.6"
              />

              {/* Connecting Synaptic Lines */}
              <motion.line
                x1="50"
                y1="50"
                x2="25"
                y2="28"
                stroke="#00CFFF"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase >= 0 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
              <motion.line
                x1="50"
                y1="50"
                x2="75"
                y2="28"
                stroke="#00F5D4"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase >= 1 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
              <motion.line
                x1="50"
                y1="50"
                x2="80"
                y2="65"
                stroke="#9B5CFF"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase >= 1 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
              <motion.line
                x1="50"
                y1="50"
                x2="50"
                y2="82"
                stroke="#6C63FF"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase >= 2 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
              <motion.line
                x1="50"
                y1="50"
                x2="20"
                y2="65"
                stroke="#00CFFF"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase >= 2 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />

              {/* Surrounding Nodes */}
              <circle cx="25" cy="28" r="3.5" fill="#00CFFF" className="animate-pulse" />
              <circle cx="75" cy="28" r="3.5" fill="#00F5D4" className="animate-pulse" />
              <circle cx="80" cy="65" r="3.5" fill="#9B5CFF" className="animate-pulse" />
              <circle cx="50" cy="82" r="3.5" fill="#6C63FF" className="animate-pulse" />
              <circle cx="20" cy="65" r="3.5" fill="#00CFFF" className="animate-pulse" />

              {/* Glowing Core Center Node */}
              <circle cx="50" cy="50" r="8" fill="#00CFFF" opacity="0.2" />
              <circle cx="50" cy="50" r="5" fill="#00CFFF" />
            </svg>
          </div>

          {/* Club Identity */}
          <div className="text-center z-10 max-w-md">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-widest text-white font-mono flex items-center justify-center gap-2 mb-2">
              <span className="text-cyan-400">&lt;</span>
              AI/ML CLUB
              <span className="text-cyan-400">/&gt;</span>
            </h1>
            <p className="text-xs tracking-wider text-slate-400 uppercase font-mono mb-6">
              Advanced Intelligence & Autonomous Systems Lab
            </p>

            {/* Futuristic Progress Bar */}
            <div className="w-64 sm:w-80 h-1.5 bg-slate-800 rounded-full overflow-hidden mx-auto mb-4 border border-cyan-500/20">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Status Telemetry */}
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400/90 px-1">
              <span className="animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {statuses[phase]}
              </span>
              <span className="text-slate-400">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
