'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, ExternalLink, X, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { Linkedin, Github, Twitter } from '@/components/common/Icons';
import { TeamMember } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function TeamSection() {
  const { team } = useCMSData();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleOpenMember = (member: TeamMember) => {
    soundFx.playHologram();
    setSelectedMember(member);
  };

  return (
    <section id="team" className="relative py-24 sm:py-32 bg-transparent overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              <Users className="w-3.5 h-3.5" />
              <span>COMMAND STRUCTURE & RESEARCH LEADS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              AI COMMAND{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                CENTER
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-sans max-w-xl">
              Meet the student researchers, domain leads, and faculty advisors directing the club&apos;s AI systems and laboratory hardware.
            </p>
          </div>

          <Link
            href="/team"
            onClick={() => soundFx.playClick()}
            className="self-start md:self-auto inline-flex items-center gap-2 font-mono text-xs text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <span>View Full Roster & Mentors</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Team Holographic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => handleOpenMember(member)}
              onMouseEnter={() => soundFx.playHover()}
              className="group cursor-pointer p-6 rounded-3xl bg-[#111111]/85 backdrop-blur-md border border-white/10 hover:border-white/25 shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:shadow-none transition-all flex flex-col justify-between transform hover:-translate-y-1.5"
            >
              <div>
                {/* Avatar & Role Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-cyan-500/40 p-[1px] group-hover:border-cyan-400 transition-colors shadow-none">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 uppercase font-bold">
                      {member.role}
                    </span>
                    <h3 className="text-lg font-bold text-white font-mono group-hover:text-cyan-300 transition-colors mt-1">
                      {member.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed mb-4">
                  {member.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="text-[10px] font-mono text-cyan-400 px-1 py-0.5">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
                <span className="text-[10px] truncate max-w-[150px]">
                  {member.department}
                </span>

                <div className="flex items-center gap-2.5">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 hover:text-cyan-400 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Member Profile Modal */}
        <AnimatePresence>
          {selectedMember && (
            <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMember(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-lg bg-[#0a0a0a] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-none z-10 font-mono text-xs overflow-y-auto max-h-[85vh]"
              >
                <div className="flex items-start justify-between border-b border-cyan-500/20 pb-4 mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedMember.avatar}
                      alt={selectedMember.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400"
                    />
                    <div>
                      <span className="text-[10px] text-cyan-400 uppercase font-bold">
                        {selectedMember.role}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-0.5">
                        {selectedMember.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">{selectedMember.department}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs uppercase text-cyan-400 font-bold mb-1">
                      &gt; BIOGRAPHY & SPECIALIZATION
                    </h4>
                    <p className="text-slate-300 text-sm font-sans leading-relaxed">
                      {selectedMember.bio}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-cyan-400 font-bold mb-2">
                      &gt; TECHNICAL EXPERTISE
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map(s => (
                        <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedMember.linkedin && (
                        <a
                          href={selectedMember.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {selectedMember.github && (
                        <a
                          href={selectedMember.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      Close Profile
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
