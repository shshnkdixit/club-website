'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Menu, X, Search, Volume2, VolumeX, ShieldAlert, Cpu, ArrowUpRight } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';
import { useCMSData } from '@/lib/cmsStore';
import CommandPalette from './CommandPalette';

export default function Navbar() {
  const pathname = usePathname();
  const { settings, currentAdmin } = useCMSData();
  const isLoggedIn = !!currentAdmin;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    setIsMuted(soundFx.getMuted());

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    const handleMuteEvent = (e: Event) => {
      const custom = e as CustomEvent<{ isMuted: boolean }>;
      setIsMuted(custom.detail.isMuted);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('aiml_mute_changed', handleMuteEvent);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('aiml_mute_changed', handleMuteEvent);
    };
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Vault', href: '/resources' },
    { label: 'Quests', href: '/challenges' },
    { label: 'Events', href: '/events' },
    { label: 'Research', href: '/research' },
    { label: 'Team', href: '/team' },
    { label: 'AI Lab', href: '/ai-lab', highlight: true, icon: Bot },
    { label: 'Contact', href: '/contact' },
  ];

  const handleAudioToggle = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    soundFx.playClick();
  };

  const playHover = () => soundFx.playHover();
  const playClick = () => soundFx.playClick();

  if (pathname === '/ai-lab') {
    return null;
  }

  return (
    <>
      {/* Announcement Banner if configured in CMS */}
      {settings.announcement?.enabled && showAnnouncement && (
        <aside aria-label="Announcement" className="relative z-[100] bg-gradient-to-r from-cyan-950 via-slate-900 to-violet-950 border-b border-cyan-500/20 text-xs py-1.5 px-4 text-center text-cyan-200 font-mono flex items-center justify-center gap-2">
          <span>{settings.announcement.text}</span>
          {settings.announcement.linkUrl && (
            <Link
              href={settings.announcement.linkUrl}
              className="underline font-bold text-cyan-400 hover:text-cyan-300 ml-1 inline-flex items-center gap-0.5"
            >
              {settings.announcement.linkText || 'Details'} <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
          >
            <X className="w-3 h-3" />
          </button>
        </aside>
      )}

      {/* Floating Header */}
      <header
        className={`fixed left-0 right-0 z-[990] transition-all duration-300 flex justify-center px-3 sm:px-6 ${
          settings.announcement?.enabled && showAnnouncement ? 'top-8 sm:top-9' : 'top-3 sm:top-5'
        }`}
      >
        <nav
          className={`w-full max-w-7xl rounded-2xl transition-all duration-300 flex items-center justify-between border ${
              scrolled
              ? 'py-2.5 px-4 sm:px-6 bg-[#080808]/95 backdrop-blur-xl border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
              : 'py-3.5 px-5 sm:px-7 bg-[#080808]/75 backdrop-blur-md border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
          }`}
        >
          {/* Logo & Lab Branding */}
          <Link
            href="/"
            onClick={playClick}
            onMouseEnter={playHover}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="relative w-9 h-9 rounded-xl bg-white p-1 border border-cyan-400/50 shadow-none flex items-center justify-center overflow-hidden group-hover:shadow-none group-hover:scale-105 transition-all">
              <img
                src="/images/logo.png"
                alt="AI/ML Club Logo"
                className="w-full h-full object-contain"
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-extrabold text-sm sm:text-base tracking-wider text-white flex items-center gap-1 group-hover:text-cyan-300 transition-colors">
                AI/ML CLUB
              </span>
              <span className="text-[9px] font-mono tracking-widest text-cyan-400/80 uppercase -mt-0.5">
                Future Lab
              </span>
            </div>
          </Link>

          {/* Desktop Full Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={playClick}
                    onMouseEnter={playHover}
                    className={`relative px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-none'
                        : 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 hover:from-cyan-500/20 hover:to-violet-500/20 text-cyan-300 border-cyan-500/30 hover:border-cyan-400'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
                    <span>{link.label}</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={playClick}
                  onMouseEnter={playHover}
                  className={`relative px-2.5 py-1.5 rounded-lg font-mono text-xs transition-colors ${
                    isActive
                      ? 'text-cyan-400 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons, CTAs & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Command Palette Trigger */}
            <button
              onClick={() => {
                soundFx.playClick();
                setPaletteOpen(true);
              }}
              onMouseEnter={playHover}
              title="Search & Commands (Ctrl+K)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 text-xs font-mono transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] text-slate-400 hidden sm:inline">Search</span>
              <kbd className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-cyan-300 hidden sm:inline">
                ⌘K
              </kbd>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleAudioToggle}
              title={isMuted ? 'Enable Sound FX' : 'Mute Sound FX'}
              className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Admin Portal Shortcut (Device Session Protocol) */}
            <Link
              href={isLoggedIn ? '/admin' : '/admin-login'}
              onClick={playClick}
              onMouseEnter={playHover}
              title={isLoggedIn ? `Admin CMS Dashboard (${currentAdmin?.name || 'Active'})` : 'Admin CMS Gateway Login'}
              className={`relative p-2 rounded-xl border transition-all hidden sm:flex ${
                isLoggedIn
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 hover:border-amber-500/40 text-slate-300 hover:text-amber-400'
              }`}
            >
              <ShieldAlert className={`w-4 h-4 ${isLoggedIn ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'}`} />
              {isLoggedIn && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              )}
            </Link>

            {/* Join Club Primary CTA */}
            <Link
              href="/join"
              onClick={playClick}
              onMouseEnter={playHover}
              className="relative group overflow-hidden px-3.5 sm:px-4 py-2 rounded-xl font-mono text-xs font-bold text-black bg-white hover:bg-neutral-200 shadow-none transition-all transform hover:-translate-y-0.5 active:translate-y-0 hidden sm:flex"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join Club</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              onMouseEnter={playHover}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.3)] bg-slate-800/80 hover:bg-slate-800 text-cyan-300 border-cyan-500/40 hover:border-cyan-400"
              title={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-rose-400" />
              ) : (
                <Menu className="w-4 h-4 text-cyan-400 animate-pulse" />
              )}
              <span className="uppercase tracking-wider text-[11px] font-bold">
                {mobileMenuOpen ? 'Close' : 'Menu'}
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Screen Cyberpunk Mega Menu Overlay (Universal Desktop + Mobile) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[980] bg-[#050505]/98 backdrop-blur-2xl flex flex-col pt-24 pb-10 px-4 sm:px-8 lg:px-16 overflow-y-auto font-mono"
          >
            <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[180px] pointer-events-none" />

            <div className="max-w-6xl mx-auto w-full relative z-10 space-y-8">
              {/* Menu Top HUD Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
                    &gt; LAB_MEGA_NAVIGATION_MATRIX
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setPaletteOpen(true);
                    }}
                    className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-850 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Global Search (⌘K)</span>
                  </button>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Categorized 3-Column Navigation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Core Portal & Foundations */}
                <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider block border-b border-cyan-500/20 pb-2">
                    01. CORE DISCOVERY
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Home Terminal', href: '/', icon: Cpu, desc: 'AI/ML Lab headquarters & telemetry' },
                      { label: 'About Laboratory', href: '/#about', desc: 'Mission, history & compute clusters' },
                      { label: 'Research Tracks', href: '/#domains', desc: 'Core ML, Deep Learning & Robotics' },
                      { label: 'Featured Projects', href: '/projects', desc: 'Open-source campus AI repositories' }
                    ].map((item, i) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            soundFx.playClick();
                            setMobileMenuOpen(false);
                          }}
                          className={`p-3 rounded-2xl border transition-all flex items-start justify-between group ${
                            isActive
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-none'
                              : 'bg-slate-950/60 border-slate-800/80 text-slate-200 hover:border-cyan-500/40 hover:bg-slate-900'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-sm block group-hover:text-cyan-300 transition-colors">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {item.desc}
                            </span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 mt-0.5" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Interactive Labs & Bounties */}
                <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  <span className="text-[11px] text-yellow-400 font-bold uppercase tracking-wider block border-b border-yellow-500/20 pb-2">
                    02. INTERACTIVE HUBS & BOUNTIES
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Virtual AI Lab', href: '/ai-lab', highlight: true, icon: Bot, desc: '3D Humanoid Robot with speech synthesis' },
                      { label: 'Knowledge Vault', href: '/resources', desc: 'Curated AI textbooks, papers & roadmaps' },
                      { label: 'Coding Quests & Challenges', href: '/challenges', desc: 'PyTorch & NumPy quests with XP bounties' },
                      { label: 'Events & Workshops', href: '/events', desc: 'Bootcamps, guest lectures & hackathons' }
                    ].map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            soundFx.playClick();
                            setMobileMenuOpen(false);
                          }}
                          className={`p-3 rounded-2xl border transition-all flex items-start justify-between group ${
                            item.highlight
                              ? 'bg-gradient-to-r from-cyan-500/15 to-violet-500/15 border-cyan-400/80 text-cyan-300 shadow-none'
                              : isActive
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.25)]'
                              : 'bg-slate-950/60 border-slate-800/80 text-slate-200 hover:border-yellow-500/40 hover:bg-slate-900'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-sm flex items-center gap-1.5 group-hover:text-yellow-300 transition-colors">
                              {Icon && <Icon className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />}
                              <span>{item.label}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {item.desc}
                            </span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 transition-colors shrink-0 mt-0.5" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Column 3: People, Admissions & Governance */}
                <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  <span className="text-[11px] text-violet-400 font-bold uppercase tracking-wider block border-b border-violet-500/20 pb-2">
                    03. COMMUNITY & GOVERNANCE
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Research Publications', href: '/research', desc: 'Faculty & student conference papers' },
                      { label: 'Core Team Roster', href: '/team', desc: 'Founders, researchers & mentors' },
                      { label: 'Contact Transmission', href: '/contact', desc: 'Direct message to lab coordinates' },
                      { label: 'Join AI/ML Club', href: '/join', highlight: true, desc: 'Cohort membership application' },
                      { label: isLoggedIn ? 'Admin CMS Dashboard' : 'Admin CMS Gateway', href: isLoggedIn ? '/admin' : '/admin-login', admin: true, desc: isLoggedIn ? `Active (${currentAdmin?.role})` : 'Authorized personnel portal' }
                    ].map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            soundFx.playClick();
                            setMobileMenuOpen(false);
                          }}
                          className={`p-3 rounded-2xl border transition-all flex items-start justify-between group ${
                            item.highlight
                              ? 'bg-white hover:bg-neutral-200 text-black font-bold border-white shadow-none'
                              : item.admin
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:border-amber-400'
                              : isActive
                              ? 'bg-violet-500/20 text-violet-300 border-violet-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                              : 'bg-slate-950/60 border-slate-800/80 text-slate-200 hover:border-violet-500/40 hover:bg-slate-900'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-sm block group-hover:text-white transition-colors">
                              {item.label}
                            </span>
                            <span className={`text-[10px] block mt-0.5 ${item.highlight ? 'text-white/80' : 'text-slate-400'}`}>
                              {item.desc}
                            </span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors shrink-0 mt-0.5" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Palette Modal */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
