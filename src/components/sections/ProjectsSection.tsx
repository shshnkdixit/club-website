'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight, Bot, Cpu, ExternalLink, Maximize2, Radio, Scan, Sparkles, Workflow, X } from 'lucide-react';
import { Github } from '@/components/common/Icons';
import { Project } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';
import { AgentGraphSimulator, CVSimulator, NeuralWeightsSimulator, RoboticsArmSimulator } from '@/components/3d/ProjectSimulators';

const blipPositions = [
  'left-[22%] top-[18%]', 'left-[72%] top-[17%]', 'left-[82%] top-[50%]',
  'left-[65%] top-[76%]', 'left-[28%] top-[75%]', 'left-[15%] top-[48%]',
];

const categoryIcons = { 'Computer Vision': Scan, Robotics: Bot, 'Deep Learning': Cpu, 'AI Agents': Workflow, 'Generative AI': Sparkles, NLP: Activity };
const radarNames: Record<string, string> = {
  'Computer Vision': 'NeuroVision Edge', 'AI Agents': 'SwarmNexus', 'Generative AI': 'OmniGen',
  NLP: 'BioRAG', Robotics: 'Autonomous Quadruped Control', 'Deep Learning': 'Neural Training Loop',
};

export default function ProjectsSection() {
  const { projects } = useCMSData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSimulatorProject, setActiveSimulatorProject] = useState<Project | null>(null);
  const categories = ['All', 'Computer Vision', 'Robotics', 'Deep Learning', 'AI Agents', 'Generative AI', 'NLP'];

  const visibleProjects = useMemo(() => {
    const filtered = selectedCategory === 'All' ? projects : projects.filter((project) => project.category === selectedCategory);
    return filtered.slice(0, 6);
  }, [projects, selectedCategory]);

  const selectProject = (project: Project) => { soundFx.playClick(); setSelectedProject(project); };
  const closeIntel = () => setSelectedProject(null);

  return (
    <section id="projects" className="relative overflow-hidden bg-transparent py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-20" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[160px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[11px] text-cyan-300"><Radio className="h-3.5 w-3.5 animate-pulse" /><span>LIVE RESEARCH NETWORK</span></div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">AUTONOMOUS <span className="bg-gradient-to-r from-cyan-300 via-violet-400 to-emerald-300 bg-clip-text text-transparent">PROJECTS</span></h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">Navigate active student research across perception, robotics, neural systems, and autonomous agents.</p>
          </div>
          <Link href="/projects" onClick={() => soundFx.playClick()} className="group inline-flex items-center gap-2 font-mono text-xs text-cyan-300 transition-colors hover:text-cyan-200">OPEN COMPLETE ARCHIVE <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 font-mono text-[10px] no-scrollbar">
          {categories.map((category) => <button key={category} onClick={() => { soundFx.playClick(); setSelectedCategory(category); setSelectedProject(null); }} className={`whitespace-nowrap rounded-full border px-4 py-2 transition-colors ${selectedCategory === category ? 'border-cyan-300 bg-cyan-400/15 text-cyan-200' : 'border-slate-800 bg-slate-950/60 text-slate-500 hover:border-slate-700 hover:text-slate-300'}`}>{category}</button>)}
        </div>

        <div className="relative flex min-h-[470px] items-center justify-center overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[#030912]/80 py-10 shadow-[0_0_100px_rgba(0,207,255,0.07)] sm:min-h-[620px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,207,255,.12),transparent_48%)]" />
          <div className="relative aspect-square w-[min(78vw,620px)] rounded-full border border-cyan-300/30 bg-[#06131b]/75 shadow-[0_0_80px_rgba(0,207,255,.12),inset_0_0_80px_rgba(0,207,255,.08)] backdrop-blur-sm">
            {[24, 43, 62, 81].map((size) => <div key={size} className="pointer-events-none absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15" style={{ width: `${size}%` }} />)}
            <div className="pointer-events-none absolute inset-[9%] rounded-full border border-dashed border-cyan-300/15" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-1/2 w-px bg-cyan-300/15" /><div className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-cyan-300/15" />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-bottom-left border-l border-t border-cyan-200/70 bg-gradient-to-tr from-cyan-400/20 to-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
            {Array.from({ length: 18 }).map((_, i) => <span key={i} className="pointer-events-none absolute size-1 rounded-full bg-cyan-200/60 shadow-[0_0_8px_#00cfff]" style={{ left: `${12 + ((i * 37) % 76)}%`, top: `${10 + ((i * 53) % 80)}%`, opacity: 0.25 + (i % 4) * 0.16 }} />)}
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center font-mono"><div className="text-[10px] font-semibold tracking-[0.28em] text-cyan-200 sm:text-xs">PROJECT RADAR</div><div className="mt-1 text-[7px] tracking-[0.22em] text-emerald-300/75">LIVE RESEARCH NETWORK</div></div>
            {visibleProjects.map((project, index) => {
              const Icon = categoryIcons[project.category as keyof typeof categoryIcons] ?? Activity;
              const isSelected = selectedProject?.id === project.id;
              return <motion.button key={project.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: selectedProject && !isSelected ? 0.35 : 1, scale: 1 }} transition={{ delay: index * .08, type: 'spring' }} onMouseEnter={() => setHoveredProject(project.id)} onMouseLeave={() => setHoveredProject(null)} onClick={() => selectProject(project)} className={`absolute ${blipPositions[index]} z-20 -translate-x-1/2 -translate-y-1/2`} aria-label={`Inspect ${radarNames[project.category] ?? project.title}`}>
                <span className={`block size-3 rounded-full border border-cyan-100 bg-cyan-300 shadow-[0_0_14px_#00cfff] transition-all ${isSelected ? 'scale-[2.1] bg-white shadow-[0_0_32px_#fff]' : 'hover:scale-150'}`} />
                {hoveredProject === project.id && !isSelected && <span className="absolute left-1/2 top-5 z-30 w-36 -translate-x-1/2 rounded border border-cyan-300/40 bg-slate-950/95 px-2 py-1.5 text-center font-mono text-[9px] text-cyan-100 shadow-xl">{radarNames[project.category] ?? project.title}<span className="block text-[8px] text-slate-500">{project.category}</span></span>}
              </motion.button>;
            })}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2 font-mono text-[10px] text-slate-600"><Activity className="h-3.5 w-3.5 text-emerald-400" /> HOVER A BLIP TO SCAN / CLICK TO OPEN PROJECT INTEL</div>

        <AnimatePresence>
          {selectedProject && <motion.aside initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="relative mx-auto mt-6 max-w-3xl rounded-2xl border border-cyan-300/30 bg-slate-950/95 p-5 shadow-[0_0_50px_rgba(0,207,255,.12)] sm:p-6">
            <button onClick={closeIntel} aria-label="Close project intel" className="absolute right-4 top-4 text-slate-500 hover:text-white"><X className="h-4 w-4" /></button>
            <div className="mb-4 font-mono text-[10px] tracking-[0.2em] text-cyan-300">PROJECT INTEL // {selectedProject.category.toUpperCase()}</div>
            <h3 className="pr-8 text-xl font-bold text-white">{radarNames[selectedProject.category] ?? selectedProject.title}</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{selectedProject.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">{selectedProject.technologies.map((tech) => <span key={tech} className="rounded border border-slate-700 px-2 py-1 font-mono text-[10px] text-slate-400">{tech}</span>)}</div>
            <div className="mt-5 grid gap-4 border-t border-slate-800 pt-4 sm:grid-cols-3">{selectedProject.metrics?.map((metric) => <div key={metric.label} className="font-mono text-[10px]"><div className="text-slate-600">{metric.label}</div><div className="mt-1 text-cyan-200">{metric.value}</div></div>)}<div className="font-mono text-[10px]"><div className="text-slate-600">PROJECT LEAD</div><div className="mt-1 text-cyan-200">{selectedProject.teamMembers[0]}</div></div></div>
            <div className="mt-5 flex flex-wrap items-center gap-3"><button onClick={() => { soundFx.playHologram(); setActiveSimulatorProject(selectedProject); }} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/50 bg-cyan-400/10 px-3 py-2 font-mono text-[10px] text-cyan-200 hover:bg-cyan-400/20"><Maximize2 className="h-3.5 w-3.5" /> SIMULATE</button><Link href={`/projects#${selectedProject.id}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 font-mono text-[10px] text-slate-300 hover:border-cyan-300/50"><ExternalLink className="h-3.5 w-3.5" /> VIEW DETAILS</Link>{selectedProject.githubUrl && <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-slate-500 hover:text-white"><Github className="h-4 w-4" /></a>}</div>
          </motion.aside>}
        </AnimatePresence>

        <AnimatePresence>{activeSimulatorProject && <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveSimulatorProject(null)} className="fixed inset-0 bg-black/85 backdrop-blur-md" /><motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-cyan-500/40 bg-[#0a0a0a] p-6 font-mono text-xs sm:p-8"><div className="mb-4 flex items-start justify-between border-b border-cyan-500/20 pb-4"><div><div className="text-[10px] tracking-widest text-cyan-400">INTERACTIVE SIMULATION LAB</div><h3 className="mt-1 text-xl font-bold text-white">{activeSimulatorProject.title}</h3></div><button onClick={() => setActiveSimulatorProject(null)} aria-label="Close simulator"><X className="h-5 w-5 text-slate-400" /></button></div><div className="mb-6">{activeSimulatorProject.simulatorType === 'computer-vision' && <CVSimulator />}{activeSimulatorProject.simulatorType === 'robotics' && <RoboticsArmSimulator />}{activeSimulatorProject.simulatorType === 'neural-network' && <NeuralWeightsSimulator />}{activeSimulatorProject.simulatorType === 'ai-agent' && <AgentGraphSimulator />}</div><p className="font-sans text-sm leading-relaxed text-slate-300">{activeSimulatorProject.longDescription}</p></motion.div></div>}</AnimatePresence>
      </div>
    </section>
  );
}
