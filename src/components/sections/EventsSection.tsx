'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Search, Sparkles, User, X } from 'lucide-react';
import { ClubEvent } from '@/types';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

const filters = ['ALL', 'WORKSHOPS', 'HACKATHONS', 'RESEARCH'] as const;
type EventFilter = (typeof filters)[number];

export default function EventsSection() {
  const { events } = useCMSData();
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [activeFilter, setActiveFilter] = useState<EventFilter>('ALL');
  const [isLive, setIsLive] = useState(false);
  const featured = events.find((event) => event.isUpcoming) || events[0];
  const upcoming = useMemo(() => events.filter((event) => event.id !== featured?.id), [events, featured]);
  const visibleEvents = useMemo(() => {
    if (activeFilter === 'ALL') return upcoming;
    const category = activeFilter === 'RESEARCH' ? activeFilter : activeFilter.slice(0, -1);
    return upcoming.filter((event) => event.type.toUpperCase().includes(category));
  }, [activeFilter, upcoming]);

  useEffect(() => {
    if (!featured) return;
    const update = () => setIsLive(new Date(featured.date).getTime() <= Date.now());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [featured]);

  const dateParts = (date: string) => {
    const value = new Date(date);
    return { day: value.toLocaleDateString('en-US', { day: '2-digit' }), month: value.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(), full: value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
  };
  const openEvent = (event: ClubEvent) => { soundFx.playHologram(); setSelectedEvent(event); };

  return (
    <section id="events" className="relative overflow-hidden bg-transparent py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-15" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-[150px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-5 border-b border-slate-800/80 pb-7 md:flex-row md:items-end md:justify-between">
          <div><p className="mb-3 flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.22em] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> INTERACTIVE EVENT UNIVERSE</p><h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">UPCOMING WORKSHOPS & <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">HACKATHONS</span></h2></div>
          <Link href="/events" onClick={() => soundFx.playClick()} className="group inline-flex items-center gap-2 pb-1 font-mono text-xs text-cyan-400 hover:text-cyan-200">View Full Event Calendar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
        </header>

        {featured && <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mb-10 min-h-[310px] overflow-hidden rounded-2xl border border-cyan-500/35 bg-[#071416]/90 p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)] sm:p-9 lg:p-12">
          <div className="absolute inset-y-0 right-0 hidden w-2/5 lg:block" aria-hidden="true"><div className="absolute right-20 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full border border-cyan-400/25" /><div className="absolute right-28 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full border border-emerald-400/35" /><div className="absolute right-5 top-1/2 h-px w-72 rotate-45 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" /><div className="absolute right-16 top-1/2 h-px w-72 -rotate-45 bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" /><div className="absolute right-36 top-20 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_#67e8f9]" /></div>
          <div className="relative max-w-2xl"><div className="mb-5 flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.2em] text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> {isLive ? 'LIVE NOW' : 'FEATURED EVENT'}</div><h3 className="max-w-xl text-2xl font-extrabold leading-tight text-white sm:text-4xl">{featured.title}</h3><p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">{featured.description}</p><div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] text-slate-300"><span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-cyan-400" />{dateParts(featured.date).full}</span><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-400" />{featured.venue}</span>{featured.speaker && <span className="inline-flex items-center gap-2"><User className="h-4 w-4 text-cyan-400" />{featured.speaker.name}</span>}</div><button onClick={() => openEvent(featured)} className="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 font-mono text-xs font-bold text-slate-950 hover:bg-white"><Sparkles className="h-4 w-4" /> JOIN LIVE <ArrowRight className="h-4 w-4" /></button></div>
        </motion.article>}

        <nav className="mb-3 flex items-center justify-between border-b border-slate-800/80 pb-3" aria-label="Event filters"><div className="flex flex-wrap gap-5 sm:gap-8">{filters.map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`font-mono text-[10px] font-bold tracking-[0.16em] ${activeFilter === filter ? 'text-cyan-300' : 'text-slate-500 hover:text-slate-200'}`}>{filter}</button>)}</div><Search className="h-4 w-4 text-slate-500" aria-label="Search events" /></nav>
        <div className="divide-y divide-slate-800/80">{visibleEvents.map((event, index) => { const date = dateParts(event.date); return <motion.button key={event.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} onClick={() => openEvent(event)} onMouseEnter={() => soundFx.playHover()} className="group grid w-full grid-cols-[58px_1fr_auto] items-center gap-4 py-6 text-left hover:bg-cyan-400/[0.035] sm:grid-cols-[100px_1fr_190px_24px] sm:gap-6 sm:px-4"><div className="font-mono leading-none"><div className="text-2xl font-bold text-white">{date.day}</div><div className="mt-1 text-[10px] tracking-widest text-cyan-400">{date.month}</div></div><div className="min-w-0"><p className="mb-2 font-mono text-[10px] font-bold tracking-widest text-emerald-300">{event.type}</p><h3 className="truncate text-base font-bold text-slate-100 group-hover:text-cyan-200 sm:text-lg">{event.title}</h3><p className="mt-1 truncate text-xs text-slate-500">{event.description}</p></div><div className="hidden min-w-0 font-mono text-[10px] text-slate-500 sm:block"><p className="truncate">{event.venue}</p><p className="mt-1 truncate text-slate-400">{event.speaker?.name || 'AIML Club'}</p></div><ArrowRight className="h-4 w-4 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-cyan-300" /></motion.button>; })}</div>

        <AnimatePresence>{selectedEvent && <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEvent(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md" /><motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative z-10 w-full max-w-2xl rounded-2xl border border-cyan-500/40 bg-[#0a0a0a] p-6 font-mono sm:p-8"><div className="flex items-start justify-between border-b border-cyan-500/20 pb-4"><div><span className="text-[10px] font-bold text-cyan-300">{selectedEvent.type}</span><h3 className="mt-1 text-xl font-bold text-white">{selectedEvent.title}</h3></div><button onClick={() => setSelectedEvent(null)} aria-label="Close event details"><X className="h-5 w-5 text-slate-400" /></button></div><p className="mt-5 font-sans text-sm leading-relaxed text-slate-300">{selectedEvent.longDescription || selectedEvent.description}</p><div className="mt-5 grid gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:grid-cols-2"><div><span className="text-[10px] text-slate-400">DATE & TIME</span><p className="mt-1 font-bold text-slate-200">{new Date(selectedEvent.date).toLocaleString()}</p></div><div><span className="text-[10px] text-slate-400">VENUE / LAB</span><p className="mt-1 font-bold text-slate-200">{selectedEvent.venue}</p></div></div><div className="mt-6 flex justify-end border-t border-cyan-500/20 pt-4"><Link href="/join" onClick={() => { soundFx.playClick(); setSelectedEvent(null); }} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-bold text-black hover:bg-neutral-200"><Sparkles className="h-4 w-4" /> Reserve Student Pass</Link></div></motion.div></div>}</AnimatePresence>
      </div>
    </section>
  );
}
