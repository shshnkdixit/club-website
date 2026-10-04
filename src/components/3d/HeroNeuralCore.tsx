'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { soundFx } from '@/lib/soundFx';

const DOMAINS = [
  { label: 'AI / ML', detail: 'Learning systems & intelligent models', position: 'top-[-2%] left-1/2 -translate-x-1/2' },
  { label: 'ROBOTICS', detail: 'Embodied autonomy & control', position: 'top-[24%] right-[2%]' },
  { label: 'COMPUTER VISION', detail: 'Spatial perception & understanding', position: 'bottom-[24%] right-[-2%]' },
  { label: 'GENERATIVE AI', detail: 'Synthesis & creative intelligence', position: 'bottom-[-2%] left-1/2 -translate-x-1/2' },
  { label: 'NLP', detail: 'Language, dialogue & reasoning', position: 'bottom-[24%] left-[-2%]' },
  { label: 'AI AGENTS', detail: 'Orchestration & decision systems', position: 'top-[24%] left-[2%]' },
];

export default function HeroNeuralCore() {
  const [expanded, setExpanded] = useState(false);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const active = DOMAINS.find((domain) => domain.label === activeDomain);

  const toggleCore = () => {
    soundFx.playNeuralChime();
    setExpanded((value) => !value);
    setActiveDomain(null);
  };

  return (
    <div className="relative flex size-full min-h-[360px] items-center justify-center sm:min-h-[480px]">
      <div
        className="group relative size-[260px] max-w-[78vw] sm:size-[300px]"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => { setExpanded(false); setActiveDomain(null); }}
      >
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 size-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl"
          animate={{ opacity: expanded ? 0.7 : 0.35, scale: expanded ? 1.08 : 0.94 }}
          transition={{ duration: 2.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />

        <motion.button
          type="button"
          aria-label={expanded ? 'Collapse AI core domains' : 'Expand AI core domains'}
          aria-expanded={expanded}
          onClick={toggleCore}
          onMouseEnter={() => soundFx.playHover()}
          onFocus={() => setExpanded(true)}
          className="absolute left-1/2 top-1/2 z-20 flex size-[132px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-100/25 bg-slate-950/75 shadow-[0_0_42px_rgba(34,211,238,0.13),inset_0_0_24px_rgba(148,163,184,0.08)] backdrop-blur-xl transition-shadow duration-700 hover:shadow-[0_0_62px_rgba(34,211,238,0.25),inset_0_0_32px_rgba(148,163,184,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
          whileTap={{ scale: 0.96 }}
        >
          <span className="absolute inset-3 rounded-full border border-white/10" />
          <span className="absolute inset-7 rounded-full bg-gradient-to-br from-cyan-300/20 via-slate-100/5 to-teal-300/15 blur-md" />
          <span className="relative flex flex-col items-center gap-1 font-mono">
            <span className="text-[9px] tracking-[0.35em] text-cyan-200/70">AI</span>
            <span className="text-xl font-medium tracking-[0.18em] text-white">CORE</span>
            <span className="mt-1 flex items-center gap-1.5 text-[8px] tracking-[0.22em] text-emerald-300/80"><span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_currentColor]" />ONLINE</span>
          </span>
        </motion.button>

        {[0, 1].map((ring) => (
          <motion.span
            key={ring}
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 rounded-full border border-cyan-100/20"
            style={{ width: `${[58, 75][ring]}%`, height: `${[58, 75][ring]}%`, transform: 'translate(-50%, -50%)' }}
            animate={{ rotate: ring === 0 ? [0, 360] : [360, 0] }}
            transition={{ duration: 24 + ring * 8, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {DOMAINS.map((domain, index) => (
          <motion.button
            key={domain.label}
            type="button"
            aria-label={`Highlight ${domain.label}`}
            onClick={() => { soundFx.playNeuralChime(); setActiveDomain(activeDomain === domain.label ? null : domain.label); }}
            onMouseEnter={() => soundFx.playHover()}
            initial={{ opacity: 0, y: 5, scale: 0.92 }}
            animate={{ opacity: expanded ? 1 : 0, y: expanded ? 0 : 5, scale: expanded ? 1 : 0.92, pointerEvents: expanded ? 'auto' : 'none' }}
            transition={{ delay: expanded ? index * 0.04 : 0, duration: 0.3 }}
            className={`absolute z-30 ${domain.position} whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[8px] tracking-[0.13em] transition-colors ${activeDomain === domain.label ? 'border-cyan-200/70 bg-cyan-300/15 text-cyan-100' : 'border-white/10 bg-slate-950/55 text-slate-400 hover:border-cyan-200/40 hover:text-cyan-200'}`}
          >
            {domain.label}
          </motion.button>
        ))}

        <AnimatePresence>
          {active && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute bottom-[-46px] left-1/2 z-40 -translate-x-1/2 whitespace-nowrap text-center font-mono">
              <p className="text-[9px] tracking-[0.16em] text-cyan-200">{active.label}</p>
              <p className="mt-1 text-[9px] text-slate-500">{active.detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
