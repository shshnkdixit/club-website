'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Flame,
  Layers,
  Code2,
  BookOpen,
  Trophy,
  Zap,
  Target,
  FileCheck,
  Calendar,
  X,
  ExternalLink,
  ShieldCheck,
  Rocket
} from 'lucide-react';
import { RoadmapMilestone, MilestoneStatus } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function RoadmapPage() {
  const { roadmap } = useCMSData();
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | MilestoneStatus>('ALL');
  const [selectedMilestone, setSelectedMilestone] = useState<RoadmapMilestone | null>(null);

  // Status Filter Options
  const statusOptions: { label: string; value: 'ALL' | MilestoneStatus; color: string }[] = [
    { label: 'ALL', value: 'ALL', color: 'border-cyan-500/40 text-cyan-300' },
    { label: 'COMPLETED', value: 'COMPLETED', color: 'border-emerald-500/50 text-emerald-300' },
    { label: 'IN PROGRESS', value: 'IN PROGRESS', color: 'border-cyan-400 text-cyan-300' },
    { label: 'UPCOMING', value: 'UPCOMING', color: 'border-amber-500/50 text-amber-300' },
  ];

  // Filtered Milestones
  const filteredMilestones = useMemo(() => {
    if (selectedStatus === 'ALL') return roadmap;
    return roadmap.filter(m => m.status === selectedStatus);
  }, [roadmap, selectedStatus]);

  // Phase Definitions & Metas
  const phases = [
    {
      phaseNumber: 1,
      name: 'Phase 1: Foundations',
      subtitle: 'Git Workflows, Python for AI, NumPy Vectorization & Core Mathematics',
      timeframe: 'Month 1 - 2',
      glow: 'from-emerald-950/60 to-emerald-900/30 border-emerald-500/40 text-emerald-300',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
      progressColor: 'bg-emerald-400'
    },
    {
      phaseNumber: 2,
      name: 'Phase 2: Build Sprint',
      subtitle: 'PyTorch Deep Learning, Computer Vision Pipelines & 48h DevFlow Hackathon',
      timeframe: 'Month 3 - 4',
      glow: 'from-cyan-950/60 to-cyan-900/30 border-cyan-500/40 text-cyan-300',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400',
      progressColor: 'bg-cyan-400'
    },
    {
      phaseNumber: 3,
      name: 'Phase 3: Advanced Tracks',
      subtitle: 'Transformer Architectures, LoRA LLM Fine-Tuning, RAG & Autonomous Multi-Agents',
      timeframe: 'Month 5 - 6',
      glow: 'from-fuchsia-950/60 to-purple-900/30 border-fuchsia-500/40 text-fuchsia-300',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50',
      progressColor: 'bg-fuchsia-400'
    },
    {
      phaseNumber: 4,
      name: 'Phase 4: Finale Showcase',
      subtitle: 'Annual Campus AI Project Expo, Industry Demo Day & Research Publications',
      timeframe: 'Month 7',
      glow: 'from-amber-950/60 to-yellow-900/30 border-amber-500/40 text-amber-300',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
      progressColor: 'bg-amber-400'
    }
  ];

  // Overall Completion Calculation
  const overallProgress = useMemo(() => {
    if (roadmap.length === 0) return 0;
    const total = roadmap.reduce((acc, m) => acc + (m.completionPercentage || 0), 0);
    return Math.round(total / roadmap.length);
  }, [roadmap]);

  const completedCount = useMemo(() => roadmap.filter(m => m.status === 'COMPLETED').length, [roadmap]);
  const inProgressCount = useMemo(() => roadmap.filter(m => m.status === 'IN PROGRESS').length, [roadmap]);
  const upcomingCount = useMemo(() => roadmap.filter(m => m.status === 'UPCOMING').length, [roadmap]);

  const handleOpenMilestone = (m: RoadmapMilestone) => {
    soundFx.playHologram();
    setSelectedMilestone(m);
  };

  const getStatusBadge = (status: MilestoneStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-[10px] font-black tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-3 h-3" /> COMPLETED
          </span>
        );
      case 'IN PROGRESS':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 text-[10px] font-black tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(0,207,255,0.4)] animate-pulse">
            <Flame className="w-3 h-3 text-cyan-400" /> IN PROGRESS
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-[10px] font-bold tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" /> UPCOMING
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[800px] h-[400px] bg-cyan-600/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-fuchsia-600/10 blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 sm:space-y-12">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-cyan-500/20 pb-6">
          <div>
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-300 transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to AI Lab Hub</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,207,255,0.3)]">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
                  CURRICULUM ROADMAP
                </h1>
                <p className="text-xs sm:text-sm text-cyan-300/80 mt-1">
                  Structured 4-phase technical trajectory guiding student builders from foundational coding to production AI & demo days.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Trajectory Progress Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 sm:w-80 shadow-[0_0_20px_rgba(0,0,0,0.5)] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400 uppercase text-[10px]">COHORT PROGRESS</span>
              <span className="text-cyan-300 font-mono text-sm">{overallProgress}% COMPLETED</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-yellow-400 transition-all duration-500 shadow-[0_0_12px_rgba(0,207,255,0.6)]"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
              <span>{completedCount} Completed</span>
              <span className="text-cyan-400">{inProgressCount} In Progress</span>
              <span>{upcomingCount} Upcoming</span>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 🔘 MILESTONE STATUS FILTERS */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/70 p-3 rounded-2xl border border-cyan-500/20">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <span className="text-[10px] text-slate-400 uppercase font-bold mr-1 shrink-0">
              STATUS FILTER:
            </span>
            {statusOptions.map((opt) => {
              const isSelected = selectedStatus === opt.value;
              const count = opt.value === 'ALL' ? roadmap.length :
                            opt.value === 'COMPLETED' ? completedCount :
                            opt.value === 'IN PROGRESS' ? inProgressCount : upcomingCount;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { soundFx.playClick(); setSelectedStatus(opt.value); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(0,207,255,0.3)]'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>[{opt.label}]</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-slate-800 text-[10px] text-slate-300">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-right text-[11px] text-slate-400">
            Showing <strong className="text-white">{filteredMilestones.length}</strong> of {roadmap.length} Milestones
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 🗺️ 4-PHASE STRUCTURED TRAJECTORY */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="space-y-12">
          {phases.map((phase) => {
            const phaseMilestones = filteredMilestones.filter(m => m.phaseNumber === phase.phaseNumber);

            if (phaseMilestones.length === 0 && selectedStatus !== 'ALL') {
              return null;
            }

            return (
              <motion.section
                key={phase.phaseNumber}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-5"
              >
                {/* Phase Header Banner */}
                <div className={`p-5 sm:p-6 rounded-3xl bg-gradient-to-r ${phase.glow} border shadow-[0_0_30px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-0.5 rounded-full border text-xs font-black tracking-wider uppercase ${phase.badgeColor}`}>
                        {phase.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {phase.timeframe}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 font-sans mt-1">
                      {phase.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400">
                      {phaseMilestones.length} Milestone{phaseMilestones.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Milestone Cards Grid */}
                {phaseMilestones.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800 text-slate-500 text-xs">
                    No milestones match filter [{selectedStatus}] in this phase.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {phaseMilestones.map((milestone) => {
                      return (
                        <div
                          key={milestone.id}
                          className="group relative flex flex-col justify-between rounded-3xl bg-[#090E1F]/90 border border-cyan-500/25 hover:border-cyan-400 p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,207,255,0.2)] hover:-translate-y-1"
                        >
                          <div className="space-y-4">
                            {/* Top Meta */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] text-cyan-300/80 font-mono flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                                {milestone.timeline}
                              </span>
                              {getStatusBadge(milestone.status)}
                            </div>

                            {/* Title & Description */}
                            <div>
                              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                                {milestone.title}
                              </h3>
                              <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3 font-sans">
                                {milestone.description}
                              </p>
                            </div>

                            {/* Key Topics */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                                KEY TOPICS:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {milestone.keyTopics.slice(0, 3).map((topic) => (
                                  <span key={topic} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                                    {topic}
                                  </span>
                                ))}
                                {milestone.keyTopics.length > 3 && (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-400">
                                    +{milestone.keyTopics.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                                <span>COMPLETION</span>
                                <strong className="text-cyan-300">{milestone.completionPercentage}%</strong>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                                <div
                                  className="h-full bg-cyan-400 rounded-full transition-all"
                                  style={{ width: `${milestone.completionPercentage}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Action Footer */}
                          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{milestone.deliverables.length} Deliverables</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenMilestone(milestone)}
                              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 hover:text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,207,255,0.2)] cursor-pointer flex items-center gap-1"
                            >
                              <span>Inspect Specs</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.section>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 🔍 DETAILED MILESTONE INSPECTOR MODAL */}
      {/* ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#090E1F] border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(0,207,255,0.25)] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-cyan-500/20 flex items-start justify-between bg-slate-900/80 shrink-0">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                      {selectedMilestone.phaseName}
                    </span>
                    <span className="text-xs text-slate-400">{selectedMilestone.timeline}</span>
                    {getStatusBadge(selectedMilestone.status)}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {selectedMilestone.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => { soundFx.playClick(); setSelectedMilestone(null); }}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    SYLLABUS & CURRICULUM OVERVIEW
                  </h4>
                  <p className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 leading-relaxed font-sans">
                    {selectedMilestone.description}
                  </p>
                </div>

                {/* Key Technical Topics */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    CORE CONCEPTS & LEARNING MODULES
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedMilestone.keyTopics.map((topic, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2 text-xs">
                        <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hands-on Deliverables */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-400" /> REQUIRED HANDS-ON DELIVERABLES
                  </h4>
                  <div className="space-y-2">
                    {selectedMilestone.deliverables.map((deliv, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools & Frameworks */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    TECHNICAL TOOLING & LIBRARIES
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMilestone.toolsAndTech.map((tool) => (
                      <span key={tool} className="px-3 py-1 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Links */}
              <div className="p-4 sm:p-6 border-t border-cyan-500/20 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Link
                    href="/challenges"
                    onClick={() => soundFx.playClick()}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Practice Quests</span>
                  </Link>
                  <Link
                    href="/resources"
                    onClick={() => soundFx.playClick()}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Knowledge Vault</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMilestone(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
