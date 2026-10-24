import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ThreeHeroCanvas } from './ThreeHeroCanvas';
import {
  ArrowRight,
  Mail,
  ChevronDown,
  Sparkles,
  MapPin,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { lang, theme, data, t, playSfx } = usePortfolio();

  const roles = data.roles[lang] || data.roles.uz;
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect for changing roles
  useEffect(() => {
    const fullText = roles[currentRoleIndex] || roles[0];
    const typingSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < fullText.length) {
          setDisplayedText(fullText.substring(0, displayedText.length + 1));
        } else {
          // Pause at end before deleting
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(fullText.substring(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentRoleIndex, roles]);

  const scrollToSection = (id: string) => {
    playSfx('click');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden tech-grid-pattern"
    >
      {/* Background radial gradient halos */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        {/* Left Column: Hero Copy & Actions */}
        <div className="lg:col-span-7 flex flex-col text-left space-y-6">
          {/* Top Status Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>{t.hero.liveBadge}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{data.contacts.availability[lang]}</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {t.hero.greeting}{' '}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                {data.name}
              </span>
            </h1>

            {/* Dynamic Typewriter Role */}
            <div className="h-12 sm:h-14 flex items-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xl sm:text-2xl lg:text-3xl font-mono font-semibold text-cyan-300">
                  {displayedText}
                </span>
                <span className="w-2 h-6 bg-cyan-400 inline-block animate-pulse ml-0.5" />
              </div>
            </div>
          </div>

          {/* Short Bio Tagline */}
          <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-2xl font-normal">
            {data.heroTagline[lang]}
          </p>

          {/* Location, Phone & Telegram handles */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{data.contacts.location[lang]}</span>
            </div>
            <span>•</span>
            <a
              href={`tel:${data.contacts.phone}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{data.contacts.phoneDisplay}</span>
            </a>
            <span>•</span>
            <a
              href={data.contacts.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors font-semibold"
            >
              <span>@{data.contacts.telegramUsername}</span>
            </a>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* View Projects Primary Button */}
            <button
              onClick={() => scrollToSection('projects')}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <span>{t.hero.viewProjects}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Contact Me Secondary Button */}
            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.12] text-slate-200 font-semibold text-sm hover:bg-white/[0.08] hover:text-white hover:border-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>{t.hero.contactMe}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Original 3D Three.js Tech Canvas */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-md lg:max-w-none rounded-3xl p-1 bg-gradient-to-b from-white/10 via-white/[0.03] to-transparent shadow-2xl">
            {/* Three.js interactive 3D hero */}
            <ThreeHeroCanvas theme={theme} />

            {/* Tech Badge */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <div className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
                Three.js PBR 3D
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <button
          onClick={() => scrollToSection('about')}
          className="group flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none"
          aria-label={t.hero.scrollDown}
        >
          <span className="text-[11px] font-mono uppercase tracking-widest">
            {t.hero.scrollDown}
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-cyan-400" />
        </button>
      </div>
    </section>
  );
};
