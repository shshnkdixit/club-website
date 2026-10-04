'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, MessageCircle, Sparkles, ArrowRight, ExternalLink, Bot } from 'lucide-react';
import { Linkedin, Github, Instagram } from '@/components/common/Icons';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function CommunitySection() {
  const { settings } = useCMSData();
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const socials = [
    { name: 'Discord', fullName: 'Discord Server', handle: 'discord.gg/aiml-club', desc: 'Live voice rooms, coding squads, study sprints & paper discussions.', url: settings.socialLinks.discord, icon: MessageSquare, color: '#8A8A8A', members: '1,200+ Online', position: 'left-[3%] top-[8%]' },
    { name: 'WhatsApp Community', fullName: 'WhatsApp Community', handle: 'Official Announcements', desc: 'Instant broadcast alerts for workshop seats, room numbers, and hackathons.', url: settings.socialLinks.whatsapp, icon: MessageCircle, color: '#A3A3A3', members: '580+ Members', position: 'left-[0%] top-[57%]' },
    { name: 'GitHub Organization', fullName: 'GitHub Organization', handle: '@aiml-club', desc: 'Open source repositories, robotics drivers, and student project codebases.', url: settings.socialLinks.github, icon: Github, color: '#F5F7FF', members: '54 Repositories', position: 'left-[28%] bottom-[0%]' },
    { name: 'LinkedIn Network', fullName: 'LinkedIn Network', handle: 'ai-ml-club-official', desc: 'Alumni career pathways, industry sponsorship announcements & events.', url: settings.socialLinks.linkedin, icon: Linkedin, color: '#FFFFFF', members: '3,400+ Followers', position: 'right-[2%] top-[14%]' },
    { name: 'Instagram Channel', fullName: 'Instagram Channel', handle: '@aiml_club', desc: 'Laboratory behind-the-scenes, hardware timelapses, and event recaps.', url: settings.socialLinks.instagram, icon: Instagram, color: '#A3A3A3', members: '2,800+ Followers', position: 'right-[0%] top-[60%]' },
    { name: 'Virtual 3D AI Lab', fullName: 'Virtual 3D AI Laboratory', handle: 'immersive research space', desc: 'Step inside our 3D research laboratory and interact directly with our signature AI Humanoid Robot using voice or text commands.', url: '/ai-lab', icon: Bot, color: '#67e8f9', members: 'LAB ONLINE', position: 'right-[28%] bottom-[0%]' },
  ];

  return (
    <section className="relative overflow-hidden bg-transparent py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.04] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 border border-cyan-500/30 bg-cyan-500/[0.06] px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-cyan-300">
            <Sparkles className="size-3" />
            GLOBAL STUDENT NETWORK
          </div>
          <h2 className="font-mono text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            JOIN THE AI <span className="text-cyan-300">MOVEMENT</span>
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-slate-300 sm:text-base">
            Connect directly with fellow student researchers, join weekly study squads, and get access to cloud GPU resources.
          </p>
        </header>

        <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3 font-mono text-[10px] tracking-[0.16em] text-slate-500">
          <span>LIVE COMMUNITY NETWORK</span>
          <span className="text-cyan-300"><i className="mr-2 inline-block size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_currentColor]" />6 CHANNELS ONLINE</span>
        </div>

        <div className="relative mx-auto mb-16 flex h-auto max-w-6xl flex-col gap-3 md:block md:h-[600px]">
          <svg className="pointer-events-none absolute inset-0 hidden size-full md:block" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
            <g fill="none" stroke="currentColor" className="text-cyan-300/20" strokeWidth="1">
              <path d="M500 300 C370 220 240 135 110 95" /><path d="M500 300 C350 330 210 390 100 405" /><path d="M500 300 C420 400 360 490 315 560" />
              <path d="M500 300 C640 220 760 160 885 120" /><path d="M500 300 C650 330 790 400 900 425" /><path d="M500 300 C590 400 670 495 740 560" />
            </g>
            <circle cx="500" cy="300" r="96" fill="none" stroke="currentColor" className="text-cyan-300/10" strokeDasharray="2 10" />
          </svg>

          <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} className="relative z-20 mx-auto mb-3 flex size-44 shrink-0 flex-col items-center justify-center border border-cyan-300/60 bg-[#0b1114] text-center shadow-[0_0_45px_rgba(34,211,238,0.12)] md:absolute md:left-1/2 md:top-1/2 md:mb-0 md:-translate-x-1/2 md:-translate-y-1/2 sm:size-52">
            <Bot className="mb-3 size-7 text-cyan-300" />
            <span className="font-mono text-[10px] tracking-[0.22em] text-cyan-300">AI/ML CLUB</span>
            <strong className="mt-1 font-mono text-lg text-white">FUTURE LAB</strong>
            <span className="mt-3 border-t border-slate-700 px-3 pt-2 font-mono text-[9px] text-slate-500">RESEARCH · BUILD · SHARE</span>
          </motion.div>

          {socials.map((soc, idx) => {
            const Icon = soc.icon;
            const isActive = activeNode === soc.name;
            return (
              <motion.a key={soc.name} href={soc.url} target={soc.url.startsWith('/') ? undefined : '_blank'} rel={soc.url.startsWith('/') ? undefined : 'noopener noreferrer'} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: activeNode && !isActive ? 0.38 : 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} onMouseEnter={() => { setActiveNode(soc.name); soundFx.playHover(); }} onMouseLeave={() => setActiveNode(null)} onClick={() => soundFx.playClick()} className={`group relative z-10 block w-full border bg-[#0b1114]/95 p-4 transition-all duration-300 md:absolute md:w-56 ${soc.position} ${isActive ? 'border-cyan-300/70 shadow-[0_0_28px_rgba(34,211,238,0.16)]' : 'border-slate-700/80 hover:border-cyan-300/50'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon className="size-5 shrink-0" style={{ color: soc.color }} />
                    <span className="font-mono text-[11px] font-bold text-white">{soc.name}</span>
                  </div>
                  <ExternalLink className="size-3 text-slate-600 transition-colors group-hover:text-cyan-300" />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 font-mono text-[9px] text-slate-500"><span className="truncate">{soc.handle}</span><span className="whitespace-nowrap text-cyan-300">{soc.members}</span></div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{soc.desc}</p>
                <div className="mt-3 border-t border-slate-800 pt-2 font-mono text-[10px] tracking-wider text-cyan-300">CONNECT <ArrowRight className="ml-1 inline size-3 transition-transform group-hover:translate-x-1" /></div>
              </motion.a>
            );
          })}
        </div>

        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 border-y border-cyan-300/25 py-7 text-center sm:flex-row sm:text-left">
          <div><p className="font-mono text-[10px] tracking-[0.18em] text-cyan-300">YOUR NEXT COLLABORATION STARTS HERE</p><p className="mt-2 text-sm text-slate-400">Find researchers. Build projects. Share ideas. Ship something real.</p></div>
          <Link href="/join" onClick={() => soundFx.playClick()} className="inline-flex shrink-0 items-center gap-2 border border-cyan-300/60 bg-cyan-300 px-5 py-3 font-mono text-xs font-bold text-slate-950 transition hover:bg-white"><span>ENTER THE NETWORK</span><ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  );
}
