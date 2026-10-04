'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, MessageCircle, Sparkles, ArrowRight, ExternalLink, Bot } from 'lucide-react';
import { Linkedin, Github, Instagram, Discord, WhatsApp } from '@/components/common/Icons';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function CommunitySection() {
  const { settings } = useCMSData();

  const socials = [
    {
      name: 'Discord Server',
      handle: 'discord.gg/aiml-club',
      desc: 'Live voice rooms, coding squads, study sprints & paper discussions.',
      url: settings.socialLinks.discord,
      icon: MessageSquare,
      color: '#8A8A8A',
      glow: 'hover:border-indigo-500/50 hover:shadow-none',
      members: '1,200+ Online'
    },
    {
      name: 'WhatsApp Community',
      handle: 'Official Announcements',
      desc: 'Instant broadcast alerts for workshop seats, room numbers, and hackathons.',
      url: settings.socialLinks.whatsapp,
      icon: MessageCircle,
      color: '#A3A3A3',
      glow: 'hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]',
      members: '580+ Members'
    },
    {
      name: 'GitHub Organization',
      handle: '@aiml-club',
      desc: 'Open source repositories, robotics drivers, and student project codebases.',
      url: settings.socialLinks.github,
      icon: Github,
      color: '#F5F7FF',
      glow: 'hover:border-slate-400/50 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]',
      members: '54 Repositories'
    },
    {
      name: 'LinkedIn Network',
      handle: 'ai-ml-club-official',
      desc: 'Alumni career pathways, industry sponsorship announcements & events.',
      url: settings.socialLinks.linkedin,
      icon: Linkedin,
      color: '#FFFFFF',
      glow: 'hover:border-cyan-500/50 hover:shadow-none',
      members: '3,400+ Followers'
    },
    {
      name: 'Instagram Channel',
      handle: '@aiml_club',
      desc: 'Laboratory behind-the-scenes, hardware timelapses, and event recaps.',
      url: settings.socialLinks.instagram,
      icon: Instagram,
      color: '#A3A3A3',
      glow: 'hover:border-pink-500/50 hover:shadow-[0_0_25px_rgba(236,72,153,0.3)]',
      members: '2,800+ Followers'
    }
  ];

  return (
    <section className="relative py-16 sm:py-24 bg-transparent overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-cyan-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GLOBAL STUDENT NETWORK</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
            JOIN THE AI{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              MOVEMENT
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-sans leading-relaxed">
            Connect directly with fellow student researchers, join weekly study squads, and get access to cloud GPU resources.
          </p>
        </div>

        {/* Social Grid */}
        <div className="tabletop-surface grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 rounded-2xl border border-white/10 p-3 mb-10">
          {socials.map((soc, idx) => {
            const Icon = soc.icon;
            return (
              <motion.a
                key={soc.name}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onMouseEnter={() => soundFx.playHover()}
                onClick={() => soundFx.playClick()}
                className={`tabletop-card p-4 rounded-xl bg-[#151515]/90 border border-white/10 ${soc.glow} transition-colors duration-200 flex flex-col justify-between gap-3 group min-h-48`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${soc.color}20`, border: `1px solid ${soc.color}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: soc.color }} />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {soc.members}
                    </span>
                  </div>

                  <h3 className="font-mono font-bold text-lg text-white group-hover:text-cyan-300 transition-colors mb-1">
                    {soc.name}
                  </h3>

                  <p className="text-xs text-slate-400 font-mono mb-2">{soc.handle}</p>
                  <p className="hidden text-xs text-slate-300 font-sans leading-relaxed">{soc.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs text-cyan-400 group-hover:text-cyan-300">
                  <span>Connect Channel</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.a>
            );
          })}

          {/* AI Lab Banner Card inside Community Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-slate-900 to-violet-950/60 border border-cyan-500/40 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 mb-4 shadow-none">
                <Bot className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="font-mono font-bold text-lg text-white mb-2">
                Virtual 3D AI Laboratory
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Step inside our 3D research laboratory and interact directly with our signature AI Humanoid Robot using voice or text commands.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-cyan-500/20">
              <Link
                href="/ai-lab"
                onClick={() => soundFx.playClick()}
                className="w-full py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-400 hover:text-black transition-colors flex items-center justify-center gap-2"
              >
                <span>Enter Laboratory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Global Join CTA Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-violet-950/70 border border-cyan-500/40 shadow-none text-center space-y-6">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
            READY TO JOIN THE REVOLUTION?
          </h3>
          <p className="text-slate-300 text-sm sm:text-base font-sans max-w-xl mx-auto leading-relaxed">
            Applications are currently open for our Fall 2026 research cohorts. All passionate engineering and computing students are welcome.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/join"
              onClick={() => soundFx.playClick()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-mono text-sm font-bold text-black bg-white hover:bg-neutral-200 shadow-none transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>APPLY FOR MEMBERSHIP</span>
            </Link>
            <Link
              href="/contact"
              onClick={() => soundFx.playClick()}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl font-mono text-sm font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 transition-colors"
            >
              Contact Lab Coordinators
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
