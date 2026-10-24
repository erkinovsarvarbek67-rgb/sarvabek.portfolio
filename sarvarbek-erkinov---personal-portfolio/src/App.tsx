import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { ScrollProgress } from './components/ScrollProgress';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CreativeLabSection } from './components/CreativeLabSection';
import { JourneySection } from './components/JourneySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { LiveEditorModal } from './components/LiveEditorModal';

export default function App() {
  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-[#07080d] text-slate-100 relative selection:bg-violet-600/40 selection:text-white">
        {/* Top Scroll Indicator */}
        <ScrollProgress />

        {/* Lightweight Non-blocking Desktop Custom Cursor */}
        <CustomCursor />

        {/* Sticky Glassmorphism Navigation */}
        <Navbar />

        {/* Main Sections */}
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <CreativeLabSection />
          <JourneySection />
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Interactive Modals */}
        <ProjectModal />
        <LiveEditorModal />
      </div>
    </PortfolioProvider>
  );
}
