'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Bot,
  ChevronRight,
  Cpu,
  ExternalLink,
  Maximize2,
  Radio,
  Scan,
  Sparkles,
  Target,
  Workflow,
  X,
} from 'lucide-react';
import { Github } from '@/components/common/Icons';
import { Project } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';
import {
  AgentGraphSimulator,
  CVSimulator,
  NeuralWeightsSimulator,
  RoboticsArmSimulator,
} from '@/components/3d/ProjectSimulators';

const nodePositions = [
  'left-[7%] top-[18%]',
  'left-[36%] top-[8%]',
  'right-[8%] top-[17%]',
  'left-[20%] bottom-[10%]',
  'right-[28%] bottom-[8%]',
  'left-[52%] top-[38%]',
];

const categoryIcons = {
  'Computer Vision': Scan,
  Robotics: Bot,
  'Deep Learning': Cpu,
  'AI Agents': Workflow,
  'Generative AI': Sparkles,
  NLP: Activity,
};

export default function ProjectsSection() {
  const { projects } = useCMSData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSimulatorProject, setActiveSimulatorProject] = useState<Project | null>(null);

  const categories = ['All', 'Computer Vision', 'Robotics', 'Deep Learning', 'AI Agents', 'Generative AI', 'NLP'];
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((project) => project.category === selectedCategory);

  const activeProject = selectedProject ?? filteredProjects[0] ?? null;
  const visibleProjects = filteredProjects.slice(0, 6);

  const selectProject = (project: Project) => {
    soundFx.playClick();
    setSelectedProject(project);
  };

  const handleOpenSimulator = (project: Project) => {
    soundFx.playHologram();
    setActiveSimulatorProject(project);
  };

  return (
    <section id="projects" className="relative overflow-hidden bg-transparent py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-20" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[160px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[11px] text-cyan-300">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>LIVE RESEARCH NETWORK / 06 NODES ONLINE</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              AUTONOMOUS <span className="bg-gradient-to-r from-cyan-300 via-violet-400 to-emerald-300 bg-clip-text text-transparent">PROJECTS</span>
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Navigate active student missions across perception, robotics, neural systems, and autonomous agents.
            </p>
          </div>
          <Link href="/projects" onClick={() => soundFx.playClick()} className="group inline-flex items-center gap-2 font-mono text-xs text-cyan-300 transition-colors hover:text-cyan-200">
            OPEN COMPLETE ARCHIVE <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 font-mono text-[10px] no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => { soundFx.playClick(); setSelectedCategory(category); setSelectedProject(null); }}
              className={`whitespace-nowrap rounded-full border px-4 py-2 transition-colors ${selectedCategory === category ? 'border-cyan-300 bg-cyan-400/15 text-cyan-200' : 'border-slate-800 bg-slate-950/60 text-slate-500 hover:border-slate-700 hover:text-slate-300'}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[#050b13]/90 shadow-[0_0_80px_rgba(0,207,255,0.06)]">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(0,207,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,207,255,.08) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
          <div className="relative flex items-center justify-between border-b border-cyan-400/15 px-5 py-4 font-mono text-[10px] sm:px-8">
            <div className="flex items-center gap-3 text-cyan-300"><Target className="h-4 w-4" /> AUTONOMOUS MISSION CONTROL</div>
            <div className="hidden items-center gap-2 text-emerald-300 sm:flex"><span className="size-1.5 rounded-full bg-emerald-300" /> LIVE</div>
          </div>

          <div className="relative h-[250px] sm:h-[290px]">
            <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-50" preserveAspectRatio="none" aria-hidden="true">
              <line x1="15%" y1="28%" x2="50%" y2="51%" stroke="#00cfff" strokeDasharray="5 8" />
              <line x1="43%" y1="18%" x2="50%" y2="51%" stroke="#9b5cff" strokeDasharray="5 8" />
              <line x1="84%" y1="28%" x2="50%" y2="51%" stroke="#00cfff" strokeDasharray="5 8" />
              <line x1="27%" y1="84%" x2="50%" y2="51%" stroke="#10b981" strokeDasharray="5 8" />
              <line x1="67%" y1="85%" x2="50%" y2="51%" stroke="#ec4899" strokeDasharray="5 8" />
            </svg>
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
              <div className="flex size-20 items-center justify-center rounded-full border border-cyan-300/60 bg-cyan-400/10 shadow-[0_0_45px_rgba(0,207,255,.3)]"><Cpu className="h-8 w-8 text-cyan-200" /></div>
              <span className="font-mono text-[9px] tracking-[0.25em] text-cyan-300">COMMAND CORE</span>
            </div>
            {visibleProjects.map((project, index) => {
              const Icon = categoryIcons[project.category as keyof typeof categoryIcons] ?? Activity;
              const isSelected = activeProject?.id === project.id;
              return (
                <motion.button
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => selectProject(project)}
                  className={`absolute ${nodePositions[index]} flex w-28 -translate-x-1/2 flex-col items-center gap-1.5 text-center sm:w-36 ${selectedProject && !isSelected ? 'opacity-35' : 'opacity-100'}`}
                >
                  <span className={`flex size-12 items-center justify-center rounded-full border transition-all sm:size-14 ${isSelected ? 'border-cyan-200 bg-cyan-300/20 text-cyan-100 shadow-[0_0_30px_rgba(0,207,255,.45)]' : 'border-slate-600 bg-slate-900/90 text-slate-400 hover:border-cyan-400 hover:text-cyan-300'}`}><Icon className="h-5 w-5" /></span>
                  <span className={`max-w-32 font-mono text-[8px] font-semibold uppercase leading-[1.15] tracking-[0.08em] transition-colors sm:text-[9px] ${isSelected ? 'text-cyan-200' : 'text-slate-400'}`}>
                {project.title.split(':')[0]}<br /><span className="font-normal tracking-[0.12em] text-slate-500">{project.category}</span>
              </span>
                </motion.button>
              );
            })}
          </div>

          {activeProject && (
            <motion.div key={activeProject.id} initial={{ opacity: 0, y: 12, scaleY: 0.96 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 22 }} className="relative origin-top border-t border-cyan-400/25 bg-gradient-to-b from-cyan-950/25 via-slate-950/85 to-slate-950/90 p-5 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
                <div className="relative min-h-44 overflow-hidden rounded-xl border border-cyan-400/25 bg-slate-900 lg:w-72 lg:shrink-0">
                  <img src={activeProject.image} alt={`${activeProject.title} project visual`} className="absolute inset-0 size-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.18em] text-cyan-200">VISUAL TELEMETRY</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2 font-mono text-[10px] text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-300" /> MISSION ACTIVE / {activeProject.category.toUpperCase()}</div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">{activeProject.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{activeProject.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">{activeProject.technologies.map((tech) => <span key={tech} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-[10px] text-slate-400">{tech}</span>)}</div>
                </div>
                <div className="flex shrink-0 flex-wrap items-start gap-3 font-mono text-[10px] lg:w-44">
                  {activeProject.metrics?.map((metric) => <div key={metric.label} className="border-l border-cyan-400/30 pl-3"><div className="text-slate-600">{metric.label}</div><div className="text-cyan-200">{metric.value}</div></div>)}
                  {activeProject.simulatorType && activeProject.simulatorType !== 'none' && <button onClick={() => handleOpenSimulator(activeProject)} className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/50 bg-cyan-400/10 px-3 py-2 text-cyan-200 hover:bg-cyan-400/20"><Maximize2 className="h-3.5 w-3.5" /> SIMULATE</button>}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 font-mono text-[10px] text-slate-500"><span>LEAD OPERATIVE: <b className="text-slate-300">{activeProject.teamMembers[0]}</b></span><div className="flex items-center gap-4"><Link href={`/projects#${activeProject.id}`} className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200">DETAILS <ChevronRight className="h-3.5 w-3.5" /></Link>{activeProject.githubUrl && <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="Open GitHub repository" className="text-slate-400 hover:text-white"><Github className="h-4 w-4" /></a>}</div></div>
            </motion.div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 font-mono text-[10px] text-slate-600"><Activity className="h-3.5 w-3.5 text-emerald-400" /> SELECT A NODE TO INSPECT ITS MISSION PROFILE</div>

        <AnimatePresence>
          {activeSimulatorProject && (
            <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveSimulatorProject(null)} className="fixed inset-0 bg-black/85 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-cyan-500/40 bg-[#0a0a0a] p-6 font-mono text-xs sm:p-8">
                <div className="mb-4 flex items-start justify-between border-b border-cyan-500/20 pb-4"><div><div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-cyan-400"><span className="size-2 animate-pulse rounded-full bg-emerald-400" /> INTERACTIVE SIMULATION LAB</div><h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">{activeSimulatorProject.title}</h3></div><button onClick={() => setActiveSimulatorProject(null)} aria-label="Close simulator" className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button></div>
                <div className="mb-6">{activeSimulatorProject.simulatorType === 'computer-vision' && <CVSimulator />}{activeSimulatorProject.simulatorType === 'robotics' && <RoboticsArmSimulator />}{activeSimulatorProject.simulatorType === 'neural-network' && <NeuralWeightsSimulator />}{activeSimulatorProject.simulatorType === 'ai-agent' && <AgentGraphSimulator />}</div>
                <div><h4 className="mb-1 text-xs font-bold uppercase text-cyan-400">&gt; ARCHITECTURAL SYNOPSIS</h4><p className="font-sans text-sm leading-relaxed text-slate-300">{activeSimulatorProject.longDescription}</p></div>
                <div className="mt-4 flex items-center justify-between border-t border-cyan-500/20 pt-4">{activeSimulatorProject.githubUrl && <a href={activeSimulatorProject.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-3.5 py-2 font-bold text-white hover:bg-slate-700"><Github className="h-4 w-4" /> View Code on GitHub</a>}<button onClick={() => setActiveSimulatorProject(null)} className="text-slate-400 hover:text-white">Close Simulator</button></div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
