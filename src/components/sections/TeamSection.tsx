'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Mail, Network, X } from 'lucide-react';
import { Linkedin, Github, Twitter } from '@/components/common/Icons';
import { TeamMember } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

type CrewCategory = 'RESEARCH' | 'ENGINEERING' | 'AI/ML' | 'ROBOTICS' | 'DESIGN' | 'OPERATIONS';

const categories = ['ALL', 'RESEARCH', 'ENGINEERING', 'AI/ML', 'ROBOTICS', 'DESIGN', 'OPERATIONS'] as const;
const positions = [
  { x: 13, y: 17 }, { x: 29, y: 8 }, { x: 47, y: 14 }, { x: 69, y: 10 },
  { x: 86, y: 25 }, { x: 90, y: 52 }, { x: 77, y: 77 }, { x: 56, y: 87 },
  { x: 33, y: 83 }, { x: 13, y: 69 }, { x: 7, y: 43 }, { x: 38, y: 30 },
  { x: 68, y: 34 }, { x: 75, y: 58 }, { x: 27, y: 56 }, { x: 51, y: 67 },
];

function categoryFor(member: TeamMember): CrewCategory {
  const value = `${member.department} ${member.role} ${member.domain}`.toLowerCase();
  if (value.includes('robot')) return 'ROBOTICS';
  if (value.includes('design') || value.includes('creative')) return 'DESIGN';
  if (value.includes('operation') || value.includes('event') || value.includes('market')) return 'OPERATIONS';
  if (value.includes('engineer') || value.includes('technical') || value.includes('developer')) return 'ENGINEERING';
  if (value.includes('research') || value.includes('faculty') || value.includes('mentor')) return 'RESEARCH';
  return 'AI/ML';
}

