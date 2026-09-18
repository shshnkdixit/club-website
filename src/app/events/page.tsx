'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Play,
  Film,
  Terminal,
  FileSpreadsheet,
  Zap,
  Tag,
  AlertCircle,
  X,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useCMSData, cmsStore } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';
import { ClubEvent, EventRSVP } from '@/types';

type EventFilter = 'ALL' | 'UPCOMING' | 'LIVE' | 'COMPLETED';

export default function EventsPage() {
  const { events, refresh } = useCMSData();

  const [activeFilter, setActiveFilter] = useState<EventFilter>('ALL');
  const [selectedRsvpEvent, setSelectedRsvpEvent] = useState<ClubEvent | null>(null);
  const [selectedRecapEvent, setSelectedRecapEvent] = useState<ClubEvent | null>(null);

  // RSVP Modal Form State
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    uid: '',
    email: '',
    contactNo: ''
  });
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpConfirmed, setRsvpConfirmed] = useState<EventRSVP | null>(null);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const isLive = e.status === 'LIVE' || e.isLive;
      const isUpcoming = e.status === 'UPCOMING' || (e.isUpcoming && !isLive);
      const isCompleted = e.status === 'COMPLETED' || (!e.isUpcoming && !e.isLive && e.status !== 'LIVE' && e.status !== 'UPCOMING');

      if (activeFilter === 'UPCOMING') return isUpcoming;
      if (activeFilter === 'LIVE') return isLive;
      if (activeFilter === 'COMPLETED') return isCompleted;
      return true;
    });
  }, [events, activeFilter]);

  // Counts
  const counts = useMemo(() => {
    return {
      ALL: events.length,
      UPCOMING: events.filter(e => e.status === 'UPCOMING' || (e.isUpcoming && e.status !== 'LIVE' && !e.isLive)).length,
      LIVE: events.filter(e => e.status === 'LIVE' || e.isLive).length,
      COMPLETED: events.filter(e => e.status === 'COMPLETED' || (!e.isUpcoming && !e.isLive && e.status !== 'LIVE' && e.status !== 'UPCOMING')).length
    };
  }, [events]);

  const handleOpenRsvp = (event: ClubEvent) => {
    soundFx.playClick();
    setSelectedRsvpEvent(event);
    setRsvpConfirmed(null);
    setRsvpForm({ name: '', uid: '', email: '', contactNo: '' });
  };

  const handleOpenRecap = (event: ClubEvent) => {
    soundFx.playHologram();
    if (event.recapUrl && event.recapUrl.startsWith('http')) {
      window.open(event.recapUrl, '_blank', 'noreferrer');
      return;
    }
    setSelectedRecapEvent(event);
  };

  const handleSubmitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRsvpEvent || !rsvpForm.name || !rsvpForm.email) return;

    setIsSubmittingRsvp(true);
    soundFx.playClick();

    setTimeout(() => {
      const generatedRsvp: EventRSVP = {
        id: `rsvp-${Date.now()}`,
        eventId: selectedRsvpEvent.id,
        eventTitle: selectedRsvpEvent.title,
        studentName: rsvpForm.name,
        studentUid: rsvpForm.uid || `24BCS${Math.floor(1000 + Math.random() * 9000)}`,
        email: rsvpForm.email,
        phone: rsvpForm.contactNo || '+1 (555) 000-0000',
        department: 'Engineering',
        year: '1st Year',
        registeredAt: new Date().toISOString(),
        status: 'Confirmed'
      };

      cmsStore.saveEventRsvp(generatedRsvp);

      // Increment registered count on the event
      const updatedEvent = {
        ...selectedRsvpEvent,
        registeredCount: (selectedRsvpEvent.registeredCount || 0) + 1
      };
      cmsStore.saveEvent(updatedEvent);

      refresh();
      setIsSubmittingRsvp(false);
      setRsvpConfirmed(generatedRsvp);
      soundFx.playCelebration();
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 font-mono selection:bg-cyan-500 selection:text-black">
      {/* Ambient Neural Grids & Spotlights */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[750px] h-[350px] bg-cyan-500/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[350px] bg-violet-500/10 blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Top Header Banner */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs shadow-[0_0_15px_rgba(0,207,255,0.2)]">
            <Calendar className="w-3.5 h-3.5" />
            <span>OPERATIONAL CALENDAR & WORKSHOPS HUD</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                EVENTS & WORKSHOPS
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl mt-2 font-sans">
                Browse upcoming hands-on bootcamps, participate in 48-hour hackathon sprints, reserve seats in real time, and access archived session recordings and repositories.
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div className="flex items-center gap-3 bg-[#070D1F] px-4 py-2.5 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-bold font-mono">
                {counts.UPCOMING + counts.LIVE} SESSIONS ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* LIFECYCLE FILTER TABS */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs no-scrollbar">
          {[
            { id: 'ALL', label: 'ALL EVENTS', count: counts.ALL },
            { id: 'UPCOMING', label: 'UPCOMING', count: counts.UPCOMING },
            { id: 'LIVE', label: 'LIVE / ONGOING', count: counts.LIVE, isLivePulse: true },
            { id: 'COMPLETED', label: 'COMPLETED ARCHIVE', count: counts.COMPLETED }
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setActiveFilter(tab.id as EventFilter);
                }}
                className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,207,255,0.3)]'
                    : 'bg-[#070D1F] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {tab.isLivePulse && counts.LIVE > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
                )}
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* EVENTS QUEST MATRIX GRID */}
        {/* ────────────────────────────────────────────────────────── */}
        {filteredEvents.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#070D1F] border border-slate-800 text-center space-y-3">
            <Terminal className="w-12 h-12 mx-auto text-slate-500" />
            <h3 className="text-base font-bold text-white uppercase">No Sessions in this Filter</h3>
            <p className="text-xs text-slate-400">Try switching to the [ALL] or [UPCOMING] filter tabs above.</p>
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs"
            >
              Show All Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const isLive = event.status === 'LIVE' || event.isLive;
              const isUpcoming = event.status === 'UPCOMING' || (event.isUpcoming && !isLive);
              const isCompleted = event.status === 'COMPLETED' || (!event.isUpcoming && !event.isLive && event.status !== 'LIVE' && event.status !== 'UPCOMING');
              const mediaUrl = event.posterUrl || event.bannerImage;

              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="quest-card flex flex-col justify-between group h-full"
                >
                  <div className="space-y-4">
                    {/* Media Header (Video / Image / Fallback) */}
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                      {event.mediaType === 'video' && mediaUrl ? (
                        <video
                          src={mediaUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : mediaUrl ? (
                        <img
                          src={mediaUrl}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#070D1F]">
                          <Film className="w-10 h-10 text-cyan-500/40" />
                        </div>
                      )}

                      {/* Top Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070D1F] via-transparent to-transparent opacity-80 pointer-events-none" />

                      {/* Status Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        {isLive && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                            LIVE NOW
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="px-2.5 py-0.5 rounded-full bg-violet-950/90 border border-violet-400 text-violet-300 text-[10px] font-black tracking-wider shadow-[0_0_10px_rgba(124,58,237,0.3)]">
                            UPCOMING
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-400 text-[10px] font-bold">
                            COMPLETED
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900/90 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                          {event.type}
                        </span>
                      </div>
                    </div>

                    {/* Event Typography & Synopsis */}
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-3 font-sans leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    {/* Telemetry Metadata */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 font-mono">
                      <div className="flex items-center gap-2 text-cyan-300">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {event.time && <span>• {event.time}</span>}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-violet-400" />
                        <span className="line-clamp-1">{event.location || event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                        <span><strong className="text-white font-mono">{event.registeredCount || 0}</strong> registered / {event.totalSeats || 100} seats</span>
                      </div>
                    </div>
                  </div>

                  {/* Adaptive Action Button */}
                  <div className="pt-4 mt-4 border-t border-slate-800/60">
                    {isUpcoming || isLive ? (
                      <button
                        type="button"
                        onClick={() => handleOpenRsvp(event)}
                        className="btn-cyber w-full py-2.5 text-xs flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(0,207,255,0.4)]"
                      >
                        <span>Register / RSVP →</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenRecap(event)}
                        className="btn-cyber-outline w-full py-2.5 text-xs flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Recap →</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE RSVP & SEAT RESERVATION MODAL */}
      {/* ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedRsvpEvent && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pt-24 sm:pt-28 pb-8 bg-black/90 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg max-h-[85vh] my-auto p-6 sm:p-8 rounded-3xl bg-[#070D1F] border-2 border-cyan-500/40 shadow-[0_0_60px_rgba(0,207,255,0.25)] space-y-6 z-10 overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setSelectedRsvpEvent(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {!rsvpConfirmed ? (
                <>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-cyan-300 font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>OFFICIAL RSVP TICKET RESERVATION</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedRsvpEvent.title}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {new Date(selectedRsvpEvent.date).toLocaleDateString()} • {selectedRsvpEvent.location || selectedRsvpEvent.venue}
                    </p>
                  </div>

                  <form onSubmit={handleSubmitRsvp} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block uppercase text-[11px]">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={rsvpForm.name}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                          placeholder="e.g. Aarav Sharma"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block uppercase text-[11px]">
                        Student UID / University Roll Number *
                      </label>
                      <div className="relative">
                        <Terminal className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={rsvpForm.uid}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, uid: e.target.value })}
                          placeholder="e.g. 21BCS1024"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block uppercase text-[11px]">
                          University Email *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={rsvpForm.email}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                            placeholder="student@cuchd.in"
                            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block uppercase text-[11px]">
                          WhatsApp Contact Number *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={rsvpForm.contactNo}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, contactNo: e.target.value })}
                            placeholder="+1 (555) 234-5678"
                            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingRsvp}
                      className="btn-cyber w-full py-3 text-xs font-black flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <span>{isSubmittingRsvp ? 'CONFIRMING SEAT...' : 'CONFIRM SEAT RESERVATION →'}</span>
                    </button>
                  </form>
                </>
              ) : (
                /* Instant Confirmation Screen */
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">
                      SEAT CONFIRMED!
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Your ticket reservation has been logged into the club network.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>ATTENDEE:</span>
                      <strong className="text-white">{rsvpConfirmed.studentName}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>STUDENT UID:</span>
                      <strong className="text-cyan-300">{rsvpConfirmed.studentUid}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>SESSION:</span>
                      <strong className="text-white line-clamp-1">{rsvpConfirmed.eventTitle}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>STATUS:</span>
                      <strong className="text-emerald-400">CONFIRMED (RSVP TICKET)</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedRsvpEvent(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                  >
                    Done / Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────── */}
      {/* RECAP / ARCHIVE MODAL */}
      {/* ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedRecapEvent && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pt-24 sm:pt-28 pb-8 bg-black/90 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md max-h-[85vh] my-auto p-6 rounded-3xl bg-[#070D1F] border border-cyan-500/40 space-y-4 z-10 overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setSelectedRecapEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-bold">
                  SESSION ARCHIVE
                </span>
                <h3 className="text-lg font-bold text-white">{selectedRecapEvent.title}</h3>
                <p className="text-xs text-slate-400 font-sans">
                  Slide decks, code notebooks, and session notes for this completed workshop have been stored in the club&apos;s GitHub repository and knowledge vault.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Link
                  href="/resources"
                  className="btn-cyber flex-1 py-2 text-xs text-center"
                >
                  <span>Open Knowledge Vault →</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
