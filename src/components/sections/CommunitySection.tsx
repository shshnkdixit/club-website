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
    { name: 'Discord', fullName: 'Discord Server', handle: 'discord.gg/aiml-club', desc: 'Live voice rooms, coding squads, study sprints & paper discussions.', url: settings.socialLinks.discord, icon: MessageSquare, color: '#8A8A8A', members: '1,200+ Online', position: 'md:left-[2%] md:top-[5%]', line: 'md:left-[28%] md:top-[27%] md:w-[23%] md:-rotate-[21deg]' },
    { name: 'WhatsApp Community', fullName: 'WhatsApp Community', handle: 'Official Announcements', desc: 'Instant broadcast alerts for workshop seats, room numbers, and hackathons.', url: settings.socialLinks.whatsapp, icon: MessageCircle, color: '#A3A3A3', members: '580+ Members', position: 'md:left-[0%] md:top-[53%]', line: 'md:left-[26%] md:top-[57%] md:w-[25%] md:rotate-[14deg]' },
    { name: 'GitHub Organization', fullName: 'GitHub Organization', handle: '@aiml-club', desc: 'Open source repositories, robotics drivers, and student project codebases.', url: settings.socialLinks.github, icon: Github, color: '#F5F7FF', members: '54 Repositories', position: 'md:left-[25%] md:bottom-[2%]', line: 'md:left-[39%] md:top-[69%] md:w-[15%] md:rotate-[24deg]' },
    { name: 'LinkedIn Network', fullName: 'LinkedIn Network', handle: 'ai-ml-club-official', desc: 'Alumni career pathways, industry sponsorship announcements & events.', url: settings.socialLinks.linkedin, icon: Linkedin, color: '#FFFFFF', members: '3,400+ Followers', position: 'md:right-[1%] md:top-[7%]', line: 'md:right-[27%] md:top-[29%] md:w-[22%] md:rotate-[20deg]' },
    { name: 'Instagram Channel', fullName: 'Instagram Channel', handle: '@aiml_club', desc: 'Laboratory behind-the-scenes, hardware timelapses, and event recaps.', url: settings.socialLinks.instagram, icon: Instagram, color: '#A3A3A3', members: '2,800+ Followers', position: 'md:right-[0%] md:top-[54%]', line: 'md:right-[26%] md:top-[58%] md:w-[24%] md:-rotate-[14deg]' },
  ];

  const lab = { name: 'Virtual 3D AI Lab', fullName: 'Virtual 3D AI Laboratory', handle: 'immersive research space', desc: 'Step inside our 3D research laboratory and interact directly with our signature AI Humanoid Robot using voice or text commands.', url: '/ai-lab', icon: Bot, color: '#67e8f9', members: 'LAB ONLINE' };

  return (
    <section className="relative overflow-hidden bg-transparent py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-[0.14]" />
      <div className="pointer-events-none absolute left-1/2 top-[32%] size-[32rem] -translate-x-1/2 rounded-full bg-cyan-400/[0.045] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-12 max-w-5xl">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 border border-cyan-500/30 bg-cyan-500/[0.06] px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-cyan-300"><Sparkles className="size-3" />GLOBAL STUDENT NETWORK</div>
              <h2 className="font-mono text-3xl font-extrabold tracking-tight text-white sm:text-5xl">JOIN THE AI <span className="text-cyan-300">MOVEMENT</span></h2>
              <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-slate-300 sm:text-base">Connect directly with fellow student researchers, join weekly study squads, and get access to cloud GPU resources.</p>
            </div>
            <span className="hidden pt-3 font-mono text-[10px] tracking-[0.16em] text-slate-500 sm:block">ALL COMMUNITY CHANNELS <span className="text-cyan-300">→</span></span>
          </div>
        </header>

        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3 font-mono text-[10px] tracking-[0.16em] text-slate-500"><span>LIVE COMMUNITY NETWORK</span><span className="text-cyan-300"><i className="mr-2 inline-block size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_currentColor]" />6 CHANNELS ONLINE</span></div>

        <div className="relative mx-auto mb-14 max-w-6xl md:h-[590px]">
          <div className="relative flex flex-col items-center gap-3 md:block md:size-full">
            {socials.map((soc, idx) => {
              const Icon = soc.icon;
              const isActive = activeNode === soc.name;
              return (
                <React.Fragment key={soc.name}>
                  <div className={`pointer-events-none absolute hidden h-px origin-left bg-cyan-200/15 transition-all duration-300 md:block ${soc.line} ${isActive ? 'bg-cyan-200/70 shadow-[0_0_8px_rgba(103,232,249,0.5)]' : ''}`} />
                  <motion.a href={soc.url} target={soc.url.startsWith('/') ? undefined : '_blank'} rel={soc.url.startsWith('/') ? undefined : 'noopener noreferrer'} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: activeNode && !isActive ? 0.42 : 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} onMouseEnter={() => { setActiveNode(soc.name); soundFx.playHover(); }} onMouseLeave={() => setActiveNode(null)} onClick={() => soundFx.playClick()} className={`group relative z-10 block w-full border bg-[#0b1114]/95 p-4 transition-all duration-200 hover:-translate-y-1 md:absolute md:w-60 ${soc.position} ${isActive ? 'border-cyan-300/75 shadow-[0_0_28px_rgba(34,211,238,0.16)]' : 'border-slate-700/80 hover:border-cyan-300/55'}`}>
                    <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><Icon className="size-5 shrink-0" style={{ color: soc.color }} /><span className="font-mono text-[11px] font-bold text-white">{soc.name}</span></div><ExternalLink className="size-3 text-slate-600 transition-colors group-hover:text-cyan-300" /></div>
                    <div className="mt-3 flex items-center justify-between gap-2 font-mono text-[9px] text-slate-500"><span className="truncate">{soc.handle}</span><span className="whitespace-nowrap text-cyan-300">{soc.members}</span></div>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{soc.desc}</p>
                    <div className="mt-3 border-t border-slate-800 pt-2 font-mono text-[10px] tracking-wider text-cyan-300">CONNECT <ArrowRight className="ml-1 inline size-3 transition-transform group-hover:translate-x-1" /></div>
                  </motion.a>
                </React.Fragment>
              );
            })}

            <motion.div initial={{ scale: 0.92, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} className={`relative z-20 flex size-44 shrink-0 flex-col items-center justify-center rounded-[1.35rem] border border-cyan-300/60 bg-[#0b1114] text-center shadow-[0_0_45px_rgba(34,211,238,0.12)] transition-transform duration-300 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 sm:size-48 ${activeNode ? 'scale-[1.025] shadow-[0_0_55px_rgba(34,211,238,0.2)]' : ''}`}><Bot className="mb-3 size-7 text-cyan-300" /><span className="font-mono text-[10px] tracking-[0.22em] text-cyan-300">AI/ML CLUB</span><strong className="mt-1 font-mono text-lg text-white">FUTURE LAB</strong><span className="mt-3 border-t border-slate-700 px-3 pt-2 font-mono text-[9px] text-slate-500">RESEARCH · BUILD · SHARE</span></motion.div>
          </div>
        </div>

        <motion.a href={lab.url} onClick={() => soundFx.playClick()} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group mx-auto mb-14 block max-w-3xl border border-cyan-300/35 bg-cyan-300/[0.04] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-300/70 hover:bg-cyan-300/[0.07] sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-cyan-300"><Bot className="size-4" />VIRTUAL AI LAB</div><h3 className="font-mono text-lg font-bold text-white">IMMERSIVE RESEARCH SPACE</h3><p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-400">{lab.desc}</p></div><span className="shrink-0 font-mono text-[10px] tracking-wider text-cyan-300">ENTER AI LAB <ArrowRight className="ml-1 inline size-3 transition-transform group-hover:translate-x-1" /></span></div></motion.a>

        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 border-y border-cyan-300/25 py-7 text-center sm:flex-row sm:text-left"><div><p className="font-mono text-[10px] tracking-[0.18em] text-cyan-300">ENTER THE AI/ML COMMUNITY</p><p className="mt-2 text-sm text-slate-400">Find researchers. Build projects. Share ideas. Ship something real.</p></div><Link href="/join" onClick={() => soundFx.playClick()} className="inline-flex shrink-0 items-center gap-2 border border-cyan-300/60 bg-cyan-300 px-5 py-3 font-mono text-xs font-bold text-slate-950 transition hover:bg-white"><span>JOIN THE NETWORK</span><ArrowRight className="size-4" /></Link></div>
      </div>
    </section>
  );
}
