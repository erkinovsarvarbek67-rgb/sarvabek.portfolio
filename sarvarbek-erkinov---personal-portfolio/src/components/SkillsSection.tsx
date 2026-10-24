import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { SkillCategory } from '../types/portfolio';
import {
  FileCode,
  Palette,
  Zap,
  Terminal,
  Atom,
  GitBranch,
  Layout,
  Smartphone,
  Cpu,
  Layers,
} from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { lang, data, t, playSfx } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileCode':
        return <FileCode className="w-6 h-6 text-orange-400" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-sky-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Terminal':
        return <Terminal className="w-6 h-6 text-blue-400" />;
      case 'Atom':
        return <Atom className="w-6 h-6 text-cyan-400" />;
      case 'GitBranch':
        return <GitBranch className="w-6 h-6 text-rose-400" />;
      case 'Layout':
        return <Layout className="w-6 h-6 text-purple-400" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-emerald-400" />;
      default:
        return <Cpu className="w-6 h-6 text-violet-400" />;
    }
  };

  const categories: { id: SkillCategory | 'all'; label: string }[] = [
    { id: 'all', label: t.skills.categories.all },
    { id: 'frontend', label: t.skills.categories.frontend },
    { id: 'backend', label: t.skills.categories.backend },
    { id: 'design', label: t.skills.categories.design },
    { id: 'tools', label: t.skills.categories.tools },
  ];

  const filteredSkills = data.skills.filter(
    (skill) => selectedCategory === 'all' || skill.category === selectedCategory
  );

  return (
    <section
      id="skills"
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#090b14]"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.skills.sectionBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t.skills.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
            {t.skills.subtitle}
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playSfx('click');
                  setSelectedCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 font-semibold'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.05]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-6 rounded-3xl bg-[#0d101e] border border-white/[0.07] hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Icon & Category Tag */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] group-hover:scale-110 transition-transform">
                    {getIcon(skill.iconName)}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                    {skill.category}
                  </span>
                </div>

                {/* Skill Name */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </h3>
                  <span className="text-xs font-mono text-violet-400">
                    {skill.tagline[lang]}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {skill.description[lang]}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Tajriba & Amaliyot</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
