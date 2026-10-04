'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ExternalLink, X, ArrowRight, BookMarked } from 'lucide-react';
import { ResearchPaper } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

function ResearchSignal() {
  const nodes = [
    { className: 'left-[17%] top-[25%]', tone: 'bg-cyan-300' },
    { className: 'left-[12%] top-[61%]', tone: 'bg-emerald-300' },
    { className: 'left-[38%] top-[10%]', tone: 'bg-cyan-200' },
    { className: 'right-[13%] top-[22%]', tone: 'bg-emerald-300' },
    { className: 'right-[9%] top-[62%]', tone: 'bg-cyan-300' },
    { className: 'left-[38%] bottom-[9%]', tone: 'bg-emerald-200' },
    { className: 'left-[7%] top-[42%]', tone: 'bg-cyan-200' },
  ];

  return (
    <div className="relative mx-auto aspect-[1.2/1] w-full max-w-[330px]" role="img" aria-label="Research signal network visualization">
      <span className="absolute left-0 top-0 font-mono text-[9px] tracking-[0.24em] text-slate-500">RESEARCH SIGNAL / 01</span>
      <div className="absolute inset-x-[12%] top-1/2 h-px rotate-[19deg] bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
      <div className="absolute inset-x-[10%] top-1/2 h-px -rotate-[29deg] bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent" />
      <div className="absolute left-[18%] top-[35%] h-px w-[64%] rotate-[7deg] bg-cyan-300/20" />
      <div className="absolute left-[39%] top-[14%] h-[72%] w-px rotate-[34deg] bg-emerald-300/20" />
      {nodes.map((node) => <span key={node.className} className={`absolute size-1.5 rounded-full ${node.tone} shadow-[0_0_12px_currentColor]`} style={{ color: node.tone.includes('emerald') ? '#6ee7b7' : '#67e8f9' }} />)}
      <div className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/70 bg-emerald-300/10 shadow-[0_0_24px_rgba(110,231,183,0.45)] motion-safe:animate-pulse" />
      <div className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200" />
      <span className="absolute bottom-0 right-0 font-mono text-[9px] tracking-[0.24em] text-slate-600">CONNECTED / 07 NODES</span>
    </div>
  );
}

