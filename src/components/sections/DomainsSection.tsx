'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Crosshair, Radio, ScanLine, Sparkles } from 'lucide-react';
import { AIDomain } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

const nodePositions = [
  { left: '50%', top: '7%' },
  { left: '75%', top: '15%' },
  { left: '91%', top: '35%' },
  { left: '86%', top: '65%' },
  { left: '67%', top: '86%' },
  { left: '35%', top: '88%' },
  { left: '11%', top: '65%' },
  { left: '8%', top: '35%' },
  { left: '25%', top: '15%' },
  { left: '50%', top: '50%' },
];

function RadarGrid() {
  return (
    <div className="pointer-events-none absolute inset-[7%] rounded-full border border-white/10">
      <div className="absolute inset-[16%] rounded-full border border-white/10" />
      <div className="absolute inset-[33%] rounded-full border border-white/10" />
      <div className="absolute inset-[50%] rounded-full border border-white/10" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
      <div className="absolute left-1/2 top-1/2 h-[141.4%] w-px origin-center -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/[0.07]" />
      <div className="absolute left-1/2 top-1/2 h-[141.4%] w-px origin-center -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white/[0.07]" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_58%)]" />
    </div>
  );
}

function DomainRadar({ domains, selectedIndex, onSelect }: { domains: AIDomain[]; selectedIndex: number; onSelect: (index: number) => void }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[650px]">
      <div className="absolute inset-[5%] rounded-full border border-white/10 bg-[#080808] shadow-[0_0_90px_rgba(255,255,255,0.05),inset_0_0_80px_rgba(255,255,255,0.03)]" />
      <RadarGrid />
      <div className="pointer-events-none absolute inset-[7%] overflow-hidden rounded-full">
        <div className="radar-sweep absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-bottom-left bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.17)_18deg,transparent_34deg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_42%,rgba(255,255,255,0.02)_72%,transparent_73%)]" />
      </div>
      {[...Array(18)].map((_, index) => (
        <span key={index} className="pointer-events-none absolute size-1 rounded-full bg-white/40 radar-particle" style={{ left: `${12 + ((index * 37) % 76)}%`, top: `${10 + ((index * 53) % 78)}%`, animationDelay: `${index * 180}ms` }} />
      ))}
      {domains.slice(0, 10).map((domain, index) => {
        const position = nodePositions[index];
        const isSelected = selectedIndex === index;
        return (
          <button key={domain.id} type="button" onClick={() => onSelect(index)} aria-label={`Select ${domain.name}`} className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left" style={position}>
            <span className={`block rounded-full border p-1 transition-all ${isSelected ? 'border-white bg-white/15 shadow-[0_0_24px_rgba(255,255,255,0.35)]' : 'border-white/25 bg-black/80 group-hover:border-white/70'}`}>
              <span className={`block size-3 rounded-full transition-all sm:size-4 ${isSelected ? 'bg-white shadow-[0_0_14px_white]' : 'bg-white/50 group-hover:bg-white'}`} />
            </span>
            <span className={`absolute left-1/2 top-full mt-2 w-max -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors sm:text-[10px] ${isSelected ? 'text-white' : 'text-white/45 group-hover:text-white/85'}`}>{domain.name}</span>
          </button>
        );
      })}
      <div className="absolute left-1/2 top-1/2 z-10 flex size-[31%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/25 bg-black/90 text-center shadow-[inset_0_0_32px_rgba(255,255,255,0.06)]">
        <div className="mb-2 flex items-center gap-2 font-mono text-[9px] tracking-[0.26em] text-white/45"><Crosshair className="size-3" /> CORE</div>
        <strong className="font-mono text-[clamp(16px,3vw,28px)] tracking-[0.12em] text-white">AI / ML</strong>
        <span className="mt-1 font-mono text-[8px] tracking-[0.2em] text-white/45">DOMAIN CONTROL</span>
      </div>
      <div className="pointer-events-none absolute inset-[2%] rounded-full border border-white/[0.08]" />
      <div className="pointer-events-none absolute inset-0 rounded-full border border-dashed border-white/[0.12]" />
    </div>
  );
}

