'use client';

import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import DomainsSection from '@/components/sections/DomainsSection';
import DottedSurface from '@/components/3d/DottedSurface';
import DemoSwitcher from '../DemoSwitcher';

export default function SiteWaveDemo() {
  return (
    <main>
      {/* Covers the global OrbBackground so this demo shows the wave as the only site background */}
      <div aria-hidden="true" className="fixed inset-0 z-[1] bg-[#050816] pointer-events-none" />
      <DottedSurface className="fixed inset-0 z-[2]" opacity={0.7} />
      <div className="relative z-[3]">
        <HeroSection background={<span className="hidden" />} />
        <AboutSection />
        <DomainsSection />
      </div>
      <DemoSwitcher />
    </main>
  );
}
