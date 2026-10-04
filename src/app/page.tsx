'use client';

import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import DomainsSection from '@/components/sections/DomainsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import EventsSection from '@/components/sections/EventsSection';
import ResearchSection from '@/components/sections/ResearchSection';
import HackathonSection from '@/components/sections/HackathonSection';
import TeamSection from '@/components/sections/TeamSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CommunitySection from '@/components/sections/CommunitySection';

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col w-full overflow-hidden">
      {/* 1. Hero Section with 3D Neural Core */}
      <HeroSection background={null} />

      {/* 2. About & 5-Stage Evolution Timeline */}
      <AboutSection />

      {/* 3. AI Domains Explorer */}
      <DomainsSection />

      {/* 4. Student Projects & Interactive Simulators */}
      <ProjectsSection />

      {/* 5. Live Events & Flagship Countdown */}
      <EventsSection />

      {/* 6. Scholarly Research Hub */}
      <ResearchSection />

      {/* 7. HACK.AI 36-Hour Hackathon Arena */}
      <HackathonSection />

      {/* 8. AI Command Center (Team & Faculty) */}
      <TeamSection />

      {/* 9. Achievements & Honor Accolades */}
      <AchievementsSection />

      {/* 10. Student Testimonials Carousel */}
      <TestimonialsSection />

      {/* 11. Community Channels & Join Movement */}
      <CommunitySection />
    </main>
  );
}
