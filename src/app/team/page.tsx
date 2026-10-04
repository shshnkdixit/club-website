'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Mail, 
  ArrowLeft, 
  X, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Layers, 
  Compass, 
  Network, 
  LayoutGrid, 
  Search,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import { Linkedin, Github, Twitter } from '@/components/common/Icons';
import { TeamMember } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

interface OrgTreeNodeProps {
  member: TeamMember;
  tierLevel: 1 | 2 | 3 | 4;
  onOpen: (m: TeamMember) => void;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

function OrgTreeNode({ member, tierLevel, onOpen, isHovered, onHover }: OrgTreeNodeProps) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (m: TeamMember) => {
    if (m.initials) return m.initials.toUpperCase();
    const parts = m.name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(member);

  const tierStyles = {
    1: {
      ring: isHovered
        ? 'bg-gradient-to-tr from-amber-400 via-amber-200 to-cyan-400 shadow-[0_0_40px_rgba(245,158,11,0.7)]'
        : 'bg-gradient-to-tr from-amber-500 via-amber-300 to-cyan-400 shadow-[0_0_25px_rgba(245,158,11,0.4)]',
      border: 'border-amber-400/80',
      badgeBg: 'bg-amber-500 text-slate-950',
      badgeText: '★',
      pill: 'bg-slate-900/90 border-amber-500/50 text-amber-300',
      hoverName: 'group-hover:text-amber-300',
      size: 'w-28 h-28 sm:w-32 sm:h-32',
    },
    2: {
      ring: isHovered
        ? 'bg-gradient-to-tr from-cyan-400 via-emerald-300 to-indigo-400 shadow-[0_0_40px_rgba(0,207,255,0.75)]'
        : 'bg-gradient-to-tr from-cyan-500 via-emerald-400 to-indigo-400 shadow-[0_0_25px_rgba(0,207,255,0.4)]',
      border: 'border-cyan-400/80',
      badgeBg: 'bg-cyan-400 text-slate-950',
      badgeText: '2',
      pill: 'bg-slate-900/90 border-cyan-500/50 text-cyan-300',
      hoverName: 'group-hover:text-cyan-300',
      size: 'w-26 h-26 sm:w-30 sm:h-30',
    },
    3: {
      ring: isHovered
        ? 'bg-gradient-to-tr from-cyan-400 via-indigo-400 to-violet-500 shadow-[0_0_30px_rgba(0,207,255,0.65)]'
        : 'bg-gradient-to-tr from-slate-600 via-cyan-500/70 to-indigo-500 shadow-[0_0_18px_rgba(0,207,255,0.3)]',
      border: 'border-cyan-500/40',
      badgeBg: 'bg-indigo-500 text-white',
      badgeText: initials,
      pill: 'bg-slate-950 border-slate-700 text-slate-200 group-hover:border-cyan-400/60 group-hover:text-cyan-300',
      hoverName: 'group-hover:text-cyan-300',
      size: 'w-24 h-24 sm:w-28 sm:h-28',
    },
    4: {
      ring: isHovered
        ? 'bg-gradient-to-tr from-emerald-400 to-cyan-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
        : 'bg-gradient-to-tr from-slate-700 to-slate-500 shadow-[0_0_12px_rgba(0,0,0,0.5)]',
      border: 'border-slate-700',
      badgeBg: 'bg-slate-700 text-slate-200',
      badgeText: '4',
      pill: 'bg-slate-950 border-slate-800 text-slate-400 group-hover:text-emerald-300',
      hoverName: 'group-hover:text-emerald-300',
      size: 'w-20 h-20 sm:w-24 sm:h-24',
    },
  }[tierLevel];

  return (
    <div
      onClick={() => onOpen(member)}
      onMouseEnter={() => {
        onHover(member.id);
        soundFx.playHover();
      }}
      onMouseLeave={() => onHover(null)}
      className="group flex flex-col items-center text-center cursor-pointer transition-transform transform hover:scale-105 select-none"
    >
      {/* Circular Halo Ring */}
      <div className="relative mb-3">
        <div className={`${tierStyles.size} rounded-full p-1 transition-all duration-300 ${tierStyles.ring}`}>
          <div className="w-full h-full rounded-full bg-[#000000] relative overflow-hidden flex items-center justify-center">
            {/* 1. NORMALLY SHOW THE AVATAR IMAGE */}
            {member.avatar && !imageError ? (
              <img
                src={member.avatar}
                alt={member.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-[#0A122A] flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-cyan-300">
                  {initials}
                </span>
              </div>
            )}

            {/* 2. HOVER OVERLAY: CONNECT ON LINKEDIN & GITHUB */}
            <div className="absolute inset-0 rounded-full bg-slate-950/85 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-2 z-20">
              <span className="text-[9px] font-black tracking-wider text-cyan-300 uppercase mb-1.5 animate-fade-in">
                CONNECT
              </span>
              <div className="flex items-center justify-center gap-2">
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playClick();
                    }}
                    title="Connect on LinkedIn"
                    className="w-8 h-8 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 flex items-center justify-center transition-all shadow-[0_0_12px_rgba(0,207,255,0.5)] transform hover:scale-115"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(member);
                    }}
                    title="View Dossier"
                    className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 text-slate-300 hover:bg-cyan-500 hover:text-slate-950 flex items-center justify-center transition-all"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                )}

