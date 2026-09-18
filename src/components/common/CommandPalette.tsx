'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Cpu, Bot, Calendar, FileText, Users, ArrowRight, Volume2, VolumeX, ShieldAlert, X } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';
import { useCMSData } from '@/lib/cmsStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { domains, projects, events } = useCMSData();
  const [query, setQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(soundFx.getMuted());
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        soundFx.playClick();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isOpen, onClose]);

  const handleSelect = (url: string) => {
    soundFx.playClick();
    onClose();
    router.push(url);
  };

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    soundFx.playClick();
  };

  const filteredDomains = domains.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) || 
    d.shortDesc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.technologies.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(query.toLowerCase()) || 
    e.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-24 sm:pt-32 px-4 pb-8 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-[#0B1020] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,207,255,0.2)] overflow-hidden z-10 flex flex-col max-h-[80vh]"
          >
            {/* Header / Input */}
            <div className="flex items-center px-4 py-3.5 border-b border-cyan-500/20 bg-slate-900/60">
              <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search AI domains, student projects, events, or type a command..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base outline-none font-mono"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-3 space-y-4 text-xs font-mono">
              {/* Quick Actions */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 font-semibold px-2 mb-1.5">
                  Core Navigation & Commands
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleSelect('/ai-lab')}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 hover:bg-cyan-500/15 border border-slate-700/50 hover:border-cyan-500/40 text-left transition-all text-slate-200 group"
                  >
                    <span className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span>Enter 3D AI Lab</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleSelect('/join')}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 hover:bg-violet-500/15 border border-slate-700/50 hover:border-violet-500/40 text-left transition-all text-slate-200 group"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                      <span>Apply to Join Club</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleSelect('/team')}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 hover:bg-emerald-500/15 border border-slate-700/50 hover:border-emerald-500/40 text-left transition-all text-slate-200 group"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>AI Command Team</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">Officers</span>
                  </button>

                  <button
                    onClick={() => handleSelect('/resources')}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 hover:bg-violet-500/15 border border-slate-700/50 hover:border-violet-500/40 text-left transition-all text-slate-200 group"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                      <span>Knowledge Vault</span>
                    </span>
                    <span className="text-[10px] text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded font-bold">Study Hub</span>
                  </button>

                  <button
                    onClick={() => handleSelect('/challenges')}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 hover:bg-yellow-500/15 border border-slate-700/50 hover:border-yellow-500/40 text-left transition-all text-slate-200 group"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                      <span>Coding Quests & POTW</span>
                    </span>
                    <span className="text-[10px] text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded font-bold">500 XP</span>
                  </button>

                  <button
                    onClick={() => handleSelect('/admin')}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 hover:bg-amber-500/15 border border-slate-700/50 hover:border-amber-500/40 text-left transition-all text-slate-200 group"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>Admin CMS Portal</span>
                    </span>
                    <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded">PIN Gate</span>
                  </button>

                  <button
                    onClick={handleToggleSound}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-700/50 border border-slate-700/50 text-left transition-all text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      <span>{isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{isMuted ? 'OFF' : 'ON'}</span>
                  </button>
                </div>
              </div>

              {/* Domains */}
              {filteredDomains.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 font-semibold px-2 mb-1.5 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" /> AI Domains
                  </p>
                  <div className="space-y-1">
                    {filteredDomains.slice(0, 4).map(domain => (
                      <button
                        key={domain.id}
                        onClick={() => handleSelect(`/#domains`)}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/20 hover:bg-slate-800/60 border border-slate-800 hover:border-cyan-500/30 text-left text-slate-300 transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-slate-200">{domain.name}</span>
                          <span className="text-[11px] text-slate-400 ml-2">({domain.activeProjectsCount} projects)</span>
                        </div>
                        <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                          {domain.technologies.slice(0, 2).join(', ')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {filteredProjects.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 font-semibold px-2 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Student Projects
                  </p>
                  <div className="space-y-1">
                    {filteredProjects.slice(0, 4).map(proj => (
                      <button
                        key={proj.id}
                        onClick={() => handleSelect(`/projects#${proj.id}`)}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/20 hover:bg-slate-800/60 border border-slate-800 hover:border-cyan-500/30 text-left text-slate-300 transition-colors"
                      >
                        <span className="truncate pr-2 font-medium text-slate-200">{proj.title}</span>
                        <span className="shrink-0 text-[10px] text-violet-300 bg-violet-500/15 px-1.5 py-0.5 rounded">
                          {proj.category}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {filteredEvents.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 font-semibold px-2 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Events & Hackathons
                  </p>
                  <div className="space-y-1">
                    {filteredEvents.slice(0, 3).map(event => (
                      <button
                        key={event.id}
                        onClick={() => handleSelect(`/events#${event.id}`)}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/20 hover:bg-slate-800/60 border border-slate-800 hover:border-cyan-500/30 text-left text-slate-300 transition-colors"
                      >
                        <span className="truncate pr-2">{event.title}</span>
                        <span className="shrink-0 text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {event.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Tip */}
            <div className="px-4 py-2 border-t border-cyan-500/20 bg-slate-900/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-300">ESC</kbd> to close</span>
              <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-300">Ctrl+K</kbd> to toggle</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
