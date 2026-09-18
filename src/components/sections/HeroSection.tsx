'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, Sparkles, ChevronDown, Cpu, ArrowRight, Activity, Terminal } from 'lucide-react';
import HeroNeuralCore from '@/components/3d/HeroNeuralCore';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function HeroSection() {
  const { settings } = useCMSData();

  const playHover = () => soundFx.playHover();
  const playClick = () => soundFx.playClick();

  return (
    <section className="relative min-h-screen pt-28 sm:pt-36 pb-20 flex flex-col justify-between overflow-hidden bg-transparent">
      {/* Ambient Cyber Background Lighting */}
      <div className="absolute inset-0 cyber-grid-bg opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-br from-cyan-500/15 via-indigo-600/10 to-violet-600/15 blur-[140px] pointer-events-none" />

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Futuristic Telemetry Chip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1020]/90 border border-cyan-500/30 text-[11px] sm:text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(0,207,255,0.2)]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NEURAL CORE V4.2 ACTIVE</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">UNIVERSITY AI RESEARCH LAB</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
          >
            BUILD THE <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent text-glow-cyan">
              INTELLIGENCE
            </span>
            <br />
            OF TOMORROW
          </motion.h1>

          {/* Secondary Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed mx-auto lg:mx-0 font-sans"
          >
            {settings.heroSubheadline || 'Explore Artificial Intelligence, Machine Learning, Robotics, Computer Vision and Generative AI in an immersive student-led research laboratory.'}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
          >
            {/* Primary AI Lab CTA */}
            <Link
              href="/ai-lab"
              onClick={playClick}
              onMouseEnter={playHover}
              className="w-full sm:w-auto relative group overflow-hidden px-7 py-3.5 rounded-2xl font-mono text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-[0_0_25px_rgba(0,207,255,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
            >
              <Bot className="w-4 h-4 text-cyan-200 animate-bounce" />
              <span>EXPLORE AI LAB</span>
              <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary Join CTA */}
            <Link
              href="/join"
              onClick={playClick}
              onMouseEnter={playHover}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-mono text-sm font-semibold text-slate-200 bg-[#0B1020]/80 hover:bg-slate-800/80 border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>JOIN THE CLUB</span>
            </Link>
          </motion.div>

          {/* Real-time Telemetry Metrics Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-6 grid grid-cols-3 gap-3 sm:gap-6 border-t border-cyan-500/15 font-mono text-center sm:text-left max-w-md mx-auto lg:mx-0"
          >
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-cyan-300">
                {settings.stats.members}+
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Student Innovators
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-violet-300">
                {settings.stats.projects}+
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Active Projects
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-300">
                {settings.stats.publications}+
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Peer Papers
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive 3D AI Neural Core */}
        <div className="lg:col-span-5 relative h-[480px] sm:h-[580px] flex items-center justify-center">
          <HeroNeuralCore />
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-center gap-1 text-[11px] font-mono text-cyan-400/80 pt-8"
      >
        <span>SCROLL TO EXPLORE</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
