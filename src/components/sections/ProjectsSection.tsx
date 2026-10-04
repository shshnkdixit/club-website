'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ExternalLink, 
  Star, 
  Cpu, 
  Maximize2, 
  X, 
  Bot, 
  Scan, 
  Workflow, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { Github } from '@/components/common/Icons';
import { Project } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';
import { CVSimulator, RoboticsArmSimulator, NeuralWeightsSimulator, AgentGraphSimulator } from '@/components/3d/ProjectSimulators';

export default function ProjectsSection() {
  const { projects } = useCMSData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSimulatorProject, setActiveSimulatorProject] = useState<Project | null>(null);

  const categories = ['All', 'Computer Vision', 'Robotics', 'Deep Learning', 'AI Agents', 'Generative AI', 'NLP'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const handleOpenSimulator = (proj: Project) => {
    soundFx.playHologram();
    setActiveSimulatorProject(proj);
  };

  return (
    <section id="projects" className="relative py-24 sm:py-32 bg-transparent overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/10 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-[11px] font-mono text-violet-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ENGINEERED BY STUDENTS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              AUTONOMOUS{' '}
              <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                PROJECTS
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-sans max-w-xl">
              From sub-millimeter robotics kinematics to real-time neural vision and self-correcting agent swarms.
            </p>
          </div>

          <Link
            href="/projects"
            onClick={() => soundFx.playClick()}
            className="self-start md:self-auto inline-flex items-center gap-2 font-mono text-xs text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <span>Explore All 50+ Builds</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar font-mono text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_15px_rgba(0,207,255,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400/60 shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(0,207,255,0.25)] transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1.5"
            >
              {/* Project Image & Interactive Simulator Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold uppercase">
                  {project.category}
                </div>

                {/* Simulator Trigger Overlay Button */}
                {project.simulatorType && project.simulatorType !== 'none' && (
                  <button
                    onClick={() => handleOpenSimulator(project)}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 backdrop-blur-md border border-cyan-400 text-[10px] font-mono text-cyan-200 font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,207,255,0.4)]"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>LAUNCH SIMULATOR</span>
                  </button>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-mono group-hover:text-cyan-300 transition-colors mb-1.5 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed mb-3">
                    {project.description}
                  </p>

                  {/* Metrics Telemetry Tags */}
                  {project.metrics && (
                    <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-center mb-3">
                      {project.metrics.map(m => (
                        <div key={m.label}>
                          <span className="text-slate-500 block text-[9px]">{m.label}</span>
                          <span className="font-bold text-cyan-300">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map(tech => (
                      <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Team & Links */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
                  <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                    Led by: <span className="text-slate-200">{project.teamMembers[0]}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.simulatorType && project.simulatorType !== 'none' ? (
                      <button
                        onClick={() => handleOpenSimulator(project)}
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[11px]"
                      >
                        <span>Simulate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <Link
                        href={`/projects#${project.id}`}
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[11px]"
                      >
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Simulator Modal */}
        <AnimatePresence>
          {activeSimulatorProject && (
            <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveSimulatorProject(null)}
                className="fixed inset-0 bg-black/85 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-3xl bg-[#0a0a0a] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,207,255,0.3)] z-10 font-mono text-xs overflow-y-auto max-h-[90vh]"
              >
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
                        INTERACTIVE SIMULATION LAB
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                      {activeSimulatorProject.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSimulatorProject(null)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Specific Simulator Component */}
                <div className="mb-6">
                  {activeSimulatorProject.simulatorType === 'computer-vision' && <CVSimulator />}
                  {activeSimulatorProject.simulatorType === 'robotics' && <RoboticsArmSimulator />}
                  {activeSimulatorProject.simulatorType === 'neural-network' && <NeuralWeightsSimulator />}
                  {activeSimulatorProject.simulatorType === 'ai-agent' && <AgentGraphSimulator />}
                </div>

                {/* Project Specs & Rationale */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs uppercase text-cyan-400 font-bold mb-1">
                      &gt; ARCHITECTURAL SYNOPSIS
                    </h4>
                    <p className="text-slate-300 text-sm font-sans leading-relaxed">
                      {activeSimulatorProject.longDescription}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      {activeSimulatorProject.githubUrl && (
                        <a
                          href={activeSimulatorProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-2"
                        >
                          <Github className="w-4 h-4" />
                          <span>View Code on GitHub</span>
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveSimulatorProject(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      Close Simulator
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
