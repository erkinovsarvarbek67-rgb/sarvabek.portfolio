import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Language } from '../types/portfolio';
import {
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Sliders,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    data,
    activeSection,
    setActiveSection,
    isAdminUnlocked,
    adminToast,
    setIsEditorOpen,
    t,
    playSfx,
  } = usePortfolio();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section spy
      const sections = ['hero', 'about', 'skills', 'projects', 'lab', 'journey', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [setActiveSection]);

  const navItems = [
    { id: 'about', label: t.nav.about },
    { id: 'skills', label: t.nav.skills },
    { id: 'projects', label: t.nav.projects },
    { id: 'lab', label: t.nav.lab },
    { id: 'journey', label: t.nav.journey },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleNavClick = (id: string) => {
    playSfx('click');
    setMobileMenuOpen(false);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLangChange = (l: Language) => {
    playSfx('toggle');
    setLang(l);
    setLangDropdownOpen(false);
  };

  const languageLabels: Record<Language, { label: string; flag: string }> = {
    uz: { label: "O'zbek", flag: '🇺🇿' },
    en: { label: 'English', flag: '🇬🇧' },
    ru: { label: 'Русский', flag: '🇷🇺' },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[#080911]/85 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/20'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Monogram Brand / Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('hero');
          }}
          className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-xl"
          aria-label="Sarvarbek Erkinov - Bosh sahifa"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-md shadow-violet-600/30">
            <div className="w-full h-full rounded-[10px] bg-[#090b14] flex items-center justify-center">
              <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                {data.initials}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              {data.name}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Portfolio v2.0
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md"
          aria-label="Asosiy menyu"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools: Language, Theme, Live Edit, Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                playSfx('click');
                setLangDropdownOpen(!langDropdownOpen);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all"
              aria-label="Tilni tanlash"
              aria-expanded={langDropdownOpen}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{languageLabels[lang].flag}</span>
              <span className="hidden sm:inline font-mono uppercase">{lang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl bg-[#0f1220] border border-slate-700/80 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {(['uz', 'en', 'ru'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLangChange(l)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left transition-colors ${
                      lang === l
                        ? 'text-cyan-400 bg-cyan-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>{languageLabels[l].flag}</span>
                    <span>{languageLabels[l].label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              playSfx('toggle');
              toggleTheme();
            }}
            className="p-2 rounded-xl text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-cyan-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label={theme === 'dark' ? 'Yorug‘ mavzuga o‘tish' : 'Qorong‘u mavzuga o‘tish'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Live Portfolio Editor Modal Trigger (Secret shortcut: Ctrl + Alt) */}
          {isAdminUnlocked && (
            <button
              onClick={() => {
                playSfx('click');
                setIsEditorOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/40 hover:border-violet-400 hover:text-white transition-all shadow-sm animate-in fade-in"
              aria-label="Portfolio ma'lumotlarini tahrirlash"
              title="Admin rejimi: Kodni o'zgartirmasdan ma'lumotlarni tahrirlash (Ctrl + Alt)"
            >
              <Sliders className="w-3.5 h-3.5 text-violet-400" />
              <span>{t.nav.editMode}</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => {
              playSfx('click');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-xl text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:text-white focus:outline-none"
            aria-label="Menyuni ochish"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Admin Unlock Toast Notification */}
      {adminToast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 px-4 py-2 rounded-2xl bg-[#0e1224]/95 border border-cyan-400/50 text-cyan-300 text-xs font-mono shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#090b14]/95 backdrop-blur-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-cyan-400 bg-cyan-500/10 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </button>
            ))}

            {isAdminUnlocked && (
              <div className="pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-slate-400">Admin rejimi:</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsEditorOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-violet-300 bg-violet-600/20 border border-violet-500/30"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{t.nav.editMode}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
