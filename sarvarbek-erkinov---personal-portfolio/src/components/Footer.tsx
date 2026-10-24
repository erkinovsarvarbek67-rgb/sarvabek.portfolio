import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUp, Github, Send, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { data, t, playSfx } = usePortfolio();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    playSfx('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] bg-[#05060b] text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Monogram Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 p-[1px]">
            <div className="w-full h-full rounded-[7px] bg-[#070912] flex items-center justify-center font-bold text-xs text-white">
              {data.initials}
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-bold text-white">
              {data.name}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              © {currentYear} • {t.footer.builtWith}
            </span>
          </div>
        </div>

        {/* Center Note */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 text-center">
          <span>{t.footer.crafted}</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/50 inline" />
        </div>

        {/* Right: Socials & Back to Top */}
        <div className="flex items-center gap-3">
          <a
            href={data.contacts.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-all"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>

          <a
            href={data.contacts.telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:text-sky-400 transition-all"
            aria-label="Telegram @coder701"
            title="Telegram @coder701"
          >
            <Send className="w-4 h-4" />
          </a>

          <a
            href={`tel:${data.contacts.phone}`}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:text-emerald-400 transition-all text-xs font-mono hidden sm:flex items-center gap-1.5"
            aria-label="Telefon"
            title={data.contacts.phoneDisplay}
          >
            <span>{data.contacts.phoneDisplay}</span>
          </a>

          <a
            href={`mailto:${data.contacts.email}`}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:text-cyan-400 transition-all"
            aria-label="Email"
          >
            <Mail className="w-4 h-4" />
          </a>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 hover:text-cyan-400 border border-white/[0.06] transition-all ml-2"
            aria-label={t.footer.backToTop}
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.footer.backToTop}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