export default function ResearchSection() {
  const { research } = useCMSData();
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const featured = research[0];
  const remaining = research.slice(1);

  const openPaper = (paper: ResearchPaper) => {
    soundFx.playHologram();
    setSelectedPaper(paper);
  };

  const copyCitation = (paper: ResearchPaper, event?: React.MouseEvent) => {
    event?.stopPropagation();
    soundFx.playClick();
    if (!paper.citationBibtex) return;
    navigator.clipboard.writeText(paper.citationBibtex);
    setCopiedId(paper.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="research" className="relative overflow-hidden bg-transparent py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-15" />
      <div className="pointer-events-none absolute left-1/3 top-1/3 h-96 w-96 bg-cyan-600/10 blur-[150px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-cyan-300"><BookMarked className="size-3.5" />SIGNALING INNOVATIONS &amp; DISCOVERY</div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">RESEARCHING WHAT <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">COMES NEXT</span></h2>
            <p className="max-w-xl font-sans text-sm leading-relaxed text-slate-400 sm:text-base">Undergraduate and graduate students authoring peer-reviewed discoveries accepted at top international AI and robotics venues.</p>
          </div>
          <Link href="/research" onClick={() => soundFx.playClick()} className="group inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.14em] text-cyan-400 transition-colors hover:text-cyan-300 md:self-auto">All Publications <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
        </header>

        {featured && <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 border-y border-cyan-400/20 py-8 sm:py-10"><div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16"><div><div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" />Featured Research</div><h3 className="mb-4 max-w-3xl font-mono text-2xl font-bold leading-tight text-white sm:text-4xl">{featured.title}</h3><p className="mb-3 font-mono text-xs text-slate-400">{featured.authors.join(' · ')}</p><p className="mb-6 max-w-2xl font-sans text-sm leading-relaxed text-slate-300">{featured.abstract}</p><div className="mb-7 flex flex-wrap gap-2">{featured.keywords.map((keyword) => <span key={keyword} className="border border-slate-700 bg-slate-950/60 px-2.5 py-1 font-mono text-[10px] text-slate-400">{keyword}</span>)}</div><button type="button" onClick={() => openPaper(featured)} className="group inline-flex items-center gap-2 border border-cyan-400/50 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-300 transition-colors hover:bg-cyan-400/10">Read Paper <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" /></button></div><ResearchSignal /></div><div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-800/80 pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500"><span>01</span><span className="text-slate-700">/</span><span>{featured.domain}</span><span className="text-slate-700">/</span><span>{featured.year}</span><span className="text-slate-700">/</span><span>Research Paper</span></div></motion.div>}

        <nav aria-label="Research areas" className="mb-12 grid grid-cols-2 border-y border-slate-800/80 sm:grid-cols-4">{['Computer Vision', 'AI Agents', 'Robotics', 'Generative AI'].map((area, index) => <a key={area} href="#research-publications" className="group border-slate-800/80 px-3 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 transition-colors hover:bg-cyan-400/5 hover:text-cyan-300 sm:border-r sm:px-5 sm:last:border-r-0"><span className="mr-2 text-cyan-400/70">0{index + 1}</span>{area}<ArrowRight className="ml-2 inline-block size-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" /></a>)}</nav>

        <div id="research-publications"><div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500"><span>Other Publications</span><span>{String(remaining.length).padStart(2, '0')} Signals Logged</span></div><div className="divide-y divide-slate-800/80 border-y border-slate-800/80">{remaining.map((paper, index) => <motion.button type="button" key={paper.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} onClick={() => openPaper(paper)} onMouseEnter={() => soundFx.playHover()} className="group grid w-full gap-3 px-2 py-6 text-left transition-colors hover:bg-cyan-400/[0.035] sm:grid-cols-[100px_125px_1fr_auto] sm:items-center sm:gap-5 sm:px-3"><span className="font-mono text-[10px] text-slate-500">{paper.year}</span><span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/80">{paper.domain}</span><span><strong className="block font-mono text-sm font-semibold text-slate-200 transition-colors group-hover:text-cyan-300">{paper.title}</strong><span className="mt-1 block max-w-2xl font-sans text-xs leading-relaxed text-slate-500">{paper.abstract}</span></span><span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-cyan-400">Read Paper <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" /></span></motion.button>)}</div></div>

        <AnimatePresence>{selectedPaper && <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPaper(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md" /><motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-500/40 bg-[#0a0a0a] p-6 font-mono text-xs sm:p-8"><div className="mb-4 flex items-center justify-between border-b border-cyan-500/20 pb-4"><div><span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">{selectedPaper.status} · {selectedPaper.conference || `${selectedPaper.year} Preprint`}</span><h3 className="mt-1 text-lg font-bold text-white sm:text-xl">{selectedPaper.title}</h3></div><button type="button" aria-label="Close publication details" onClick={() => setSelectedPaper(null)} className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-white"><X className="size-5" /></button></div><div className="flex flex-col gap-4"><div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-[11px]"><span className="mb-1 block text-[10px] uppercase text-slate-400">Authors</span><p className="font-bold text-cyan-300">{selectedPaper.authors.join(' · ')}</p></div><div><h4 className="mb-2 text-xs font-bold uppercase text-cyan-400">&gt; Abstract</h4><p className="font-sans text-sm leading-relaxed text-slate-300">{selectedPaper.abstract}</p></div>{selectedPaper.citationBibtex && <div><div className="mb-1.5 flex items-center justify-between"><h4 className="text-xs font-bold uppercase text-cyan-400">&gt; BibTeX Citation</h4><button type="button" onClick={(event) => copyCitation(selectedPaper, event)} className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300"><Copy className="size-3" />{copiedId === selectedPaper.id ? 'Copied!' : 'Copy BibTeX'}</button></div><pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3 text-[10px] text-slate-300">{selectedPaper.citationBibtex}</pre></div>}<div className="flex items-center justify-between border-t border-cyan-500/20 pt-4">{selectedPaper.codeUrl && <a href={selectedPaper.codeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 font-bold text-black transition-colors hover:bg-cyan-400">Access Code Repository <ExternalLink className="size-3.5" /></a>}<button type="button" onClick={() => setSelectedPaper(null)} className="text-slate-400 hover:text-white">Close</button></div></div></motion.div></div>}</AnimatePresence>
      </div>
    </section>
  );
}
