'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  CheckCircle2,
  Timer,
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
  Workflow,
};

type StopwatchState = 'idle' | 'running' | 'stopped' | 'expanded';

function formatElapsed(milliseconds: number) {
  const totalCentiseconds = Math.floor(milliseconds / 10);
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(centiseconds).padStart(2, '0')}`;
}

function DomainStopwatch({ domain, index }: { domain: AIDomain; index: number }) {
  const [status, setStatus] = useState<StopwatchState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);
  const savedElapsed = useRef(0);
  const Icon = ICON_MAP[domain.iconName] || Cpu;

  useEffect(() => {
    if (status !== 'running') return;
    let frame = 0;
    const tick = (now: number) => {
      if (startedAt.current !== null) setElapsed(savedElapsed.current + now - startedAt.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [status]);

  const handlePress = () => {
    soundFx.playClick();
    if (status === 'idle' || status === 'stopped') {
      startedAt.current = performance.now();
      savedElapsed.current = status === 'idle' ? 0 : elapsed;
      if (status === 'idle') setElapsed(0);
      setStatus('running');
      return;
    }
    if (status === 'running') {
      const finalElapsed = savedElapsed.current + (performance.now() - (startedAt.current ?? performance.now()));
      setElapsed(finalElapsed);
      savedElapsed.current = finalElapsed;
      startedAt.current = null;
      setStatus('expanded');
      soundFx.playHologram();
      return;
    }
    setStatus('idle');
    setElapsed(0);
    savedElapsed.current = 0;
  };

  const isOpen = status === 'expanded';
  const isRunning = status === 'running';
  const handRotation = (elapsed / 1000) * 6;
  const stateLabel = isRunning ? 'RUNNING' : isOpen ? 'STOPPED' : 'READY';
  const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

  return (
    <motion.article layout initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.45, delay: index * 0.04 }} className={`relative flex flex-col items-center overflow-visible ${isOpen ? 'sm:col-span-2 lg:col-span-2' : ''}`}>
      <button type="button" onClick={handlePress} aria-expanded={isOpen} aria-live="polite" aria-label={`${isRunning ? 'Stop' : isOpen ? 'Collapse' : 'Start'} ${domain.name} stopwatch`} className="group relative flex min-h-[390px] w-full flex-col items-center justify-center overflow-visible p-4 text-center outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-inset">
        <div className="pointer-events-none absolute inset-x-4 top-1/2 h-72 -translate-y-1/2 rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${domain.color}35 0%, transparent 68%)` }} />
        <div className={`relative mt-12 flex size-64 items-center justify-center rounded-full border-[14px] border-slate-500 bg-[radial-gradient(circle_at_30%_18%,#f8fafc_0%,#aeb8c2_22%,#4b5563_53%,#111827_86%)] shadow-[inset_0_3px_5px_#fff,inset_0_-12px_20px_#020617,0_18px_28px_#000] transition-transform duration-700 group-hover:scale-[1.02] ${isOpen ? 'scale-[1.06]' : ''} ${isRunning ? 'motion-safe:animate-[watch-shake_0.12s_linear_infinite]' : ''}`}>
          <div className="absolute -top-[4.5rem] flex flex-col items-center"><div className="size-11 rounded-full border-4 border-slate-500 bg-gradient-to-b from-slate-100 via-slate-400 to-slate-800 shadow-[inset_0_2px_3px_#fff,0_4px_7px_#000]" /><div className="-mt-1 h-9 w-4 rounded-full bg-gradient-to-r from-slate-200 via-slate-700 to-slate-100" /></div>
          <div className="absolute -top-[5.5rem] size-16 rounded-full border-[6px] border-slate-400 bg-transparent shadow-[inset_0_0_3px_#fff,0_2px_5px_#000]" />
          <div className="absolute inset-2 rounded-full border-2 border-slate-700/80 bg-[radial-gradient(circle_at_40%_28%,#fff,#f1f1ed_54%,#a5a8a8)] shadow-[inset_0_0_15px_#111827]">
            <div className="absolute inset-2 rounded-full border border-slate-400/80" />
            {numerals.map((numeral, numeralIndex) => <span key={numeral} className="absolute left-1/2 top-1/2 font-serif text-[13px] font-bold text-slate-900" style={{ transform: `translate(-50%, -50%) rotate(${numeralIndex * 30}deg) translateY(-88px) rotate(-${numeralIndex * 30}deg)` }}>{numeral}</span>)}
            <div className="absolute inset-0 opacity-70" style={{ background: 'repeating-conic-gradient(from 0deg, #1f2937 0deg 1deg, transparent 1deg 6deg)', maskImage: 'radial-gradient(transparent 0 78%, black 79% 82%, transparent 83%)' }} />
            <div className="absolute left-1/2 top-1/2 h-[38%] w-[3px] origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-slate-950 shadow-[0_0_2px_#fff]" style={{ transform: `translateX(-50%) rotate(${handRotation}deg)`, transformOrigin: '50% 100%' }} />
            <div className="absolute left-1/2 top-1/2 h-[26%] w-[2px] origin-bottom -translate-x-1/2 -translate-y-full rotate-[140deg] rounded-full bg-slate-700" />
            <div className="absolute bottom-[18%] left-1/2 flex size-12 -translate-x-1/2 items-center justify-center rounded-full border-2 border-slate-500 bg-[radial-gradient(circle,#fff,#cbd5e1_55%,#6b7280)] shadow-inner"><span className="font-mono text-[7px] font-bold text-slate-800">{String(Math.floor(elapsed / 1000) % 60).padStart(2, '0')}</span></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pt-5"><Icon className="size-4" style={{ color: domain.color }} /><span className="font-mono text-[15px] font-bold tracking-[0.08em] text-slate-900">{formatElapsed(elapsed)}</span><span className="font-mono text-[7px] tracking-[0.3em] text-slate-600">{stateLabel}</span></div>
            <div className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-700 bg-gradient-to-br from-white to-slate-600 shadow-inner" />
          </div>
          <span className="absolute -right-6 top-1/2 size-4 -translate-y-1/2 rounded-full border border-slate-200 bg-slate-800" style={{ boxShadow: `0 0 14px ${domain.color}` }} />
        </div>
        <span className="relative mt-5 max-w-[240px] font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-200 transition-colors group-hover:text-white">{domain.name}</span>
        <span className="relative mt-2 font-mono text-[9px] tracking-[0.18em] text-slate-500">{isRunning ? 'TAP TO STOP & REVEAL' : isOpen ? 'TAP TO CLOSE' : 'TAP TO START'}</span>
      </button>

      <AnimatePresence initial={false}>{isOpen && <motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -20 }} className="relative -mt-3 w-[calc(100%-2rem)] overflow-hidden rounded-[2rem] border border-slate-500/70 bg-[linear-gradient(145deg,#9ca3af,#1f2937_22%,#0b1220_78%,#64748b)] p-[1px] text-left shadow-[0_16px_30px_#000]" style={{ boxShadow: `0 16px 30px #000, 0 0 30px ${domain.color}18` }}><div className="rounded-[1.9rem] bg-slate-950/90 px-6 pb-6 pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-mono text-[10px] tracking-[0.2em]" style={{ color: domain.color }}>DIAL OPEN / {domain.id.toUpperCase()}</p><h3 className="mt-1 text-xl font-bold text-white">{domain.name}</h3></div><span className="rounded-full border px-3 py-1 font-mono text-[10px] text-slate-300" style={{ borderColor: `${domain.color}55` }}>{domain.activeProjectsCount} ACTIVE PROJECTS</span></div><p className="mt-4 text-sm leading-relaxed text-slate-300">{domain.fullDesc}</p><div className="mt-4 rounded-xl border bg-white/[0.03] p-3" style={{ borderColor: `${domain.color}25` }}><p className="font-mono text-[9px] tracking-[0.16em]" style={{ color: domain.color }}>CURRENT RESEARCH HORIZON</p><p className="mt-1 text-xs text-slate-200">{domain.researchFocus}</p></div><div className="mt-4 flex flex-wrap gap-2">{domain.technologies.map((tech) => <span key={tech} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-slate-300">{tech}</span>)}</div><div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">{domain.keyConcepts.map((concept) => <div key={concept} className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 className="size-3.5 shrink-0" style={{ color: domain.color }} />{concept}</div>)}</div><Link href={`/projects?domain=${domain.id}`} onClick={() => soundFx.playClick()} className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-bold text-white transition-colors hover:text-slate-300">EXPLORE PROJECTS <ArrowRight className="size-4" /></Link></div></motion.div>}</AnimatePresence>
    </motion.article>
  );
}

export default function DomainsSection() {
  const { domains } = useCMSData();

  return (
    <section id="domains" className="relative overflow-hidden bg-transparent py-24 sm:py-32">
      <div className="cyber-grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute right-0 top-1/3 size-96 bg-cyan-600/10 blur-[150px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-[11px] text-cyan-300"><Timer className="size-3.5" /><span>SPECIALIZED RESEARCH LABS</span></div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">AI DOMAINS & <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent">DISCIPLINES</span></h2>
            <p className="max-w-xl font-sans text-sm text-slate-400 sm:text-base">Tap. Start. Stop. Explore. Ten specialized disciplines where student researchers design, train, and deploy machine intelligence.</p>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.14em] text-slate-500"><span className="size-1.5 rounded-full bg-cyan-400" />TAP A DOMAIN TO START THE STOPWATCH</div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain, index) => <DomainStopwatch key={domain.id} domain={domain} index={index} />)}
        </div>
      </div>
    </section>
  );
}
