'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Terminal,
  Trophy,
  Flame,
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Send,
  HelpCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Zap,
  Users,
  Award,
  X,
  FileCode,
  AlertCircle,
  Crown,
  Medal
} from 'lucide-react';
import { CodingQuest, QuestCategory, QuestDifficulty, QuestSubmission } from '@/types';
import { useCMSData, cmsStore } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function ChallengesPage() {
  const { quests, submissions } = useCMSData();
  const [selectedQuest, setSelectedQuest] = useState<CodingQuest | null>(null);
  const [submissionModalQuest, setSubmissionModalQuest] = useState<CodingQuest | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'leaderboard' | 'submissions'>('matrix');

  // Compute Dynamic XP Leaderboard based on verified submissions & awarded marks
  const leaderboard = useMemo(() => {
    const userMap: Record<string, {
      studentUID: string;
      studentName: string;
      totalXP: number;
      questsSolved: number;
      pendingCount: number;
      verifiedSubmissions: QuestSubmission[];
      lastActive: string;
    }> = {};

    submissions.forEach(sub => {
      const uid = (sub.studentUID || '').trim().toUpperCase();
      if (!uid) return;

      if (!userMap[uid]) {
        userMap[uid] = {
          studentUID: uid,
          studentName: sub.studentName,
          totalXP: 0,
          questsSolved: 0,
          pendingCount: 0,
          verifiedSubmissions: [],
          lastActive: sub.submittedAt
        };
      }

      if (sub.status === 'Verified') {
        const quest = quests.find(q => q.id === sub.questId);
        const marks = sub.pointsAwarded !== undefined ? sub.pointsAwarded : (quest?.bountyPoints || 100);
        userMap[uid].totalXP += marks;
        userMap[uid].questsSolved += 1;
        userMap[uid].verifiedSubmissions.push(sub);
      } else if (sub.status === 'Pending Review') {
        userMap[uid].pendingCount += 1;
      }

      if (new Date(sub.submittedAt).getTime() > new Date(userMap[uid].lastActive).getTime()) {
        userMap[uid].lastActive = sub.submittedAt;
      }
    });

    return Object.values(userMap).sort((a, b) => {
      if (b.totalXP !== a.totalXP) return b.totalXP - a.totalXP;
      return b.questsSolved - a.questsSolved;
    });
  }, [submissions, quests]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Active Problem of the Week
  const potw = useMemo(() => {
    return quests.find(q => q.isProblemOfTheWeek) || quests[0];
  }, [quests]);

  // Live Countdown Timer for Problem of the Week
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const targetDate = potw?.expiresAt ? new Date(potw.expiresAt).getTime() : new Date('2026-08-28T23:59:59').getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [potw]);

  // Submission Form State
  const [studentName, setStudentName] = useState('');
  const [studentUID, setStudentUID] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [solutionNotes, setSolutionNotes] = useState('');
  const [submittedCode, setSubmittedCode] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<QuestSubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Code Copy State
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTestCaseIdx, setCopiedTestCaseIdx] = useState<number | null>(null);
  const [expandedHints, setExpandedHints] = useState<number[]>([]);

  const categories = [
    'All',
    'Python & NumPy',
    'PyTorch & Deep Learning',
    'Computer Vision',
    'NLP & LLMs',
    'Reinforcement Learning',
    'Autonomous Agents'
  ];

  const difficulties: ('All' | QuestDifficulty)[] = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredQuests = useMemo(() => {
    return quests.filter(q => {
      const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
      const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      const matchSearch = searchQuery === '' || 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.shortSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchDiff && matchSearch;
    });
  }, [quests, selectedCategory, selectedDifficulty, searchQuery]);

  const totalBountyPool = useMemo(() => {
    return quests.reduce((acc, q) => acc + q.bountyPoints, 0);
  }, [quests]);

  const totalSolvers = useMemo(() => {
    return quests.reduce((acc, q) => acc + (q.solversCount || 0), 0);
  }, [quests]);

  const handleOpenQuest = (quest: CodingQuest) => {
    soundFx.playHologram();
    setSelectedQuest(quest);
    setExpandedHints([]);
  };

  const handleOpenSubmitModal = (quest: CodingQuest, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    soundFx.playClick();
    setSubmissionModalQuest(quest);
    setSubmissionSuccess(null);
    setFormError('');
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModalQuest) return;

    if (!studentName.trim() || !studentUID.trim() || !githubRepoUrl.trim()) {
      setFormError('Please fill in all required fields (Name, Student UID, and GitHub Repository URL).');
      soundFx.playError();
      return;
    }

    if (!githubRepoUrl.startsWith('http')) {
      setFormError('Please provide a valid GitHub or Gist URL starting with https://');
      soundFx.playError();
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    setTimeout(() => {
      const newSubmission: QuestSubmission = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        questId: submissionModalQuest.id,
        questTitle: submissionModalQuest.title,
        studentName: studentName.trim(),
        studentUID: studentUID.trim().toUpperCase(),
        githubRepoUrl: githubRepoUrl.trim(),
        solutionNotes: solutionNotes.trim(),
        submittedCode: submittedCode.trim() || undefined,
        status: 'Pending Review',
        submittedAt: new Date().toISOString(),
        pointsAwarded: submissionModalQuest.bountyPoints
      };

      cmsStore.saveSubmission(newSubmission);
      soundFx.playCelebration();
      setSubmissionSuccess(newSubmission);
      setIsSubmitting(false);

      // Reset fields
      setSolutionNotes('');
      setSubmittedCode('');
    }, 600);
  };

  const copyStarterCode = (code: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyTestCase = (input: string, idx: number) => {
    soundFx.playClick();
    navigator.clipboard.writeText(input);
    setCopiedTestCaseIdx(idx);
    setTimeout(() => setCopiedTestCaseIdx(null), 2000);
  };

  const toggleHint = (idx: number) => {
    soundFx.playClick();
    setExpandedHints(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const getDifficultyBadge = (difficulty: QuestDifficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
      case 'Medium':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
      case 'Hard':
        return 'bg-rose-950/80 border-rose-500/50 text-rose-300';
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Ambient Cyber Grid & Glow */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-600/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-fuchsia-600/10 blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 sm:space-y-12">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-cyan-500/20 pb-6">
          <div>
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-300 transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to AI Lab Hub</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,207,255,0.3)]">
                <Code2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide flex items-center gap-3">
                  CODING QUESTS & CHALLENGES
                </h1>
                <p className="text-xs sm:text-sm text-cyan-300/80 mt-1">
                  Master deep learning, computer vision, algorithms, and autonomous agents through hands-on technical problem solving.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 self-start md:self-auto w-full md:w-auto">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-center shadow-[0_0_12px_rgba(0,0,0,0.4)]">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">TOTAL BOUNTY</span>
              <strong className="text-sm sm:text-base font-black text-cyan-300">{totalBountyPool} XP</strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-center shadow-[0_0_12px_rgba(0,0,0,0.4)]">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">QUESTS</span>
              <strong className="text-sm sm:text-base font-black text-amber-300">{quests.length} Active</strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-center shadow-[0_0_12px_rgba(0,0,0,0.4)]">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">SOLVERS</span>
              <strong className="text-sm sm:text-base font-black text-emerald-300">{totalSolvers} Solves</strong>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 🌟 PROBLEM OF THE WEEK BANNER (Featured Weekly Challenge) */}
        {/* ────────────────────────────────────────────────────────── */}
        {potw && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A1226] via-[#0E1B38] to-[#0D152B] border-2 border-yellow-500/50 shadow-[0_0_35px_rgba(234,179,8,0.2)] p-6 sm:p-8"
          >
            {/* Ambient Background Corner Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 blur-[90px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/80 text-yellow-300 text-xs font-black tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(234,179,8,0.4)] animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" /> PROBLEM OF THE WEEK
                  </span>
                  <span className="px-3 py-1 rounded-full bg-yellow-950/80 border border-yellow-500/40 text-yellow-300 text-xs font-bold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> 500 BOUNTY XP MULTIPLIER
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getDifficultyBadge(potw.difficulty)}`}>
                    {potw.difficulty.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide">
                    {potw.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {potw.shortSummary}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {potw.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-cyan-300 text-[10px] font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Countdown Timer & CTA */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-yellow-500/30 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
                <div className="space-y-1.5">
                  <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> CHALLENGE EXPIRES IN:
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-center">
                    <div className="bg-slate-900 border border-yellow-500/40 px-2.5 py-1.5 rounded-lg">
                      <span className="text-base sm:text-lg font-black text-white block">{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className="text-[9px] text-slate-400 uppercase block">DAYS</span>
                    </div>
                    <span className="text-yellow-400 font-bold">:</span>
                    <div className="bg-slate-900 border border-yellow-500/40 px-2.5 py-1.5 rounded-lg">
                      <span className="text-base sm:text-lg font-black text-white block">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-[9px] text-slate-400 uppercase block">HRS</span>
                    </div>
                    <span className="text-yellow-400 font-bold">:</span>
                    <div className="bg-slate-900 border border-yellow-500/40 px-2.5 py-1.5 rounded-lg">
                      <span className="text-base sm:text-lg font-black text-white block">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="text-[9px] text-slate-400 uppercase block">MIN</span>
                    </div>
                    <span className="text-yellow-400 font-bold">:</span>
                    <div className="bg-slate-900 border border-yellow-500/40 px-2.5 py-1.5 rounded-lg">
                      <span className="text-base sm:text-lg font-black text-yellow-300 block">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="text-[9px] text-slate-400 uppercase block">SEC</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => handleOpenQuest(potw)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Terminal className="w-4 h-4" /> Solve Weekly Quest
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleOpenSubmitModal(potw, e)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-yellow-500/40 text-yellow-300 font-bold text-xs transition-all cursor-pointer"
                    title="Submit Solution"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* VIEW TABS & MATRIX CONTROLS */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* View Switcher */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-1 rounded-2xl border border-cyan-500/20 self-start">
              <button
                type="button"
                onClick={() => { soundFx.playClick(); setActiveTab('matrix'); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'matrix'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,207,255,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Active Quests ({quests.length})
              </button>
              <button
                type="button"
                onClick={() => { soundFx.playCelebration(); setActiveTab('leaderboard'); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'leaderboard'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Hacker Leaderboard ({leaderboard.length})
              </button>
              <button
                type="button"
                onClick={() => { soundFx.playClick(); setActiveTab('submissions'); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'submissions'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,207,255,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Submissions Feed ({submissions.length})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quests by name, topic, or tag..."
                className="w-full bg-[#0a0a0a]/90 border border-cyan-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
              />
            </div>
          </div>

          {/* Filter Pills */}
          {activeTab === 'matrix' && (
            <div className="space-y-2">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold mr-1 shrink-0">Domain:</span>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { soundFx.playClick(); setSelectedCategory(cat); }}
                      className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap border cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_12px_rgba(0,207,255,0.3)]'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Difficulty Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold mr-1 shrink-0">Difficulty:</span>
                {difficulties.map((diff) => {
                  const isSelected = selectedDifficulty === diff;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => { soundFx.playClick(); setSelectedDifficulty(diff); }}
                      className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap border text-xs cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 text-white border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,207,255,0.2)]'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* QUEST MATRIX GRID */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === 'matrix' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.map((quest) => {
              return (
                <motion.div
                  key={quest.id}
                  id={quest.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative flex flex-col justify-between rounded-3xl bg-[#090E1F]/90 border border-cyan-500/25 hover:border-cyan-400 p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,207,255,0.2)] hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    {/* Top Row: Difficulty & Points */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getDifficultyBadge(quest.difficulty)}`}>
                          {quest.difficulty.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {quest.category}
                        </span>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-black shadow-[0_0_10px_rgba(0,207,255,0.2)] flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" /> {quest.bountyPoints} XP
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {quest.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                        {quest.shortSummary}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {quest.tags.slice(0, 4).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{quest.solversCount || 0} Solves</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenQuest(quest)}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 hover:text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,207,255,0.2)] cursor-pointer flex items-center gap-1"
                      >
                        <Code2 className="w-3.5 h-3.5" /> Inspect
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleOpenSubmitModal(quest, e)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                        title="Submit Solution"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* 🏆 GLOBAL XP HACKER LEADERBOARD VIEW */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            {/* Leaderboard Header Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0C142B] via-[#0E1E3D] to-[#0A1224] border-2 border-yellow-500/40 shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-xs font-black tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(234,179,8,0.3)] animate-pulse">
                    <Trophy className="w-3.5 h-3.5" /> GLOBAL BOUNTY MATRIX
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono">
                    LIVE AUTOMATED GRADING
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Hacker Hall of Fame & XP Standings
                </h3>
                <p className="text-xs text-slate-300">
                  XP points accumulate dynamically as soon as faculty and admins grade and verify coding quest submissions.
                </p>
              </div>

              {/* Aggregated Totals */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-yellow-500/40 text-center min-w-[110px]">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">TOTAL XP AWARDED</span>
                  <strong className="text-base font-black text-yellow-300 font-mono">
                    {leaderboard.reduce((acc, u) => acc + u.totalXP, 0)} XP
                  </strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/40 text-center min-w-[110px]">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">RANKED HACKERS</span>
                  <strong className="text-base font-black text-cyan-300 font-mono">
                    {leaderboard.length} Students
                  </strong>
                </div>
              </div>
            </div>

            {/* Top 3 Podium Cards */}
            {leaderboard.length >= 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* 🥈 Rank 2 (Silver) */}
                {leaderboard[1] ? (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="order-2 md:order-1 p-6 rounded-3xl bg-[#080E21] border border-cyan-400/40 shadow-[0_0_25px_rgba(0,207,255,0.15)] space-y-3 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-2xl bg-slate-800 border border-slate-600 text-slate-200 font-black text-sm flex items-center justify-center">
                        🥈 2nd
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                        Master Tier
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white">{leaderboard[1].studentName}</h4>
                      <p className="text-xs text-cyan-300 font-mono">{leaderboard[1].studentUID}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{leaderboard[1].questsSolved} Solved</span>
                      <span className="text-lg font-black text-cyan-300 font-mono">⚡ {leaderboard[1].totalXP} XP</span>
                    </div>
                  </motion.div>
                ) : <div className="order-2 md:order-1" />}

                {/* 🥇 Rank 1 (Gold) */}
                {leaderboard[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="order-1 md:order-2 p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#121E3E] to-[#0A1226] border-2 border-yellow-400 shadow-[0_0_35px_rgba(234,179,8,0.3)] space-y-4 relative overflow-hidden transform md:-translate-y-2"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-2xl bg-yellow-500 text-slate-950 font-black text-base flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                        👑 1st
                      </span>
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400 text-xs font-black animate-pulse">
                        ⭐ Grandmaster
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-black text-white">{leaderboard[0].studentName}</h4>
                      <p className="text-xs text-yellow-300 font-mono">{leaderboard[0].studentUID}</p>
                    </div>
                    <div className="pt-2 border-t border-yellow-500/30 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-bold">{leaderboard[0].questsSolved} Quests Solved</span>
                      <span className="text-2xl font-black text-yellow-300 font-mono">⚡ {leaderboard[0].totalXP} XP</span>
                    </div>
                  </motion.div>
                )}

                {/* 🥉 Rank 3 (Bronze) */}
                {leaderboard[2] ? (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="order-3 p-6 rounded-3xl bg-[#080E21] border border-amber-600/40 shadow-[0_0_25px_rgba(217,119,6,0.15)] space-y-3 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-2xl bg-amber-900/60 border border-amber-600 text-amber-300 font-black text-sm flex items-center justify-center">
                        🥉 3rd
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                        Specialist Tier
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white">{leaderboard[2].studentName}</h4>
                      <p className="text-xs text-amber-300 font-mono">{leaderboard[2].studentUID}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{leaderboard[2].questsSolved} Solved</span>
                      <span className="text-lg font-black text-amber-300 font-mono">⚡ {leaderboard[2].totalXP} XP</span>
                    </div>
                  </motion.div>
                ) : <div className="order-3" />}
              </div>
            )}

            {/* Complete Leaderboard Roster Table */}
            <div className="overflow-x-auto rounded-3xl border border-cyan-500/30 bg-[#070A18]/90 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] border-b border-slate-800 font-bold font-mono">
                  <tr>
                    <th className="p-4 text-center w-16">RANK</th>
                    <th className="p-4">HACKER / STUDENT</th>
                    <th className="p-4">STUDENT UID</th>
                    <th className="p-4 text-center">SOLVED QUESTS</th>
                    <th className="p-4">TIER BADGE</th>
                    <th className="p-4 text-right">TOTAL BOUNTY XP</th>
                    <th className="p-4 text-right">LATEST ACTIVITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-slate-500">
                        No submissions graded yet. Solve quests and get verified by administrators to appear on the leaderboard!
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((user, idx) => {
                      const isFirst = idx === 0;
                      const isSecond = idx === 1;
                      const isThird = idx === 2;

                      return (
                        <tr
                          key={user.studentUID}
                          className={`hover:bg-slate-900/60 transition-colors ${
                            isFirst ? 'bg-yellow-500/5 font-semibold' : ''
                          }`}
                        >
                          <td className="p-4 text-center font-black">
                            {isFirst && <span className="text-yellow-400 text-base">🥇 #1</span>}
                            {isSecond && <span className="text-slate-300 text-base">🥈 #2</span>}
                            {isThird && <span className="text-amber-400 text-base">🥉 #3</span>}
                            {!isFirst && !isSecond && !isThird && <span className="text-slate-500">#{idx + 1}</span>}
                          </td>

                          <td className="p-4">
                            <span className="font-bold text-white block text-sm">{user.studentName}</span>
                            <span className="text-[10px] text-slate-400">
                              {user.verifiedSubmissions.map(s => s.questTitle).slice(0, 2).join(' • ')}
                            </span>
                          </td>

                          <td className="p-4 text-cyan-400 font-bold">{user.studentUID}</td>

                          <td className="p-4 text-center">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs">
                              {user.questsSolved} Verified
                            </span>
                          </td>

                          <td className="p-4">
                            {user.totalXP >= 500 && (
                              <span className="px-2.5 py-0.5 rounded-full bg-yellow-950 text-yellow-300 border border-yellow-500/40 text-[10px] font-bold">
                                ⭐ Grandmaster
                              </span>
                            )}
                            {user.totalXP >= 250 && user.totalXP < 500 && (
                              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                                ⚡ Master
                              </span>
                            )}
                            {user.totalXP < 250 && (
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700 text-[10px] font-bold">
                                🛡️ Apprentice
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <span className="text-base font-black text-yellow-300 font-mono tracking-wide">
                              ⚡ {user.totalXP} XP
                            </span>
                          </td>

                          <td className="p-4 text-right text-slate-400 text-[11px]">
                            {new Date(user.lastActive).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* SUBMISSIONS HISTORY VIEW */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#090E1F]/90 border border-slate-800 text-slate-400 space-y-3">
                <FileCode className="w-12 h-12 mx-auto text-slate-600" />
                <h3 className="text-lg font-bold text-slate-300">No Quests Submitted Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Pick any coding challenge from the Active Quest Matrix, build your solution in Python, and submit your GitHub repo to earn bounty points!
                </p>
                <button
                  type="button"
                  onClick={() => { soundFx.playClick(); setActiveTab('matrix'); }}
                  className="mt-2 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-bold transition-all hover:bg-cyan-500/30 cursor-pointer"
                >
                  Browse Quests Matrix →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => {
                  return (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl bg-[#090E1F]/90 border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_15px_rgba(0,0,0,0.4)]"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                            {sub.questTitle}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                            sub.status === 'Verified' ? 'bg-emerald-950 text-emerald-300 border-emerald-500' :
                            sub.status === 'Needs Revision' ? 'bg-amber-950 text-amber-300 border-amber-500' :
                            'bg-slate-900 text-slate-300 border-slate-700'
                          }`}>
                            {sub.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-medium">
                          Submitted by <strong className="text-white">{sub.studentName}</strong> (UID: {sub.studentUID}) on {new Date(sub.submittedAt).toLocaleDateString()}
                        </div>
                        {sub.solutionNotes && (
                          <p className="text-[11px] text-slate-400 italic">
                            &quot;{sub.solutionNotes}&quot;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-cyan-300 font-mono">
                          +{sub.pointsAwarded || 500} XP
                        </span>
                        <a
                          href={sub.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <span>View Repo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 🔍 DETAILED PROBLEM INSPECTOR MODAL */}
      {/* ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedQuest && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pt-24 sm:pt-28 pb-8 bg-black/90 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] my-auto flex flex-col rounded-3xl bg-[#090E1F] border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(0,207,255,0.25)] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-cyan-500/20 flex items-start justify-between bg-slate-900/80 shrink-0">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getDifficultyBadge(selectedQuest.difficulty)}`}>
                      {selectedQuest.difficulty.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">{selectedQuest.category}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-black">
                      +{selectedQuest.bountyPoints} XP BOUNTY
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {selectedQuest.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => { soundFx.playClick(); setSelectedQuest(null); }}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 font-sans">
                {/* Problem Statement */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    PROBLEM SPECIFICATION
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-line">
                    {selectedQuest.problemStatement}
                  </div>
                </div>

                {/* Input & Output Format */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-cyan-400 font-bold uppercase block">INPUT FORMAT</span>
                    <p className="text-slate-300">{selectedQuest.inputFormat}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-cyan-400 font-bold uppercase block">OUTPUT FORMAT</span>
                    <p className="text-slate-300">{selectedQuest.outputFormat}</p>
                  </div>
                </div>

                {/* Constraints */}
                <div className="space-y-2 font-mono text-xs">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    CONSTRAINTS & TECHNICAL REQUIREMENTS
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    {selectedQuest.constraints.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Sample Test Cases */}
                <div className="space-y-3 font-mono text-xs">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    SAMPLE TEST CASES
                  </h4>
                  <div className="space-y-2.5">
                    {selectedQuest.sampleTestCases.map((tc, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <strong>TEST CASE #{idx + 1}</strong>
                          <button
                            type="button"
                            onClick={() => copyTestCase(tc.input, idx)}
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-200 transition-colors"
                          >
                            {copiedTestCaseIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedTestCaseIdx === idx ? 'Copied' : 'Copy Input'}</span>
                          </button>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-cyan-300 text-[11px] overflow-x-auto">
                          <code>Input: {tc.input}</code>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-emerald-300 text-[11px] overflow-x-auto">
                          <code>Expected Output: {tc.output}</code>
                        </div>
                        {tc.explanation && (
                          <p className="text-[11px] text-slate-400 italic">
                            Explanation: {tc.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Starter Code */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      PYTHON STARTER BOILERPLATE
                    </h4>
                    <button
                      type="button"
                      onClick={() => copyStarterCode(selectedQuest.starterCode.python)}
                      className="flex items-center gap-1 text-xs text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 transition-all cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Boilerplate Copied!' : 'Copy Starter Code'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/20 text-cyan-100 text-xs overflow-x-auto leading-relaxed">
                    <code>{selectedQuest.starterCode.python}</code>
                  </pre>
                </div>

                {/* Hints Accordion */}
                {selectedQuest.hints && selectedQuest.hints.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" /> ARCHITECTURAL HINTS
                    </h4>
                    <div className="space-y-1.5">
                      {selectedQuest.hints.map((hint, idx) => {
                        const isExpanded = expandedHints.includes(idx);
                        return (
                          <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => toggleHint(idx)}
                              className="w-full p-3 text-left font-bold text-slate-300 hover:text-white flex items-center justify-between transition-colors"
                            >
                              <span>Hint #{idx + 1}</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>
                            {isExpanded && (
                              <div className="p-3 pt-0 text-slate-400 text-xs border-t border-slate-900">
                                {hint}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-cyan-500/20 bg-slate-900/90 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedQuest(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const q = selectedQuest;
                    setSelectedQuest(null);
                    handleOpenSubmitModal(q);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black transition-all shadow-[0_0_20px_rgba(0,207,255,0.4)] flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Submit Solution & Claim Bounty
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 🚀 SOLUTION SUBMISSION MODAL */}
      {/* ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {submissionModalQuest && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pt-24 sm:pt-28 pb-8 bg-black/90 backdrop-blur-xl overflow-y-auto font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl max-h-[85vh] my-auto rounded-3xl bg-[#090E1F] border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(0,207,255,0.3)] overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">SUBMIT SOLUTION</h3>
                    <span className="text-[10px] text-cyan-300 block">
                      {submissionModalQuest.title} (+{submissionModalQuest.bountyPoints} XP)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSubmissionModalQuest(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form / Success State */}
              <div className="p-6">
                {submissionSuccess ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white">SOLUTION DISPATCHED!</h4>
                      <p className="text-xs text-slate-300">
                        Your solution has been submitted for peer review and bounty point verification.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1 font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>SUBMISSION ID:</span>
                        <strong className="text-cyan-300">{submissionSuccess.id}</strong>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>STUDENT:</span>
                        <strong className="text-white">{submissionSuccess.studentName} ({submissionSuccess.studentUID})</strong>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>STATUS:</span>
                        <strong className="text-emerald-400 font-bold">PENDING REVIEW</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmissionModalQuest(null);
                          setActiveTab('submissions');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        View My Submissions →
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitSolution} className="space-y-4 text-xs">
                    {formError && (
                      <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-300 font-bold uppercase">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="e.g. Alex Morgan"
                          className="w-full bg-[#0a0a0a] border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-300 font-bold uppercase">
                          Student UID / Roll No *
                        </label>
                        <input
                          type="text"
                          required
                          value={studentUID}
                          onChange={(e) => setStudentUID(e.target.value)}
                          placeholder="e.g. CS26B1042"
                          className="w-full bg-[#0a0a0a] border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition-all uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300 font-bold uppercase">
                        GitHub Repository / Gist URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={githubRepoUrl}
                        onChange={(e) => setGithubRepoUrl(e.target.value)}
                        placeholder="https://github.com/username/ai-club-challenge-solution"
                        className="w-full bg-[#0a0a0a] border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300 font-bold uppercase">
                        Implementation Notes & Approach
                      </label>
                      <textarea
                        rows={3}
                        value={solutionNotes}
                        onChange={(e) => setSolutionNotes(e.target.value)}
                        placeholder="Briefly describe your algorithmic approach, tensor optimizations, or benchmark results..."
                        className="w-full bg-[#0a0a0a] border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setSubmissionModalQuest(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black transition-all shadow-[0_0_20px_rgba(0,207,255,0.4)] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'Dispatching...' : 'Submit for Verification'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
