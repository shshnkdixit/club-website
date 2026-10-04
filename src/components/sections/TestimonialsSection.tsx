'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Sparkles, Building2 } from 'lucide-react';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function TestimonialsSection() {
  const { testimonials } = useCMSData();
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    soundFx.playClick();
    setActiveIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    soundFx.playClick();
    setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative py-24 sm:py-32 bg-transparent overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-violet-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-[11px] font-mono text-violet-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ALUMNI & STUDENT EXPERIENCES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            VOICES OF THE{' '}
            <span className="bg-gradient-to-r from-violet-400 via-pink-300 to-cyan-400 bg-clip-text text-transparent">
              RESEARCHERS
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base font-sans">
            Hear how our members turned club projects into top-tier research fellowships, publications, and AI engineering careers.
          </p>
        </div>

        {/* 3D Testimonial Carousel Card */}
        <div className="max-w-3xl mx-auto relative">
          <motion.div
            key={testimonials[activeIndex].id}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.4 }}
            className="p-8 sm:p-12 rounded-3xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-cyan-500/30 shadow-none relative font-mono text-xs"
          >
            <Quote className="w-10 h-10 text-cyan-500/30 absolute top-6 right-8" />

            <p className="text-base sm:text-xl text-slate-200 font-sans italic leading-relaxed mb-8">
              &quot;{testimonials[activeIndex].quote}&quot;
            </p>

            <div className="flex items-center justify-between border-t border-cyan-500/20 pt-6">
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[activeIndex].avatar}
                  alt={testimonials[activeIndex].name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400"
                />
                <div>
                  <h4 className="text-base font-bold text-white font-mono">
                    {testimonials[activeIndex].name}
                  </h4>
                  <p className="text-xs text-cyan-400">{testimonials[activeIndex].role}</p>
                  <p className="text-[11px] text-slate-400">{testimonials[activeIndex].program}</p>
                  {testimonials[activeIndex].companyOrPlacement && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                      <Building2 className="w-3 h-3" />
                      <span>{testimonials[activeIndex].companyOrPlacement}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 hover:text-white border border-cyan-500/40 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  soundFx.playClick();
                  setActiveIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  activeIndex === i ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
