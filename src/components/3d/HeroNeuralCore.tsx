'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { soundFx } from '@/lib/soundFx';

const DOMAINS = [
  { label: 'AI / ML', detail: 'Learning systems & intelligent models', position: 'top-0 left-1/2 -translate-x-1/2' },
  { label: 'ROBOTICS', detail: 'Embodied autonomy & control', position: 'top-[24%] right-[-2%]' },
  { label: 'COMPUTER VISION', detail: 'Spatial perception & understanding', position: 'bottom-[19%] right-[-7%]' },
  { label: 'GENERATIVE AI', detail: 'Synthesis & creative intelligence', position: 'bottom-0 left-1/2 -translate-x-1/2' },
  { label: 'NLP', detail: 'Language, dialogue & reasoning', position: 'bottom-[19%] left-[-4%]' },
  { label: 'AI AGENTS', detail: 'Orchestration & decision systems', position: 'top-[24%] left-[-2%]' },
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
      <div className="relative size-[300px] max-w-[78vw] sm:size-[360px]">
        <motion.div
          aria-hidden="true"
          className="absolute inset-[10%] rounded-full bg-cyan-400/10 blur-3xl"
          animate={{ opacity: expanded ? 0.8 : 0.45, scale: expanded ? 1.12 : 0.94 }}
          transition={{ duration: 1.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />

        <motion.button
          type="button"
          aria-label={expanded ? 'Collapse AI core domains' : 'Expand AI core domains'}
          aria-expanded={expanded}
          onClick={toggleCore}
          onMouseEnter={() => soundFx.playHover()}
          className="absolute left-1/2 top-1/2 z-20 flex size-[148px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-200/25 bg-slate-950/70 shadow-[0_0_45px_rgba(34,211,238,0.16),inset_0_0_28px_rgba(148,163,184,0.08)] backdrop-blur-xl transition-shadow duration-700 hover:shadow-[0_0_70px_rgba(34,211,238,0.3),inset_0_0_36px_rgba(148,163,184,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
          whileTap={{ scale: 0.96 }}
        >
          <span className="absolute inset-3 rounded-full border border-white/10" />
          <span className="absolute inset-7 rounded-full bg-gradient-to-br from-cyan-300/25 via-slate-100/5 to-violet-400/20 blur-md" />
          <span className="relative flex flex-col items-center gap-1 font-mono">
            <span className="text-[10px] tracking-[0.35em] text-cyan-200/70">AI</span>
            <span className="text-2xl font-medium tracking-[0.18em] text-white">CORE</span>
            <span className="mt-1 flex items-center gap-1.5 text-[8px] tracking-[0.22em] text-emerald-300/80"><span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_currentColor]" />ONLINE</span>
          </span>
        </motion.button>

        {[0, 1, 2, 3].map((ring) => (
          <motion.span
            key={ring}
            aria-hidden="true"
            className={`absolute left-1/2 top-1/2 rounded-full border ${ring === 2 ? 'border-violet-300/20' : 'border-cyan-200/20'}`}
            style={{ width: `${[58, 75, 91, 68][ring]}%`, height: `${[24, 34, 48, 78][ring]}%`, transform: 'translate(-50%, -50%) rotate(-18deg)' }}
            animate={{ rotate: ring % 2 ? [342, 360] : [342, 324] }}
            transition={{ duration: 18 + ring * 3, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {DOMAINS.map((domain, index) => (
          <motion.button
            key={domain.label}
            type="button"
            aria-label={`Highlight ${domain.label}`}
            onClick={() => { soundFx.playNeuralChime(); setActiveDomain(activeDomain === domain.label ? null : domain.label); }}
            onMouseEnter={() => soundFx.playHover()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: expanded ? 1 : 0, scale: expanded ? 1 : 0.8, pointerEvents: expanded ? 'auto' : 'none' }}
            transition={{ delay: expanded ? index * 0.06 : 0, duration: 0.35 }}
            className={`absolute z-30 ${domain.position} whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[8px] tracking-[0.13em] transition-colors ${activeDomain === domain.label ? 'border-cyan-200/70 bg-cyan-300/15 text-cyan-100' : 'border-white/10 bg-slate-950/55 text-slate-400 hover:border-cyan-200/40 hover:text-cyan-200'}`}
          >
            {domain.label}
          </motion.button>
        ))}

        <AnimatePresence>
          {active && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute bottom-[-54px] left-1/2 z-40 -translate-x-1/2 whitespace-nowrap text-center font-mono">
              <p className="text-[9px] tracking-[0.16em] text-cyan-200">{active.label}</p>
              <p className="mt-1 text-[9px] text-slate-500">{active.detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
