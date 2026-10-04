'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Zap, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { useCMSData } from '@/lib/cmsStore';

const BADGE_MAP: Record<string, React.ElementType> = {
  Trophy,
  Award,
  Zap,
  Star,
  ShieldCheck
};

export default function AchievementsSection() {
  const { achievements, settings } = useCMSData();

  return (
    <section className="relative py-24 sm:py-32 bg-transparent overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-dots-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-amber-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300">
            <Trophy className="w-3.5 h-3.5" />
            <span>EXCELLENCE & RECOGNITION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            PROVEN TRACK RECORD OF{' '}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400 bg-clip-text text-transparent">
              INNOVATION
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base font-sans">
            Our student researchers continually win competitive hackathons, secure top compute grants, and publish groundbreaking papers.
          </p>
        </div>

        {/* Dynamic Metric Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 font-mono">
          {[
            { label: 'Compute & Grant Funding', value: '$45,000+', desc: 'NVIDIA Academic AI' },
            { label: 'Hackathon Victories', value: '16 Wins', desc: 'National & Regional' },
            { label: 'Global Citations', value: '1,420+', desc: 'Across 11 Publications' },
            { label: 'Industry Hires', value: '100%', desc: 'Top Tier Placements' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#0a0a0a]/90 border border-amber-500/25 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 mb-1">
                {item.value}
              </div>
              <div className="text-xs font-bold text-slate-200 uppercase">{item.label}</div>
              <div className="text-[10px] text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Horizontal Achievement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((ach, idx) => {
            const Icon = BADGE_MAP[ach.badgeIcon] || Trophy;
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-3xl bg-[#0a0a0a]/75 backdrop-blur-md border border-amber-500/20 hover:border-amber-400/50 shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-1.5 flex-1 font-mono">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-400 font-bold uppercase">{ach.category}</span>
                    <span className="text-slate-500">{ach.year}</span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {ach.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {ach.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 mt-2">
                    <span>{ach.issuer}</span>
                    {ach.rankOrMetric && (
                      <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {ach.rankOrMetric}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
