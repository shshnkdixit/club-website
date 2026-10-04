'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Sparkles, ArrowRight, X, User, CheckCircle2, Download } from 'lucide-react';
import { ClubEvent } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function EventsSection() {
  const { events } = useCMSData();
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false });

  // Upcoming flagship event for the live countdown
  const flagshipEvent = events.find(e => e.isUpcoming) || events[0];

  useEffect(() => {
    if (!flagshipEvent) return;

    const targetDate = new Date(flagshipEvent.date).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isLive: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [flagshipEvent]);

  const handleOpenEvent = (event: ClubEvent) => {
    soundFx.playHologram();
    setSelectedEvent(event);
  };

  return (
    <section id="events" className="relative py-24 sm:py-32 bg-transparent overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-emerald-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
              <Calendar className="w-3.5 h-3.5" />
              <span>INTERACTIVE EVENT UNIVERSE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              UPCOMING WORKSHOPS &{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                HACKATHONS
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-sans max-w-xl">
              Accelerate your machine learning skills with world-class guest lecturers, 36-hour code challenges, and peer-to-peer hackathons.
            </p>
          </div>

          <Link
            href="/events"
            onClick={() => soundFx.playClick()}
            className="self-start md:self-auto inline-flex items-center gap-2 font-mono text-xs text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <span>View Full Event Calendar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Live Flagship Event Countdown Banner */}
        {flagshipEvent && (
          <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-[#0A0A0A] border border-cyan-500/35 shadow-none flex flex-col lg:flex-row items-center justify-between gap-8 font-mono">
            <div className="space-y-2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
                  {timeLeft.isLive ? 'SYSTEM STATUS: LIVE NOW' : 'NEXT UPCOMING FLAGSHIP EVENT'}
                </span>
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white">
                {flagshipEvent.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-xl">
                {flagshipEvent.description}
              </p>
            </div>

            {/* Countdown Clock or Live Indicator */}
            {timeLeft.isLive ? (
              <div className="px-8 py-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-extrabold text-xl animate-pulse shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                ● EVENT IS LIVE NOW
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                {[
                  { label: 'DAYS', val: timeLeft.days },
                  { label: 'HOURS', val: timeLeft.hours },
                  { label: 'MINUTES', val: timeLeft.minutes },
                  { label: 'SECONDS', val: timeLeft.seconds },
                ].map(item => (
                  <div
                    key={item.label}
                    className="p-3 sm:p-4 rounded-2xl bg-[#000000]/90 border border-cyan-500/30 min-w-[65px] sm:min-w-[85px] shadow-none"
                  >
                    <div className="text-2xl sm:text-4xl font-extrabold text-white">
                      {String(item.val).padStart(2, '0')}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-cyan-400/80 uppercase font-bold mt-1 tracking-wider">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, idx) => {
            const eventDate = new Date(event.date);
            const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onClick={() => handleOpenEvent(event)}
                onMouseEnter={() => soundFx.playHover()}
                className="group cursor-pointer p-6 rounded-3xl bg-[#0a0a0a]/75 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400/60 shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:shadow-none transition-all flex flex-col justify-between transform hover:-translate-y-1"
              >
                <div>
                  {/* Top Bar: Date & Type */}
                  <div className="flex items-center justify-between mb-4 font-mono text-xs">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold">
                      {event.type}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {dateStr}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-mono group-hover:text-cyan-300 transition-colors mb-2">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-sans line-clamp-2 mb-4 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </span>

                    {event.speaker && (
                      <span className="flex items-center gap-1 text-slate-300 truncate max-w-[150px]">
                        <User className="w-3 h-3 text-cyan-400" />
                        <span className="truncate">{event.speaker.name}</span>
                      </span>
                    )}
                  </div>

                  {/* Seat availability bar */}
                  {event.totalSeats && (
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>Capacity: {event.registeredCount}/{event.totalSeats} registered</span>
                        <span className="text-emerald-400 font-bold">
                          {event.totalSeats - event.registeredCount} spots left
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                          style={{ width: `${(event.registeredCount / event.totalSeats) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Event Detail & RSVP Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedEvent(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-none z-10 font-mono text-xs overflow-y-auto max-h-[85vh]"
              >
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-4">
                  <div>
                    <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                      {selectedEvent.type}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      {selectedEvent.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Date & Time</span>
                      <p className="text-slate-200 text-xs font-bold mt-0.5">
                        {new Date(selectedEvent.date).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Venue / Lab</span>
                      <p className="text-slate-200 text-xs font-bold mt-0.5">{selectedEvent.venue}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-cyan-400 font-bold mb-1.5">
                      &gt; EVENT DESCRIPTION
                    </h4>
                    <p className="text-slate-300 text-sm font-sans leading-relaxed">
                      {selectedEvent.longDescription || selectedEvent.description}
                    </p>
                  </div>

                  {selectedEvent.speaker && (
                    <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/30 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-400 flex items-center justify-center font-bold text-violet-300">
                        {selectedEvent.speaker.name[0]}
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xs">{selectedEvent.speaker.name}</h5>
                        <p className="text-[11px] text-slate-400">{selectedEvent.speaker.role} • {selectedEvent.speaker.organization}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.agenda && (
                    <div>
                      <h4 className="text-xs uppercase text-cyan-400 font-bold mb-2">
                        &gt; SCHEDULE TIMELINE
                      </h4>
                      <div className="space-y-1.5">
                        {selectedEvent.agenda.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                            <span className="text-cyan-400 font-bold">{item.time}</span>
                            <span className="text-slate-200">{item.activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
                    <Link
                      href="/join"
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedEvent(null);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-none flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Reserve Student Pass</span>
                    </Link>

                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      Close
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
