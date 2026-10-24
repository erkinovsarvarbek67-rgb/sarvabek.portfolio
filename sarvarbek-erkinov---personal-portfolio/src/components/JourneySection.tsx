import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Milestone, Flag, Rocket, CheckCircle2 } from 'lucide-react';

export const JourneySection: React.FC = () => {
  const { lang, data, t } = usePortfolio();

  return (
    <section
      id="journey"
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#07080f]"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase tracking-wider">
            <Milestone className="w-3.5 h-3.5" />
            <span>{t.journey.sectionBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t.journey.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
            {t.journey.subtitle}
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-violet-500 via-cyan-500 to-indigo-500/20 -translate-x-1/2" />

          <div className="space-y-12">
            {data.journey.map((step, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={step.id}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Central Node Badge */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0d101e] border-2 border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 z-10">
                    {step.isCurrent ? (
                      <Rocket className="w-4 h-4 text-cyan-400 animate-pulse" />
                    ) : idx === data.journey.length - 1 ? (
                      <Flag className="w-4 h-4 text-violet-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>

                  {/* Content Card */}
                  <div
                    className={`w-full sm:w-[calc(50%-2.5rem)] ml-12 sm:ml-0 ${
                      isEven ? 'sm:mr-auto sm:text-right' : 'sm:ml-auto sm:text-left'
                    }`}
                  >
                    <div className="p-6 rounded-3xl bg-[#0d101e] border border-white/[0.08] hover:border-violet-500/40 hover:shadow-xl transition-all duration-300 space-y-3 group">
                      <div
                        className={`flex items-center gap-2 ${
                          isEven ? 'sm:justify-end' : 'sm:justify-start'
                        }`}
                      >
                        <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          {step.phase[lang]}
                        </span>
                        {step.isCurrent && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {t.journey.currentBadge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {step.title[lang]}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {step.description[lang]}
                      </p>

                      <div
                        className={`flex flex-wrap gap-1.5 pt-2 ${
                          isEven ? 'sm:justify-end' : 'sm:justify-start'
                        }`}
                      >
                        {step.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-slate-300 border border-white/[0.05]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
