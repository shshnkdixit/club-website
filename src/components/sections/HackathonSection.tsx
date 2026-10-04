'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Terminal, 
  Sparkles, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

export default function HackathonSection() {
  const [activeStage, setActiveStage] = useState(2);

  const stages = [
    { name: 'IDEA', time: '00:00 - 04:00', desc: 'Problem definition, literature review, and architecture mapping.' },
    { name: 'PROTOTYPE', time: '04:00 - 12:00', desc: 'Baseline models, synthetic dataset generation, and initial training loss curves.' },
    { name: 'BUILD', time: '12:00 - 24:00', desc: 'Core pipeline engineering, ROS2 kinematic integration, and GPU acceleration.' },
    { name: 'TEST', time: '24:00 - 32:00', desc: 'Robustness validation, adversarial stress tests, and latency benchmarking.' },
    { name: 'DEMO', time: '32:00 - 36:00', desc: 'Live telemetric pitch to panel of 12 industry research directors.' },
  ];

  const tracks = [
    { title: 'Autonomous Robotics & Edge Vision', prize: '$5,000', icon: Cpu, desc: 'Real-time navigation in GPS-denied environments using NVIDIA Jetson boards.' },
    { title: 'Agentic Workflows & Consensus', prize: '$4,000', icon: Zap, desc: 'Multi-agent self-correcting swarms executing complex asynchronous workflows.' },
    { title: 'Generative Synthesis & Diffusion', prize: '$3,500', icon: Sparkles, desc: 'Sub-second text-to-3D geometry and molecular ligand synthesis.' },
    { title: 'AI Ethics & Verifiable Safety', prize: '$2,500', icon: ShieldCheck, desc: 'Mechanistic interpretability and zero-hallucination graph verification.' },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-transparent overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-rose-600/10 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Arena Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/35 text-xs font-mono text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>FLAGSHIP 36-HOUR CHALLENGE</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-mono">
            BUILD. BREAK.{' '}
            <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
              REBUILD.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-sans leading-relaxed">
            HACK.AI 2026 is our premier 36-hour continuous build challenge. 300+ university engineers, free cloud GPU clusters, hardware testbeds, and $15,000+ in prize funding.
          </p>
        </div>

        {/* 5-Stage Animated Progress Pipeline */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0a0a]/90 border border-cyan-500/30 mb-14 shadow-[0_0_35px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6 font-mono text-xs">
            <span className="text-cyan-400 font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4" /> 36-HOUR SPRINT PIPELINE
            </span>
            <span className="text-slate-400">STAGE 0{activeStage + 1} OF 05</span>
          </div>

          {/* Stepper Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
            {stages.map((stg, idx) => {
              const isSelected = activeStage === idx;
              return (
                <button
                  key={stg.name}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveStage(idx);
                  }}
                  onMouseEnter={() => soundFx.playHover()}
                  className={`p-3.5 rounded-2xl border font-mono text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-rose-500/20 to-cyan-500/20 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>PHASE 0{idx + 1}</span>
                    <span>{stg.time}</span>
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-100">{stg.name}</h4>
                  {isSelected && (
                    <motion.div
                      layoutId="hackathonActiveIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-cyan-400"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Stage Details */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-rose-400 font-bold">
                [PHASE 0{activeStage + 1}: {stages[activeStage].name}]
              </span>
              <p className="text-slate-300 text-sm font-sans">
                {stages[activeStage].desc}
              </p>
            </div>
            <div className="shrink-0 text-cyan-400 font-bold bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/50">
              TIME WINDOW: {stages[activeStage].time}
            </div>
          </div>
        </div>

        {/* Tracks & Prize Pool Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tracks.map((t, idx) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-3xl bg-[#0a0a0a]/75 backdrop-blur-md border border-cyan-500/20 hover:border-rose-500/50 shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.2)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono font-extrabold text-sm text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      {t.prize}
                    </span>
                  </div>

                  <h3 className="font-mono font-bold text-base text-white mb-2 leading-snug">
                    {t.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between font-mono text-[11px] text-slate-400">
                  <span>Hardware & GPU Included</span>
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Registration Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-violet-950/50 border border-cyan-500/40 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            READY TO COMPETE IN HACK.AI 2026?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-xl mx-auto">
            Teams of 2–4 undergraduate or postgraduate students. Free meals, sleeping pods, GPU compute, and mentor support provided.
          </p>
          <div className="pt-2">
            <Link
              href="/join"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-mono text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-500 hover:from-rose-400 hover:to-cyan-400 shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Register Hackathon Team</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
