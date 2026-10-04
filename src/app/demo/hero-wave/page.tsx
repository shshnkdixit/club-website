'use client';

import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import DomainsSection from '@/components/sections/DomainsSection';
import DottedSurface from '@/components/3d/DottedSurface';
import DemoSwitcher from '../DemoSwitcher';

export default function HeroWaveDemo() {
  return (
    <main>
      <HeroSection
        background={
          <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_70%,transparent)]">
            <DottedSurface className="absolute inset-0" size={12} opacity={1} />
          </div>
        }
      />
      <AboutSection />
      <DomainsSection />
      <DemoSwitcher />
    </main>
  );
}
