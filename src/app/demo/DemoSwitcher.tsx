'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const OPTIONS = [
  { href: '/demo/hero-wave', label: 'Option 1: Hero only' },
  { href: '/demo/site-wave', label: 'Option 2: Site-wide' },
  { href: '/', label: 'Current site' },
];

export default function DemoSwitcher() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Background demo options"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1 p-1 rounded-2xl bg-[#0B1020]/90 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_25px_rgba(0,207,255,0.2)] font-mono text-[11px] sm:text-xs"
    >
      {OPTIONS.map((option) => {
        const active = pathname === option.href;
        return (
          <Link
            key={option.href}
            href={option.href}
            aria-current={active ? 'page' : undefined}
            className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors ${
              active
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
