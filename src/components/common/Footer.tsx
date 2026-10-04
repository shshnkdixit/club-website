'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, Bot, Sparkles, Terminal, Heart, ExternalLink } from 'lucide-react';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function Footer() {
  const pathname = usePathname();
  const { settings, domains } = useCMSData();

  if (pathname === '/ai-lab') {
    return null;
  }

  const playHover = () => soundFx.playHover();
  const playClick = () => soundFx.playClick();

  return (
    <footer className="relative bg-[#040612]/80 backdrop-blur-md border-t border-cyan-500/20 pt-16 pb-12 overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-cyan-500/15">
          {/* Col 1: Club Identity & Live Telemetry */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              onClick={playClick}
              onMouseEnter={playHover}
              className="inline-flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,207,255,0.3)] flex items-center justify-center overflow-hidden group-hover:shadow-[0_0_20px_rgba(0,207,255,0.6)] group-hover:scale-105 transition-all">
                <img
                  src="/images/logo.png"
                  alt="AI/ML Club Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-mono font-extrabold text-lg text-white tracking-wider">
                {settings.clubName}
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed max-w-sm">
              &quot;Building the intelligence of tomorrow.&quot; A premier student-driven artificial intelligence, machine learning, and robotics research community.
            </p>

            {/* Live System Telemetry Box */}
            <div className="p-3 rounded-xl bg-[#0a0a0a]/90 border border-cyan-500/25 max-w-sm space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between text-cyan-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AI CORE STATUS
                </span>
                <span className="text-emerald-400 font-bold">ONLINE // 99.9%</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>NODES CONNECTED: {settings.stats.members}+</span>
                <span>LATENCY: 4.2ms</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold mb-4 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> Navigation
            </h4>
            <ul className="space-y-2.5 font-mono text-xs text-slate-400">
              <li>
                <Link href="/" onClick={playClick} onMouseEnter={playHover} className="hover:text-cyan-300 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/#domains" onClick={playClick} onMouseEnter={playHover} className="hover:text-cyan-300 transition-colors">
                  AI Domains
                </Link>
              </li>
              <li>
                <Link href="/projects" onClick={playClick} onMouseEnter={playHover} className="hover:text-cyan-300 transition-colors">
                  Student Projects & Simulators
                </Link>
              </li>
              <li>
                <Link href="/events" onClick={playClick} onMouseEnter={playHover} className="hover:text-cyan-300 transition-colors">
                  Events & Hackathons
                </Link>
              </li>
              <li>
                <Link href="/research" onClick={playClick} onMouseEnter={playHover} className="hover:text-cyan-300 transition-colors">
                  Research Papers & CVPR
                </Link>
              </li>
              <li>
                <Link href="/team" onClick={playClick} onMouseEnter={playHover} className="hover:text-cyan-300 transition-colors">
                  AI Command Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Research Domains */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold mb-4 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Core Disciplines
            </h4>
            <ul className="space-y-2 font-mono text-xs text-slate-400">
              {domains.slice(0, 6).map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/#domains`}
                    onClick={playClick}
                    onMouseEnter={playHover}
                    className="hover:text-cyan-300 transition-colors block truncate"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Virtual Lab & Community */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold mb-4 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" /> Interactive Lab
            </h4>
            <div className="space-y-3 font-mono text-xs">
              <Link
                href="/ai-lab"
                onClick={playClick}
                onMouseEnter={playHover}
                className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/15 to-violet-500/15 border border-cyan-500/40 hover:border-cyan-400 block group transition-all"
              >
                <span className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
                  <Bot className="w-4 h-4 animate-bounce" /> Virtual AI Lab
                </span>
                <span className="text-[10px] text-slate-400 block group-hover:text-slate-300">
                  Interact with 3D Humanoid Robot via voice & text commands.
                </span>
              </Link>

              <div className="pt-2">
                <p className="text-[11px] text-slate-400 mb-2 uppercase tracking-wider">Social Channels</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <a
                    href={settings.socialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-400 text-slate-300 hover:text-indigo-300 transition-all flex items-center gap-1"
                  >
                    Discord <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href={settings.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1"
                  >
                    GitHub <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-blue-600/30 border border-slate-700 hover:border-blue-400 text-slate-300 hover:text-blue-300 transition-all flex items-center gap-1"
                  >
                    LinkedIn <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href={settings.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-400 text-slate-300 hover:text-emerald-300 transition-all flex items-center gap-1"
                  >
                    WhatsApp <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>© {new Date().getFullYear()} University AI/ML Club. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" onClick={playClick} className="hover:text-cyan-300 transition-colors">
              Contact Transmission
            </Link>
            <span>•</span>
            <Link href="/join" onClick={playClick} className="hover:text-cyan-300 transition-colors">
              Join Cohort
            </Link>
            <span>•</span>
            <Link href="/admin-login" onClick={playClick} className="text-amber-400/80 hover:text-amber-300 transition-colors">
              Admin CMS Gateway
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