                {member.github ? (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playClick();
                    }}
                    title="View GitHub"
                    className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-500 text-white hover:bg-white hover:text-slate-950 flex items-center justify-center transition-all shadow-[0_0_12px_rgba(255,255,255,0.3)] transform hover:scale-115"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                ) : null}

                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playClick();
                    }}
                    title="Send Email"
                    className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-600 text-slate-300 hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center transition-all transform hover:scale-115"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                ) : null}
              </div>
              <span className="text-[8px] text-slate-400 mt-1.5 font-mono">
                Click for dossier
              </span>
            </div>
          </div>
        </div>

        {/* Tier Chip / Initials Badge */}
        <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] h-5 rounded-full ${tierStyles.badgeBg} text-[9px] font-black flex items-center justify-center border-2 border-[#000000] shadow-md`}>
          {tierStyles.badgeText}
        </div>
      </div>

      {/* Name & Role */}
      <div className="space-y-1 max-w-[200px]">
        <h3 className={`text-sm sm:text-base font-black text-white ${tierStyles.hoverName} transition-colors line-clamp-1`}>
          {member.name}
        </h3>
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm max-w-full truncate ${tierStyles.pill}`}>
          {member.spocTitle || member.role}
        </span>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const { team } = useCMSData();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Faculty' | 'Officers' | 'SPOCs'>('All');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const handleOpenMember = (member: TeamMember) => {
    soundFx.playHologram();
    setSelectedMember(member);
  };

  const getInitials = (member: TeamMember) => {
    if (member.initials) return member.initials.toUpperCase();
    const parts = member.name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getMemberLevel = (m: TeamMember): 1 | 2 | 3 | 4 => {
    const lvl = Number(m.orgLevel);
    if (!isNaN(lvl) && lvl >= 1 && lvl <= 4) {
      return lvl as 1 | 2 | 3 | 4;
    }
    if (m.isFaculty) return 1;
    if (m.role?.toLowerCase().includes('president') || m.role?.toLowerCase().includes('vice')) return 2;
    if (m.role?.toLowerCase().includes('lead') || m.role?.toLowerCase().includes('spoc')) return 3;
    return 4;
  };

  // Group members strictly by evaluated tier
  const level1Members = team
    .filter(m => getMemberLevel(m) === 1)
    .sort((a, b) => (a.treeOrder || 0) - (b.treeOrder || 0));

  const level2Members = team
    .filter(m => getMemberLevel(m) === 2)
    .sort((a, b) => (a.treeOrder || 0) - (b.treeOrder || 0));

  const level3Members = team
    .filter(m => getMemberLevel(m) === 3)
    .sort((a, b) => (a.treeOrder || 0) - (b.treeOrder || 0));

  const level4Members = team
    .filter(m => getMemberLevel(m) === 4)
    .sort((a, b) => (a.treeOrder || 0) - (b.treeOrder || 0));

  const filteredTeam = team.filter(m => {
    const matchSearch =
      searchQuery === '' ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.spocTitle && m.spocTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.skills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCategory =
      activeFilter === 'All' ||
      (activeFilter === 'Faculty' && m.isFaculty) ||
      (activeFilter === 'Officers' && !m.isFaculty) ||
      (activeFilter === 'SPOCs' && (m.spocTitle?.toLowerCase().includes('spoc') || m.role.toLowerCase().includes('spoc') || m.role.toLowerCase().includes('lead')));

    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-transparent text-white pt-28 sm:pt-36 pb-24 px-3 sm:px-6 lg:px-8 font-mono overflow-x-hidden">
      {/* Background Cybernetic Ambience */}
      <div className="fixed inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-600/10 blur-[180px] pointer-events-none" />
      <div className="fixed bottom-10 left-1/4 w-[500px] h-[350px] bg-violet-600/10 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-cyan-500/20 pb-6">
          <div className="space-y-2">
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-300 transition-colors p-2 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Lab Terminal</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,207,255,0.3)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold block">
                  COMMAND HIERARCHY & RESEARCH DIRECTORS
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide">
                  LEADERSHIP & ADVISORY BOARD
                </h1>
              </div>
            </div>
          </div>

          {/* View Mode Switcher & Stats */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-xs text-cyan-300 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{team.length} ACTIVE FELLOWS & MENTORS</span>
            </div>

            <div className="p-1 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center shadow-lg">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setViewMode('tree');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === 'tree'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Org Tree View</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setViewMode('grid');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,207,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>3D Cards Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* VIEW A: INTERACTIVE 3D CYBERNETIC ORG TREE */}
        {/* ────────────────────────────────────────────────────────── */}
        {viewMode === 'tree' ? (
          <div className="relative py-8 px-2 sm:px-6 rounded-3xl bg-[#070A18]/80 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-x-auto">
            <div className="min-w-[760px] flex flex-col items-center space-y-8 py-4">
              
              {/* LEVEL 1: FACULTY COORDINATORS & CHIEF ADVISORS */}
              {level1Members.length > 0 && (
                <div className="flex flex-col items-center">
                  <div className="text-[10px] tracking-widest uppercase font-bold text-amber-400 mb-6 px-3.5 py-1 rounded-full bg-amber-950/70 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    TIER 1 // FACULTY COORDINATORS & CHIEF ADVISORS
                  </div>

                  <div className="flex items-center justify-center gap-8 sm:gap-16">
                    {level1Members.map(member => (
                      <OrgTreeNode
                        key={member.id}
                        member={member}
                        tierLevel={1}
                        onOpen={handleOpenMember}
                        isHovered={hoveredNodeId === member.id}
                        onHover={setHoveredNodeId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Connecting Vertical Trunk from Tier 1 down to Tier 2 */}
              {level1Members.length > 0 && level2Members.length > 0 && (
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-10 bg-gradient-to-b from-amber-400 via-amber-400 to-cyan-400 shadow-[0_0_10px_rgba(0,207,255,0.8)]" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,207,255,1)] animate-pulse" />
                </div>
              )}

              {/* LEVEL 2: PRESIDENT & VICE PRESIDENT */}
              {level2Members.length > 0 && (
                <div className="flex flex-col items-center w-full">
                  <div className="text-[10px] tracking-widest uppercase font-bold text-cyan-300 mb-6 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,207,255,0.2)]">
                    TIER 2 // PRESIDENT & VICE PRESIDENT
                  </div>

                  <div className="relative flex items-center justify-center gap-8 sm:gap-16">
                    {level2Members.length > 1 && (
                      <div className="absolute top-1/2 left-1/4 right-1/4 -translate-y-1/2 h-0.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 shadow-[0_0_8px_rgba(0,207,255,0.7)] pointer-events-none -z-0" />
                    )}
                    {level2Members.map(member => (
                      <OrgTreeNode
                        key={member.id}
                        member={member}
                        tierLevel={2}
                        onOpen={handleOpenMember}
                        isHovered={hoveredNodeId === member.id}
                        onHover={setHoveredNodeId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Connecting Vertical Trunk from Tier 2 down to Tier 3 */}
              {((level1Members.length > 0 || level2Members.length > 0) && level3Members.length > 0) && (
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-10 bg-cyan-400 shadow-[0_0_10px_rgba(0,207,255,0.8)]" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,207,255,1)] animate-pulse" />
                </div>
              )}

              {/* LEVEL 3: DOMAIN LEADS & TEAM SPOCS */}
              {level3Members.length > 0 && (
                <div className="flex flex-col items-center w-full">
                  <div className="text-center mb-6">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-slate-200 px-3.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,207,255,0.2)]">
                      TIER 3 // DOMAIN LEADS & SPECIALIZED TEAM SPOCS
                    </span>
                  </div>

                  {/* Circuit Distribution Bus & Feeder Lines (Below the badge, feeding directly into SPOC nodes) */}
                  <div className="relative w-full max-w-4xl flex flex-col items-center mb-6">
                    <div className="w-0.5 h-6 bg-cyan-400 shadow-[0_0_8px_rgba(0,207,255,0.8)]" />
                    
                    {/* Horizontal Bus Wire */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(0,207,255,0.7)]" />
                    
                    {/* Feeder Drops directly into each SPOC column */}
                    <div 
                      className="w-full grid px-6 sm:px-12" 
                      style={{ gridTemplateColumns: `repeat(${Math.max(level3Members.length, 1)}, minmax(0, 1fr))` }}
                    >
                      {level3Members.map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-0.5 h-6 bg-cyan-400/80 shadow-[0_0_8px_rgba(0,207,255,0.5)]" />
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(0,207,255,0.8)]" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div 
                    className="grid gap-6 sm:gap-8 justify-items-center"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(level3Members.length, 4)}, minmax(160px, 1fr))`
                    }}
                  >
                    {level3Members.map(member => (
                      <OrgTreeNode
                        key={member.id}
                        member={member}
                        tierLevel={3}
                        onOpen={handleOpenMember}
                        isHovered={hoveredNodeId === member.id}
                        onHover={setHoveredNodeId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Connecting Vertical Trunk from Tier 3 down to Tier 4 */}
              {level3Members.length > 0 && level4Members.length > 0 && (
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-10 bg-gradient-to-b from-cyan-400 to-slate-500 shadow-[0_0_8px_rgba(0,207,255,0.5)]" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
                </div>
              )}

              {/* LEVEL 4: CORE RESEARCHERS & SPECIALISTS (IF ANY) */}
              {level4Members.length > 0 && (
                <div className="flex flex-col items-center w-full pt-4">
                  <div className="text-center mb-6">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-slate-400 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700">
                      TIER 4 // CORE RESEARCHERS & ASSOCIATES
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                    {level4Members.map(member => (
                      <OrgTreeNode
                        key={member.id}
                        member={member}
                        tierLevel={4}
                        onOpen={handleOpenMember}
                        isHovered={hoveredNodeId === member.id}
                        onHover={setHoveredNodeId}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* ────────────────────────────────────────────────────────── */
          /* VIEW B: 3D HOLOGRAPHIC CARD MATRIX VIEW */
          /* ────────────────────────────────────────────────────────── */
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2">
                {(['All', 'Faculty', 'Officers', 'SPOCs'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setActiveFilter(tab);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeFilter === tab
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,207,255,0.4)]'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search team member or SPOC..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono"
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeam.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  onClick={() => handleOpenMember(member)}
                  onMouseEnter={() => soundFx.playHover()}
                  className="group cursor-pointer p-6 rounded-3xl bg-[#0a0a0a]/90 border border-cyan-500/20 hover:border-cyan-400 shadow-[0_0_25px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(0,207,255,0.25)] transition-all flex flex-col justify-between transform hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'}
                          alt={member.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40 group-hover:border-cyan-400 transition-colors"
                        />
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-slate-950 text-[9px] font-black text-amber-300 border border-slate-800">
                          {getInitials(member)}
                        </span>
                      </div>

                      <div className="space-y-1 min-w-0">
                        <span className="inline-block text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 uppercase font-bold truncate max-w-full">
                          {member.spocTitle || member.role}
                        </span>
                        <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors truncate">
                          {member.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate">{member.department}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed">
                      &quot;{member.bio}&quot;
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1">
                      {(member.skills || []).map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[10px] text-slate-500">Tier {getMemberLevel(member)} Leader</span>
                    <div className="flex items-center gap-2">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playClick();
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playClick();
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-white hover:text-slate-950 text-slate-300 transition-colors"
                          title="GitHub"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* 3D HOLOGRAPHIC INSPECTION HUD MODAL */}
        {/* ────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {selectedMember && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pt-24 sm:pt-28 pb-8 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMember(null)}
                className="fixed inset-0 bg-black/90 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl bg-[#0a0a0a] border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_70px_rgba(0,207,255,0.4)] z-10 font-mono text-xs overflow-y-auto max-h-[85vh] my-auto space-y-6"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-cyan-500/20 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedMember.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'}
                        alt={selectedMember.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,207,255,0.4)]"
                      />
                      <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black">
                        {getInitials(selectedMember)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-cyan-300 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 uppercase font-bold">
                        {selectedMember.spocTitle || selectedMember.role}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {selectedMember.name}
                      </h3>
                      <p className="text-slate-400 text-xs">{selectedMember.department}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950 hover:text-rose-300 text-slate-400 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Biography */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>LEADERSHIP DOSSIER & BIOGRAPHY</span>
                  </h4>
                  <p className="text-slate-200 text-sm font-sans leading-relaxed p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    {selectedMember.bio}
                  </p>
                </div>

                {/* Skills & Focus Areas */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>TECHNICAL COMPETENCIES & DOMAIN SPECIALIZATIONS</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedMember.skills || []).map(skill => (
                      <span key={skill} className="px-3 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Coordinates & Links */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedMember.linkedin && (
                      <a
                        href={selectedMember.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 text-cyan-400 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-xs">LinkedIn</span>
                      </a>
                    )}
                    {selectedMember.github && (
                      <a
                        href={selectedMember.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-xs">GitHub</span>
                      </a>
                    )}
                    {selectedMember.email && (
                      <a
                        href={`mailto:${selectedMember.email}`}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="text-xs">Email</span>
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                  >
                    Close Dossier
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
