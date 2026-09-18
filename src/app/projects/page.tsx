'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ExternalLink, 
  Maximize2, 
  X, 
  ArrowLeft, 
  Search,
  Filter,
  Layers
} from 'lucide-react';
import { Github } from '@/components/common/Icons';
import { Project } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';
import { CVSimulator, RoboticsArmSimulator, NeuralWeightsSimulator, AgentGraphSimulator } from '@/components/3d/ProjectSimulators';

export default function ProjectsPage() {
  const { projects } = useCMSData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSimulatorProject, setActiveSimulatorProject] = useState<Project | null>(null);

  const categories = ['All', 'Computer Vision', 'Robotics', 'Deep Learning', 'AI Agents', 'Generative AI', 'NLP'];

  const filteredProjects = projects.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenSimulator = (proj: Project) => {
    soundFx.playHologram();
    setActiveSimulatorProject(proj);
  };

  return (
    <div className="min-h-screen bg-transparent text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
          <div>
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-300 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Main Lab</span>
            </Link>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              STUDENT RESEARCH BUILDS & PROJECTS
            </h1>
          </div>

          <span className="text-xs text-cyan-400 font-bold bg-cyan-950/60 px-3.5 py-1.5 rounded-xl border border-cyan-800/40 self-start sm:self-auto">
            {projects.length} ACTIVE PROJECTS ARCHIVED
          </span>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar text-xs">
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

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group rounded-3xl bg-[#080E21]/90 border border-cyan-500/20 hover:border-cyan-400 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,207,255,0.2)] transition-all p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Simulator Live Preview Badge */}
                {project.simulatorType && project.simulatorType !== 'none' && (
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Interactive 3D Simulation
                    </span>
                    <button
                      onClick={() => handleOpenSimulator(project)}
                      className="text-xs text-cyan-400 hover:text-white flex items-center gap-1 font-bold"
                    >
                      <span>Launch</span>
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-wider">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                </div>

                <p className="text-slate-400 text-xs font-sans leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Key Metrics */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[10px]">
                    {project.metrics.map((m, i) => (
                      <div key={i} className="text-center">
                        <span className="text-slate-500 block truncate">{m.label}</span>
                        <span className="text-cyan-300 font-bold">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.demoUrl && project.demoUrl.startsWith('http') && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {project.simulatorType && project.simulatorType !== 'none' ? (
                  <button
                    onClick={() => handleOpenSimulator(project)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 hover:text-black border border-cyan-400 text-cyan-300 font-bold text-xs transition-all"
                  >
                    Open Simulator
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500">Verified Build</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Simulator Modal */}
        <AnimatePresence>
          {activeSimulatorProject && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pt-24 sm:pt-28 pb-8 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveSimulatorProject(null)}
                className="fixed inset-0 bg-black/90 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-3xl bg-[#0B1020] border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_70px_rgba(0,207,255,0.4)] z-10 font-mono text-xs overflow-y-auto max-h-[85vh] my-auto"
              >
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
                      INTERACTIVE SIMULATION LAB
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                      {activeSimulatorProject.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSimulatorProject(null)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950 hover:text-rose-300 text-slate-400 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  {activeSimulatorProject.simulatorType === 'computer-vision' && <CVSimulator />}
                  {activeSimulatorProject.simulatorType === 'robotics' && <RoboticsArmSimulator />}
                  {activeSimulatorProject.simulatorType === 'neural-network' && <NeuralWeightsSimulator />}
                  {activeSimulatorProject.simulatorType === 'ai-agent' && <AgentGraphSimulator />}
                </div>

                <div className="space-y-4">
                  <p className="text-slate-300 text-sm font-sans leading-relaxed">
                    {activeSimulatorProject.longDescription}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-cyan-500/20">
                    {activeSimulatorProject.githubUrl && (
                      <a
                        href={activeSimulatorProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold flex items-center gap-2 hover:bg-slate-700"
                      >
                        <Github className="w-4 h-4" />
                        <span>View Source Code</span>
                      </a>
                    )}
                    <button
                      onClick={() => setActiveSimulatorProject(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
