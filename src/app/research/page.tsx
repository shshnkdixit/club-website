'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, ArrowLeft, Copy, Check, ExternalLink, X, Search, FileText } from 'lucide-react';
import { ResearchPaper } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function ResearchPage() {
  const { research } = useCMSData();
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResearch = research.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
    <div className="min-h-screen bg-transparent text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-cyan-600/10 blur-[170px] pointer-events-none" />

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
              RESEARCH PUBLICATIONS & PREPRINTS
            </h1>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search papers or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResearch.map((paper, idx) => (
            <motion.div
              key={paper.id}
              id={paper.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => handleOpenPaper(paper)}
              onMouseEnter={() => soundFx.playHover()}
              className="group cursor-pointer p-6 sm:p-8 rounded-3xl bg-[#0B1020]/80 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400/60 shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(0,207,255,0.2)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
                    {paper.status} • {paper.conference || `${paper.year} Preprint`}
                  </span>

                  {paper.metrics && (
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {paper.metrics.label}: <strong>{paper.metrics.value}</strong>
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 leading-snug">
                  {paper.title}
                </h3>

                <p className="text-xs text-slate-400 font-mono mb-3">
                  Authors: <span className="text-slate-300">{paper.authors.join(', ')}</span>
                </p>

                <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed mb-4">
                  {paper.abstract}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {paper.keywords.map(kw => (
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

        {/* Paper Detail Modal */}
        <AnimatePresence>
          {selectedPaper && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pt-24 sm:pt-28 pb-8 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPaper(null)}
                className="fixed inset-0 bg-black/90 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-2xl max-h-[85vh] my-auto bg-[#0B1020] border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,207,255,0.4)] z-10 font-mono text-xs overflow-y-auto space-y-4"
              >
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">
                      {selectedPaper.status} • {selectedPaper.conference || `${selectedPaper.year} Preprint`}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
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

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block mb-1">AUTHORS</span>
                  <p className="text-cyan-300 font-bold">{selectedPaper.authors.join(' • ')}</p>
                </div>

                <p className="text-slate-300 text-sm font-sans leading-relaxed">
                  {selectedPaper.abstract}
                </p>

                {selectedPaper.citationBibtex && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-cyan-400 font-bold text-xs uppercase">&gt; BIBTEX CITATION</span>
                      <button
                        onClick={(e) => handleCopyCitation(selectedPaper, e)}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedId === selectedPaper.id ? 'Copied' : 'Copy'}</span>
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
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
