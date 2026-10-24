import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Code2,
  Compass,
  CheckCircle,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { lang, data, t } = usePortfolio();

  return (
    <section
      id="about"
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#07080f]/90"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>{t.about.sectionBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t.about.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
            {t.about.subtitle}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Narrative & Focus Areas */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0d101d] border border-white/[0.08] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {data.name}
                    </h3>
                    <p className="text-xs font-mono text-cyan-400">
                      Web Developer & Python Programmer
                    </p>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  {data.aboutBio[lang]}
                </p>

                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  {data.aboutDetailed[lang]}
                </p>
              </div>
            </div>

            {/* Current Focus Areas */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0d101d] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 text-white font-semibold text-base sm:text-lg">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h4>{t.about.focusTitle}</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {data.learningFocus[lang]?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-violet-500/30 transition-all"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-300 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Statistics Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {data.stats.map((stat, idx) => (
              <div
                key={stat.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#0d101d] border border-white/[0.08] shadow-xl hover:border-cyan-500/40 hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs font-mono text-slate-400">
                    0{idx + 1}
                  </span>
                  {idx === 0 ? (
                    <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                  )}
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {stat.label[lang]}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {stat.subtext[lang]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
