'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, Check, ExternalLink, Sparkles, X, ArrowRight, BookMarked, Layers } from 'lucide-react';
import { ResearchPaper } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function ResearchSection() {
  const { research } = useCMSData();
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCitation = (paper: ResearchPaper, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    if (paper.citationBibtex) {
      navigator.clipboard.writeText(paper.citationBibtex);
      setCopiedId(paper.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleOpenPaper = (paper: ResearchPaper) => {
    soundFx.playHologram();
    setSelectedPaper(paper);
  };

  return (
    <section id="research" className="relative py-24 sm:py-32 bg-transparent overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              <BookMarked className="w-3.5 h-3.5" />
              <span>SCHOLARLY PUBLICATIONS & DISCOVERY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              RESEARCHING WHAT{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                COMES NEXT
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-sans max-w-xl">
              Undergraduate and graduate students authoring peer-reviewed discoveries accepted at top international AI and robotics venues.
            </p>
          </div>

          <Link
            href="/research"
            onClick={() => soundFx.playClick()}
            className="self-start md:self-auto inline-flex items-center gap-2 font-mono text-xs text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <span>All Publications & Preprints</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {research.map((paper, idx) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => handleOpenPaper(paper)}
              onMouseEnter={() => soundFx.playHover()}
              className="lab-card group cursor-pointer rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                {/* Status & Conference */}
                <div className="flex items-center justify-between mb-4 font-mono text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    paper.status === 'Published'
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                      : paper.status === 'Under Review'
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                      : 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                  }`}>
                    {paper.status} {paper.conference ? `• ${paper.conference}` : `• ${paper.year}`}
                  </span>

                  {paper.metrics && (
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {paper.metrics.label}: <strong>{paper.metrics.value}</strong>
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white font-mono group-hover:text-cyan-300 transition-colors mb-2 leading-snug">
                  {paper.title}
                </h3>

                <p className="text-xs text-slate-400 font-mono mb-3">
                  Authors: <span className="text-slate-300">{paper.authors.join(', ')}</span>
                </p>

                <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed mb-4">
                  {paper.abstract}
                </p>
              </div>

              {/* Card Footer: Keywords & Citation Copy */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {paper.keywords.slice(0, 3).map(kw => (
                    <span key={kw} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {kw}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {paper.citationBibtex && (
                    <button
                      onClick={(e) => handleCopyCitation(paper, e)}
                      title="Copy BibTeX Citation"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      {copiedId === paper.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                  <span className="text-cyan-400 font-bold flex items-center gap-1 text-[11px]">
                    <span>Read Paper</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Paper Abstract & Citation Reader Modal */}
        <AnimatePresence>
          {selectedPaper && (
            <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPaper(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-none z-10 font-mono text-xs overflow-y-auto max-h-[85vh]"
              >
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      {selectedPaper.status} • {selectedPaper.conference || `${selectedPaper.year} Preprint`}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                      {selectedPaper.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedPaper(null)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 font-mono">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
                    <span className="text-slate-400 uppercase text-[10px] block mb-1">AUTHORS</span>
                    <p className="text-cyan-300 font-bold">{selectedPaper.authors.join(' • ')}</p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-cyan-400 font-bold mb-2">
                      &gt; ABSTRACT
                    </h4>
                    <p className="text-slate-300 text-sm font-sans leading-relaxed">
                      {selectedPaper.abstract}
                    </p>
                  </div>

                  {selectedPaper.citationBibtex && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs uppercase text-cyan-400 font-bold">
                          &gt; BIBTEX CITATION
                        </h4>
                        <button
                          onClick={(e) => handleCopyCitation(selectedPaper, e)}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedId === selectedPaper.id ? 'Copied!' : 'Copy BibTeX'}</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-300 overflow-x-auto">
                        {selectedPaper.citationBibtex}
                      </pre>
                    </div>
                  )}

                  <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between">
                    {selectedPaper.codeUrl && (
                      <a
                        href={selectedPaper.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold flex items-center gap-2 hover:bg-cyan-400 transition-colors"
                      >
                        <span>Access Code Repository</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedPaper(null)}
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
    </section>
  );
}
