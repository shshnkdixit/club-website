'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookOpen,
  Video,
  FileText,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  GitBranch,
  ExternalLink,
  ArrowLeft,
  Filter,
  CheckCircle2,
  FolderOpen,
  Code2,
  Globe,
  Share2,
  Bookmark,
  Zap,
  Check
} from 'lucide-react';
import { Resource, ResourceCategory, ResourceType } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function ResourcesPage() {
  const { resources } = useCMSData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Category Filter Pills
  const categoryFilters = [
    { label: 'ALL', value: 'ALL' },
    { label: 'AI', value: 'AI' },
    { label: 'MACHINE LEARNING', value: 'Machine Learning' },
    { label: 'PYTHON', value: 'Python' },
    { label: 'GIT & GITHUB', value: 'Git & GitHub' },
    { label: 'GENERATIVE AI', value: 'Generative AI' },
    { label: 'COMPUTER VISION', value: 'Computer Vision' },
    { label: 'DATA SCIENCE', value: 'Data Science' },
  ];

  // Resource Medium Types
  const typeFilters: ('ALL' | ResourceType)[] = [
    'ALL',
    'Course',
    'Video',
    'Article',
    'Documentation',
    'Tutorial',
    'Tool'
  ];

  // Real-Time Multi-Field Search Engine
  // Evaluates live on keystroke across Title, Description, Category, and Author / Platform
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // Category Match
      const matchesCategory = selectedCategory === 'ALL' || 
        res.category.toLowerCase() === selectedCategory.toLowerCase();

      // Type Match
      const matchesType = selectedType === 'ALL' || 
        res.type.toLowerCase() === selectedType.toLowerCase();

      // Search Query Match (Title, Description, Category, Author)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === '' ||
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.category.toLowerCase().includes(q) ||
        res.author.toLowerCase().includes(q) ||
        res.tags.some(t => t.toLowerCase().includes(q));

      return matchesCategory && matchesType && matchesSearch;
    });
  }, [resources, selectedCategory, selectedType, searchQuery]);

  const handleCopyLink = (res: Resource, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    soundFx.playClick();
    navigator.clipboard.writeText(res.url);
    setCopiedId(res.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDomainIcon = (category: ResourceCategory, iconName?: string) => {
    switch (category) {
      case 'AI':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Machine Learning':
        return <Zap className="w-5 h-5 text-violet-400" />;
      case 'Python':
        return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'Git & GitHub':
        return <GitBranch className="w-5 h-5 text-orange-400" />;
      case 'Generative AI':
        return <Sparkles className="w-5 h-5 text-fuchsia-400" />;
      case 'Computer Vision':
        return <Layers className="w-5 h-5 text-blue-400" />;
      case 'Data Science':
        return <BookOpen className="w-5 h-5 text-teal-400" />;
      default:
        return <Code2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getTypeBadgeStyle = (type: ResourceType) => {
    switch (type) {
      case 'Course':
        return 'bg-violet-950/80 text-violet-300 border-violet-500/40';
      case 'Video':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      case 'Article':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
      case 'Documentation':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      case 'Tutorial':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'Tool':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 font-mono selection:bg-violet-500 selection:text-white">
      {/* Background Cyber Glow Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-violet-600/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 sm:space-y-12">
        {/* Header & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-violet-500/20 pb-6">
          <div>
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-violet-300 transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to AI Lab Hub</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-violet-950/80 border border-violet-500/40 text-violet-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <FolderOpen className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
                  KNOWLEDGE VAULT
                </h1>
                <p className="text-xs sm:text-sm text-violet-300/80 mt-1 font-sans">
                  Centralized learning repository with curated study masterclasses, interactive docs, and AI engineering playbooks.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="px-4 py-2.5 rounded-2xl bg-[#070D1F] border border-violet-500/30 text-center shadow-[0_0_12px_rgba(0,0,0,0.4)]">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">TOTAL RESOURCES</span>
              <strong className="text-sm sm:text-base font-black text-violet-300 font-mono">{resources.length} Curated</strong>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#070D1F] border border-cyan-500/30 text-center shadow-[0_0_12px_rgba(0,0,0,0.4)]">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">DOMAINS</span>
              <strong className="text-sm sm:text-base font-black text-cyan-300 font-mono">8 Disciplines</strong>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 🔍 A. REAL-TIME MULTI-FIELD SEARCH ENGINE */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-violet-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, domain, or creator (e.g. Karpathy, LangChain, PyTorch, YOLO)..."
              className="w-full bg-[#080B18]/90 border-2 border-violet-500/30 focus:border-violet-400 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 shadow-[0_0_25px_rgba(124,58,237,0.15)] transition-all font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* 🏷️ B. DOMAIN CATEGORY FILTERING PILLS */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold mr-1 shrink-0">
                DOMAIN:
              </span>
              {categoryFilters.map((cat) => {
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => { soundFx.playClick(); setSelectedCategory(cat.value); }}
                    className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap border cursor-pointer font-bold ${
                      isSelected
                        ? 'bg-violet-500/25 text-violet-300 border-violet-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    [{cat.label}]
                  </button>
                );
              })}
            </div>

            {/* ────────────────────────────────────────────────────────── */}
            {/* 📂 C. RESOURCE TYPE CLASSIFICATION PILLS */}
            {/* ────────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold mr-1 shrink-0">
                MEDIUM:
              </span>
              {typeFilters.map((t) => {
                const isSelected = selectedType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { soundFx.playClick(); setSelectedType(t); }}
                    className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap border text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,207,255,0.3)]'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 🎴 D. CYBER QUEST CARD GRID (.quest-card) */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{filteredResources.length}</strong> study resources
            </span>
            {(selectedCategory !== 'ALL' || selectedType !== 'ALL' || searchQuery !== '') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedType('ALL');
                  setSearchQuery('');
                  soundFx.playClick();
                }}
                className="text-violet-400 hover:text-violet-200 text-xs underline cursor-pointer"
              >
                Reset all filters
              </button>
            )}
          </div>

          {filteredResources.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-[#080B18]/90 border border-slate-800 text-slate-400 space-y-3">
              <FolderOpen className="w-12 h-12 mx-auto text-slate-600" />
              <h3 className="text-lg font-bold text-slate-300">No matching study resources found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
                Try loosening your search terms or select [ALL] to explore the complete Knowledge Vault curriculum library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res) => {
                return (
                  <motion.div
                    key={res.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="quest-card group relative flex flex-col justify-between rounded-3xl bg-[#070A18]/95 border border-violet-500/20 hover:border-violet-400 p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.25)] hover:-translate-y-1 overflow-hidden"
                  >
                    {/* 1. Neon Gradient Top Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7c3aed] via-[#d946ef] to-[#00f0ff] opacity-80 group-hover:opacity-100 transition-opacity" />

                    <div className="space-y-4">
                      {/* Top Row: Category & Type Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {/* 3. Glowing Domain Icon */}
                          <div className="p-2 rounded-xl bg-violet-950/60 border border-violet-500/30 shadow-[0_0_10px_rgba(124,58,237,0.25)]">
                            {getDomainIcon(res.category, res.iconName)}
                          </div>
                          <span className="text-xs font-bold text-slate-300">
                            {res.category}
                          </span>
                        </div>

                        {/* 2. Type Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${getTypeBadgeStyle(res.type)}`}>
                          [{res.type}]
                        </span>
                      </div>

                      {/* 4. Resource Title */}
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#a855f7] transition-colors leading-snug">
                          {res.title}
                        </h3>
                        {/* 5. Detailed Summary */}
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3 font-sans">
                          {res.description}
                        </p>
                      </div>

                      {/* 6. Author / Source Attribution */}
                      <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1">
                        <span>
                          By <strong className="text-slate-200">{res.author}</strong>
                        </span>
                        {res.featured && (
                          <span className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-[9px] font-bold">
                            ⭐ FEATURED
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {res.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 7. Chamfered Launch Button (.btn-cyber-outline) */}
                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCopyLink(res, e)}
                        className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-violet-500/40 text-slate-400 hover:text-violet-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        title="Copy Link"
                      >
                        {copiedId === res.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{copiedId === res.id ? 'Copied' : 'Share'}</span>
                      </button>

                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => soundFx.playClick()}
                        className="btn-cyber-outline flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-black transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center gap-1.5 cursor-pointer transform hover:scale-[1.02] active:scale-95 text-center"
                      >
                        <span>Launch Resource</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