export default function TeamSection() {
  const { team } = useCMSData();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [filter, setFilter] = useState<(typeof categories)[number]>('ALL');

  const crew = useMemo(() => team.map((member, index) => ({
    member,
    category: categoryFor(member),
    position: positions[index % positions.length],
  })), [team]);

  const openMember = (member: TeamMember) => {
    soundFx.playHologram();
    setSelectedMember(member);
  };

  return (
    <section id="team" className="relative overflow-hidden bg-transparent py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-[0.08]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.055] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300">
              <Network className="size-3.5" />
              <span>AI CREW NETWORK / LIVE SYSTEM</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-6xl">
              AI CREW <span className="text-cyan-300">NETWORK</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Meet the researchers, engineers, designers, and operators building the club&apos;s intelligent systems.
            </p>
          </div>
          <Link href="/team" onClick={() => soundFx.playClick()} className="group inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.14em] text-cyan-300 transition-colors hover:text-white md:self-auto">
            View Full Directory <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mb-5 flex flex-col gap-4 border-y border-white/10 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-cyan-300">AI CREW NETWORK</span>
          <span>{team.length} MEMBERS ONLINE</span>
          <span className="flex items-center gap-2 text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_currentColor]" /> RESEARCH NETWORK ACTIVE</span>
        </div>

        <div className="mb-7 flex flex-wrap items-center gap-2">
          {categories.map(category => (
            <button key={category} type="button" onClick={() => { soundFx.playClick(); setFilter(category); }} className={`border px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] transition-colors ${filter === category ? 'border-cyan-300 bg-cyan-300/10 text-cyan-200' : 'border-white/10 text-slate-500 hover:border-cyan-300/50 hover:text-slate-200'}`}>
              {category}
            </button>
          ))}
          <div className="ml-auto hidden items-center gap-3 font-mono text-[10px] uppercase text-slate-500 sm:flex"><span className="size-2 rounded-full border border-cyan-300 bg-cyan-300/20" /> Active node <span className="size-2 rounded-full border border-violet-300 bg-violet-300/20" /> Lead / mentor</div>
        </div>

        <div className="flex flex-col gap-2 sm:hidden">
          {crew.map(({ member, category }) => {
            const dimmed = filter !== 'ALL' && category !== filter;
            return (
              <button key={member.id} type="button" onClick={() => openMember(member)} className={`flex items-center gap-3 border border-white/10 bg-[#070b0d]/80 p-3 text-left transition-opacity ${dimmed ? 'opacity-30' : 'opacity-100'}`}>
                <span className="relative size-12 shrink-0 overflow-hidden rounded-full border border-cyan-300/40 p-0.5"><img src={member.avatar} alt="" className="size-full rounded-full object-cover" /><span className="absolute bottom-0 right-0 size-2 rounded-full border border-[#070b0d] bg-emerald-300" /></span>
                <span className="min-w-0 flex-1"><span className="block truncate font-mono text-xs font-semibold text-white">{member.name}</span><span className="block truncate font-mono text-[9px] uppercase tracking-wider text-slate-500">{member.role}</span></span>
                <span className="border border-white/10 px-1.5 py-1 font-mono text-[8px] text-cyan-300">{category}</span><ChevronRight className="size-4 text-slate-600" />
              </button>
            );
          })}
        </div>

        <div className="relative hidden min-h-[620px] overflow-hidden border border-white/10 bg-[#070b0d]/80 sm:block sm:min-h-[650px]">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(90,220,220,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(90,220,220,.07)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-[min(54vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-[min(40vw,20rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 border-dashed" />

          <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
            {crew.map(({ member, position, category }) => {
              const dimmed = filter !== 'ALL' && category !== filter;
              return <line key={`line-${member.id}`} x1="50%" y1="50%" x2={`${position.x}%`} y2={`${position.y}%`} stroke={category === 'RESEARCH' ? '#a78bfa' : '#67e8f9'} strokeOpacity={dimmed ? 0.05 : 0.22} strokeWidth="1" strokeDasharray="3 7" className="transition-all duration-500" />;
            })}
          </svg>

          <div className="absolute left-1/2 top-1/2 z-20 flex size-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-cyan-200/50 bg-[#071417]/95 text-center shadow-[0_0_60px_rgba(34,211,238,.16)] sm:size-44">
            <div className="absolute inset-2 animate-pulse rounded-full border border-cyan-300/20" />
            <span className="relative font-mono text-[9px] tracking-[0.25em] text-cyan-300">COMMAND CORE</span>
            <strong className="relative mt-2 text-lg tracking-tight text-white sm:text-xl">AI/ML CLUB</strong>
            <span className="relative mt-1 font-mono text-[9px] text-slate-500">NODE // 00</span>
          </div>

          {crew.map(({ member, category, position }, index) => {
            const dimmed = filter !== 'ALL' && category !== filter;
            const lead = member.isFaculty || member.isMentor || member.orgLevel === 1 || member.orgLevel === 2;
            return (
              <motion.button key={member.id} type="button" onClick={() => openMember(member)} onMouseEnter={() => soundFx.playHover()} animate={{ opacity: dimmed ? 0.2 : 1, scale: dimmed ? 0.92 : 1 }} transition={{ duration: 0.35, delay: index * 0.015 }} className="group absolute z-30 -translate-x-1/2 -translate-y-1/2 text-left" style={{ left: `${position.x}%`, top: `${position.y}%` }} aria-label={`Open dossier for ${member.name}`}>
                <span className={`relative mx-auto flex size-14 items-center justify-center overflow-hidden rounded-full border bg-[#0b1114] p-0.5 transition-all group-hover:scale-110 group-hover:border-cyan-200 group-hover:shadow-[0_0_26px_rgba(103,232,249,.4)] sm:size-16 ${lead ? 'border-violet-300/70' : 'border-cyan-300/40'}`}>
                  <img src={member.avatar} alt="" className="size-full rounded-full object-cover" />
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#0b1114] bg-emerald-300" />
                </span>
                <span className="mt-2 block max-w-28 text-center font-mono text-[10px] font-semibold text-white transition-colors group-hover:text-cyan-200">{member.name}</span>
                <span className="block max-w-28 truncate text-center font-mono text-[8px] uppercase tracking-wider text-slate-500">{member.role}</span>
                <span className="mx-auto mt-1 block w-fit border border-white/10 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-wider text-slate-600">{category}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedMember && (
            <>
              <motion.button type="button" aria-label="Close personnel dossier" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMember(null)} className="fixed inset-0 z-[9980] cursor-default bg-black/70 backdrop-blur-sm" />
              <motion.aside role="dialog" aria-modal="true" aria-label={`${selectedMember.name} personnel dossier`} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }} transition={{ type: 'spring', damping: 28, stiffness: 260 }} className="fixed right-0 top-0 z-[9990] flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-cyan-300/25 bg-[#081012]/95 p-6 shadow-[-20px_0_80px_rgba(0,0,0,.5)] backdrop-blur-xl sm:p-8">
                <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-4"><span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300">Personnel dossier // {selectedMember.id}</span><button type="button" onClick={() => setSelectedMember(null)} aria-label="Close dossier" className="text-slate-500 hover:text-white"><X className="size-5" /></button></div>
                <div className="flex items-center gap-4"><img src={selectedMember.avatar} alt={selectedMember.name} className="size-20 rounded-full border border-cyan-300/60 object-cover" /><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">{selectedMember.role}</p><h3 className="mt-1 text-2xl font-bold tracking-tight text-white">{selectedMember.name}</h3><p className="mt-1 font-mono text-[10px] uppercase text-slate-500">{selectedMember.department}</p></div></div>
                <div className="mt-10 flex flex-col gap-7"><div><p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">01 / Biography</p><p className="text-sm leading-6 text-slate-300">{selectedMember.bio}</p></div><div><p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">02 / Skills & technology</p><div className="flex flex-wrap gap-2">{selectedMember.skills.map(skill => <span key={skill} className="border border-white/10 px-2 py-1 font-mono text-[10px] text-slate-300">{skill}</span>)}</div></div></div>
                <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-6">{selectedMember.linkedin && <a href={selectedMember.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-cyan-300"><Linkedin className="size-4" /></a>}{selectedMember.github && <a href={selectedMember.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-slate-400 hover:text-white"><Github className="size-4" /></a>}{selectedMember.twitter && <a href={selectedMember.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="text-slate-400 hover:text-cyan-300"><Twitter className="size-4" /></a>}{selectedMember.email && <a href={`mailto:${selectedMember.email}`} aria-label="Email" className="text-slate-400 hover:text-cyan-300"><Mail className="size-4" /></a>}<button type="button" onClick={() => setSelectedMember(null)} className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300 hover:text-white">Close dossier <ChevronRight className="size-3" /></button></div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