export default function DomainsSection() {
  const { domains } = useCMSData();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const selectedDomain = domains[selectedIndex];
  const signal = useMemo(() => `${String(selectedIndex + 1).padStart(2, '0')} / ${String(domains.length).padStart(2, '0')}`, [selectedIndex, domains.length]);

  const selectDomain = (index: number) => {
    setSelectedIndex(index);
    setExpanded(false);
    soundFx.playClick();
  };

  return (
    <section id="domains" className="relative overflow-hidden bg-transparent py-24 sm:py-32">
      <div className="cyber-grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] tracking-[0.22em] text-white/60"><Radio className="size-3" /> AI RESEARCH CONTROL ROOM</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">AI DOMAINS <span className="text-white/35">/</span> <span className="text-white/55">DISCIPLINES</span></h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/45 sm:text-base">A live index of the club&apos;s research surface. Select a signal on the radar to preview a discipline, then open its full intelligence profile.</p>
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-14">
          <div className="relative">
            <div className="mb-5 flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-white/35"><span>RADAR ARRAY / 10 CHANNELS</span><span>SIGNAL {signal}</span></div>
            <DomainRadar domains={domains} selectedIndex={selectedIndex} onSelect={selectDomain} />
            <div className="mt-5 flex items-center justify-center gap-5 font-mono text-[9px] tracking-[0.15em] text-white/30"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-white shadow-[0_0_8px_white]" /> ACTIVE SIGNAL</span><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-white/40" /> AVAILABLE</span></div>
          </div>

          <AnimatePresence mode="wait">
            {selectedDomain && (
              <motion.aside key={selectedDomain.id} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} className="glass-panel-glow relative overflow-hidden p-5 sm:p-6">
                <div className="absolute right-0 top-0 h-px w-24 bg-white/60" />
                <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-white/35"><span>CHANNEL {signal}</span><ScanLine className="size-3" /></div>
                <div className="mt-8 flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">SELECTED DOMAIN</p><h3 className="mt-2 text-2xl font-bold text-white">{selectedDomain.name}</h3></div><Sparkles className="mt-1 size-5 text-white/50" /></div>
                <p className="mt-5 text-sm leading-relaxed text-white/55">{selectedDomain.shortDesc}</p>
                <div className="mt-6 grid grid-cols-2 gap-3 border-y border-white/10 py-4"><div><div className="font-mono text-[9px] tracking-[0.14em] text-white/35">ACTIVE PROJECTS</div><div className="mt-1 font-mono text-xl text-white">{String(selectedDomain.activeProjectsCount).padStart(2, '0')}</div></div><div><div className="font-mono text-[9px] tracking-[0.14em] text-white/35">RESEARCH FOCUS</div><div className="mt-1 line-clamp-2 text-xs text-white/65">{selectedDomain.researchFocus}</div></div></div>
                <button type="button" onClick={() => { setExpanded(!expanded); soundFx.playClick(); }} className="mt-5 flex w-full items-center justify-between border border-white/15 bg-white/[0.04] px-4 py-3 font-mono text-[10px] font-bold tracking-[0.16em] text-white transition-colors hover:bg-white/10"><span>{expanded ? 'COLLAPSE PROFILE' : 'EXPLORE PROFILE'}</span><ArrowUpRight className="size-4" /></button>
                <AnimatePresence>{expanded && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="mt-5 border-t border-white/10 pt-5"><p className="text-sm leading-relaxed text-white/65">{selectedDomain.fullDesc}</p><div className="mt-4 flex flex-wrap gap-2">{selectedDomain.keyConcepts.map((concept) => <span key={concept} className="border border-white/10 px-2 py-1 font-mono text-[9px] text-white/50">{concept}</span>)}</div><Link href={`/projects?domain=${selectedDomain.id}`} onClick={() => soundFx.playClick()} className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.16em] text-white hover:text-white/60">VIEW PROJECTS <ArrowUpRight className="size-3" /></Link></div></motion.div>}</AnimatePresence>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
