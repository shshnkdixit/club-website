'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Timer } from 'lucide-react';
import { AIDomain } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

const STOPWATCH_IMAGE = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2026-10-04-22-14-27-02_680d03679600f7af0b4c700c6b270fe7-DiLUyfpPZor1KgmsSDm7ECH1sIwXYd.jpg';

type StopwatchState = 'idle' | 'running' | 'stopped';

function formatElapsed(milliseconds: number) {
  const centiseconds = Math.floor(milliseconds / 10) % 100;
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const minutes = Math.floor(milliseconds / 60000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(centiseconds).padStart(2, '0')}`;
}

function SingleStopwatch({ domains }: { domains: AIDomain[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [status, setStatus] = useState<StopwatchState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);
  const savedElapsed = useRef(0);
  const selectedDomain = domains[selectedIndex];

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

  const selectDomain = (index: number) => {
    setSelectedIndex(index);
    soundFx.playClick();
  };

  const pressStopwatch = () => {
    soundFx.playClick();
    if (status === 'idle' || status === 'stopped') {
      startedAt.current = performance.now();
      savedElapsed.current = status === 'stopped' ? elapsed : 0;
      if (status === 'idle') setElapsed(0);
      setStatus('running');
      return;
    }
    const finalElapsed = savedElapsed.current + performance.now() - (startedAt.current ?? performance.now());
    setElapsed(finalElapsed);
    savedElapsed.current = finalElapsed;
    startedAt.current = null;
    setStatus('stopped');
    soundFx.playHologram();
  };

  const handRotation = (elapsed / 1000) * 6;
  const positions = [
    'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
    'right-[16%] top-[7%]', 'right-0 top-[25%]', 'right-[-3%] top-1/2 -translate-y-1/2',
    'right-[7%] bottom-[20%]', 'right-[25%] bottom-[4%]', 'left-1/2 bottom-[-2%] -translate-x-1/2',
    'left-[10%] bottom-[10%]', 'left-[-3%] top-1/2 -translate-y-1/2', 'left-[4%] top-[22%]',
  ];

  return (
    <div className="relative mx-auto w-full max-w-[760px] pb-8 pt-16">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-cyan-400/10 blur-[100px]" />
      <div className="relative mx-auto aspect-square w-[min(88vw,620px)]">
        <div className="absolute -top-[13%] left-1/2 z-20 h-[18%] w-[12%] -translate-x-1/2 rounded-full border-[10px] border-slate-300/70 bg-transparent shadow-[inset_0_0_6px_#fff,0_4px_10px_#000]" />
        <button type="button" onClick={pressStopwatch} aria-label={status === 'running' ? 'Stop stopwatch and reveal domain' : 'Start stopwatch'} className={`group absolute inset-[4%] z-10 overflow-hidden rounded-full border-[10px] border-slate-300/80 bg-slate-900 shadow-[0_28px_55px_#000,0_0_45px_rgba(34,211,238,0.18)] outline-none transition-transform focus-visible:ring-2 focus-visible:ring-cyan-300 ${status === 'running' ? 'motion-safe:animate-[watch-shake_0.14s_linear_infinite]' : 'hover:scale-[1.015]'}`}>
          <img src={STOPWATCH_IMAGE} alt="Realistic antique mechanical pocket stopwatch" className="absolute inset-0 size-full object-cover object-center mix-blend-screen opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_28%,rgba(2,6,23,0.1)_55%,rgba(2,6,23,0.72)_100%)]" />
          <div className="absolute inset-[20%] rounded-full border border-white/50 shadow-[inset_0_0_24px_rgba(0,0,0,0.8)]" />
          <div className="absolute left-1/2 top-1/2 h-[31%] w-[3px] origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-slate-950 shadow-[0_0_3px_#fff]" style={{ transform: `translateX(-50%) rotate(${handRotation}deg)`, transformOrigin: '50% 100%' }} />
          <div className="absolute left-1/2 top-1/2 h-[22%] w-[2px] origin-bottom -translate-x-1/2 -translate-y-full rotate-[135deg] rounded-full bg-slate-700" />
          <div className="absolute left-1/2 top-1/2 size-[8%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-700 bg-gradient-to-br from-white to-slate-500 shadow-inner" />
          <div className="absolute left-1/2 top-[55%] -translate-x-1/2 rounded bg-slate-950/70 px-2 py-1 font-mono text-[clamp(9px,1.5vw,14px)] font-bold tracking-widest text-slate-100 backdrop-blur-sm">{formatElapsed(elapsed)}</div>
          <div className="absolute inset-x-0 bottom-[13%] text-center font-mono text-[clamp(7px,1vw,10px)] tracking-[0.3em] text-slate-900/80">{status === 'running' ? 'RUNNING' : status === 'stopped' ? 'STOPPED — TAP TO RESTART' : 'TAP TO START'}</div>
        </button>
        {domains.slice(0, 10).map((domain, index) => {
          const active = index === selectedIndex;
          return <button key={domain.id} type="button" onClick={() => selectDomain(index)} aria-label={`Select ${domain.name}`} className={`absolute z-30 max-w-[116px] -translate-y-1/2 rounded-full border px-2 py-1 text-center font-mono text-[9px] font-bold uppercase tracking-[0.08em] backdrop-blur-md transition-all ${positions[index]} ${active ? 'scale-110 border-cyan-300 bg-cyan-300/20 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.55)]' : 'border-white/15 bg-slate-950/75 text-slate-400 hover:border-cyan-400/60 hover:text-white'}`}>{domain.name}</button>;
        })}
      </div>
      <p className="mt-5 text-center font-mono text-[10px] tracking-[0.18em] text-slate-500">SELECT A DIAL POSITION · TAP THE SINGLE STOPWATCH TO START / STOP</p>
      <AnimatePresence mode="wait">
        {status === 'stopped' && selectedDomain && <motion.article key={selectedDomain.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto mt-6 max-w-2xl rounded-[1.5rem] border border-cyan-400/25 bg-slate-950/85 p-5 text-left shadow-[0_20px_45px_#000] backdrop-blur-xl sm:p-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-[10px] tracking-[0.2em] text-cyan-300">DIAL OPEN / {selectedDomain.id.toUpperCase()}</p><h3 className="mt-1 text-xl font-bold text-white">{selectedDomain.name}</h3></div><span className="rounded-full border border-cyan-400/25 px-3 py-1 font-mono text-[10px] text-slate-300">{selectedDomain.activeProjectsCount} ACTIVE PROJECTS</span></div><p className="mt-4 text-sm leading-relaxed text-slate-300">{selectedDomain.fullDesc}</p><p className="mt-4 border-l-2 border-cyan-400/50 pl-3 text-xs text-slate-400">{selectedDomain.researchFocus}</p><div className="mt-4 flex flex-wrap gap-2">{selectedDomain.keyConcepts.map((concept) => <span key={concept} className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-slate-300"><CheckCircle2 className="size-3 text-cyan-300" />{concept}</span>)}</div><Link href={`/projects?domain=${selectedDomain.id}`} onClick={() => soundFx.playClick()} className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-cyan-300 hover:text-white">VIEW PROJECTS <ChevronRight className="size-3" /></Link></motion.article>}
      </AnimatePresence>
    </div>
  );
}

export default function DomainsSection() {
  const { domains } = useCMSData();
  return <section id="domains" className="relative overflow-hidden bg-transparent py-24 sm:py-32"><div className="cyber-grid-bg pointer-events-none absolute inset-0 opacity-20" /><div className="pointer-events-none absolute right-0 top-1/3 size-96 bg-cyan-600/10 blur-[150px]" /><div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="space-y-4"><div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-[11px] text-cyan-300"><Timer className="size-3.5" /><span>SPECIALIZED RESEARCH LABS</span></div><h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">AI DOMAINS & <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent">DISCIPLINES</span></h2><p className="max-w-xl font-sans text-sm text-slate-400 sm:text-base">One physical stopwatch. Ten positions on the dial. Select a discipline, then tap the same mechanical instrument to reveal its research.</p></div></div><SingleStopwatch domains={domains} /></div></section>;
}
