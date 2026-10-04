'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  BrainCircuit, 
  Layers, 
  Sparkles, 
  Scan, 
  MessageSquareCode, 
  Bot, 
  BarChart3, 
  Gamepad2, 
  Workflow, 
  ArrowRight, 
  X, 
  CheckCircle2 
} from 'lucide-react';
import { AIDomain } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

const ICON_MAP: Record<string, React.ElementType> = {
  Cpu,
  BrainCircuit,
  Layers,
  Sparkles,
  Scan,
  MessageSquareCode,
  Bot,
  BarChart3,
  Gamepad2,
  Workflow
};

export default function DomainsSection() {
  const { domains } = useCMSData();
  const [selectedDomain, setSelectedDomain] = useState<AIDomain | null>(null);

  const handleOpenDomain = (domain: AIDomain) => {
    soundFx.playHologram();
    setSelectedDomain(domain);
  };

  return (
    <section id="domains" className="relative py-24 sm:py-32 bg-transparent overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              <Cpu className="w-3.5 h-3.5" />
              <span>SPECIALIZED RESEARCH LABS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              AI DOMAINS &{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent">
                DISCIPLINES
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-sans max-w-xl">
              10 specialized disciplines where student researchers design, train, and deploy foundational machine intelligence models.
            </p>
          </div>

          <Link
            href="/projects"
            onClick={() => soundFx.playClick()}
            className="self-start md:self-auto inline-flex items-center gap-2 font-mono text-xs text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <span>Explore Domain Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 10 Domains 3D Glass Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {domains.map((domain, idx) => {
            const IconComponent = ICON_MAP[domain.iconName] || Cpu;
            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div
                  onClick={() => handleOpenDomain(domain)}
                  onMouseEnter={() => soundFx.playHover()}
                  className="h-full group cursor-pointer p-5 rounded-2xl bg-[#0a0a0a]/75 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-none transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
                >
                  <div>
                    {/* Icon & Active Count */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-none"
                        style={{ backgroundColor: `${domain.color}20`, border: `1px solid ${domain.color}50` }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: domain.color }} />
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded-full border border-cyan-800/40">
                        {domain.activeProjectsCount} Projects
                      </span>
                    </div>

                    <h3 className="font-mono font-bold text-base text-white group-hover:text-cyan-300 transition-colors mb-2">
                      {domain.name}
                    </h3>

                    <p className="text-xs text-slate-300 font-sans line-clamp-3 mb-4 leading-relaxed">
                      {domain.shortDesc}
                    </p>
                  </div>

                  <div>
                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                      {domain.technologies.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {t}
                        </span>
                      ))}
                      {domain.technologies.length > 2 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 text-cyan-400">
                          +{domain.technologies.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Holographic Domain Modal Drawer */}
        <AnimatePresence>
          {selectedDomain && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pt-24 sm:pt-28 pb-8 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedDomain(null)}
                className="fixed inset-0 bg-black/90 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-2xl max-h-[85vh] my-auto bg-[#0a0a0a] border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 shadow-none z-10 font-mono text-xs overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${selectedDomain.color}25`, border: `1px solid ${selectedDomain.color}` }}
                    >
                      {React.createElement(ICON_MAP[selectedDomain.iconName] || Cpu, {
                        className: 'w-5 h-5',
                        style: { color: selectedDomain.color }
                      })}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                        {selectedDomain.name}
                      </h3>
                      <span className="text-[10px] text-cyan-400">
                        {selectedDomain.activeProjectsCount} ACTIVE LAB PROJECTS
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDomain(null)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-cyan-400 font-bold mb-2">
                      &gt; LAB SYNOPSIS & OBJECTIVES
                    </h4>
                    <p className="text-slate-300 text-sm font-sans leading-relaxed">
                      {selectedDomain.fullDesc}
                    </p>
                  </div>

                  {/* Research Focus */}
                  <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">
                      CURRENT RESEARCH HORIZON
                    </span>
                    <p className="text-slate-200 text-xs font-mono">
                      {selectedDomain.researchFocus}
                    </p>
                  </div>

                  {/* Technologies & Frameworks */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-cyan-400 font-bold mb-2">
                      &gt; CORE TECHNOLOGY STACK
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDomain.technologies.map(tech => (
                        <span key={tech} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Theoretical Concepts */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-cyan-400 font-bold mb-2">
                      &gt; KEY THEORETICAL CONCEPTS
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedDomain.keyConcepts.map(c => (
                        <div key={c} className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between">
                    <Link
                      href={`/projects?domain=${selectedDomain.id}`}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedDomain(null);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors"
                    >
                      <span>Explore Domain Projects</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setSelectedDomain(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
