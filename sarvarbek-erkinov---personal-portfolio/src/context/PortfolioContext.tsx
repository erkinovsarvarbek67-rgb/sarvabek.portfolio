import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Theme, PortfolioData, Project } from '../types/portfolio';
import { INITIAL_PORTFOLIO_DATA, UI_TRANSLATIONS } from '../data/portfolioData';

interface PortfolioContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  data: PortfolioData;
  updateData: (newData: Partial<PortfolioData>) => void;
  resetData: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  isEditorOpen: boolean;
  setIsEditorOpen: (open: boolean) => void;
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (unlocked: boolean) => void;
  adminToast: string | null;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  t: typeof UI_TRANSLATIONS['uz'];
  playSfx: (type?: 'click' | 'toggle' | 'success') => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY_DATA = 'se_portfolio_data_v2';
const STORAGE_KEY_LANG = 'se_portfolio_lang';
const STORAGE_KEY_THEME = 'se_portfolio_theme';

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG) as Language;
    return saved && ['uz', 'en', 'ru'].includes(saved) ? saved : 'uz';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME) as Theme;
    return saved && ['dark', 'light'].includes(saved) ? saved : 'dark';
  });

  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_PORTFOLIO_DATA;
  });

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isAdminUnlocked, setIsAdminUnlockedState] = useState<boolean>(() => {
    return localStorage.getItem('se_admin_unlocked') === 'true';
  });
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const setIsAdminUnlocked = (unlocked: boolean) => {
    setIsAdminUnlockedState(unlocked);
    if (unlocked) {
      localStorage.setItem('se_admin_unlocked', 'true');
    } else {
      localStorage.removeItem('se_admin_unlocked');
    }
  };

  // Listen for Ctrl + Alt (or Cmd + Alt on Mac) anywhere on page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isAlt = e.altKey;

      if (isCtrlOrCmd && isAlt) {
        e.preventDefault();
        setIsAdminUnlockedState(true);
        localStorage.setItem('se_admin_unlocked', 'true');
        setIsEditorOpen(true);
        setAdminToast('🔑 Admin rejimi: Tahrirlash ochildi (Ctrl + Alt)');
        setTimeout(() => setAdminToast(null), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync lang change
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY_LANG, newLang);
  };

  // Sync theme
  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    localStorage.setItem(STORAGE_KEY_THEME, nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Update data
  const updateData = (newData: Partial<PortfolioData>) => {
    setData((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(updated));
      return updated;
    });
  };

  // Reset to initial
  const resetData = () => {
    setData(INITIAL_PORTFOLIO_DATA);
    localStorage.removeItem(STORAGE_KEY_DATA);
  };

  // Zero-dependency Web Audio procedural SFX
  const playSfx = (type: 'click' | 'toggle' | 'success' = 'click') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.04);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'toggle') {
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch {
      // AudioContext might be blocked until user gesture, safely ignore
    }
  };

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.uz;

  return (
    <PortfolioContext.Provider
      value={{
        lang,
        setLang,
        theme,
        toggleTheme,
        data,
        updateData,
        resetData,
        activeSection,
        setActiveSection,
        isEditorOpen,
        setIsEditorOpen,
        isAdminUnlocked,
        setIsAdminUnlocked,
        adminToast,
        selectedProject,
        setSelectedProject,
        t,
        playSfx,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
