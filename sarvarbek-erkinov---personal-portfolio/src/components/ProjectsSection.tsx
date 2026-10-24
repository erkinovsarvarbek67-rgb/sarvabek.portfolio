import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectCategory, Project } from '../types/portfolio';
import { filterProjects } from '../utils/portfolioLogic';
import {
  FolderGit2,
  Search,
  ArrowUpRight,
  Play,
  Gamepad2,
  Laptop,
  Award,
  Flame,
  Wrench,
} from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { lang, data, t, setSelectedProject, playSfx } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = filterProjects(
    data.projects,
    selectedCategory,
    searchQuery
  );

  const getProjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-8 h-8 text-indigo-400" />;
      case 'Laptop':
        return <Laptop className="w-8 h-8 text-sky-400" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-8 h-8 text-emerald-400" />;
      case 'Flame':
        return <Flame className="w-8 h-8 text-rose-400" />;
      case 'Wrench':
        return <Wrench className="w-8 h-8 text-cyan-400" />;
      default:
        return <FolderGit2 className="w-8 h-8 text-violet-400" />;
    }
  };

  const getStatusBadgeStyle = (status: Project['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'In development':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Demo':
      default:
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <section
      id="projects"
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#07080f]"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>{t.projects.sectionBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t.projects.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
            {t.projects.subtitle}
          </p>

          {/* Filter Pills & Search Bar */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {(['all', 'web', 'games', 'tools'] as ProjectCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playSfx('click');
                    setSelectedCategory(cat);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md shadow-violet-600/30 font-semibold'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.06]'
                  }`}
                >
                  {t.projects.categories[cat]}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.projects.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-3xl bg-[#0d101e] border border-white/[0.08] hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-600/10 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Card Visual Banner (Aesthetic Procedural Banner) */}
              <div
                className={`relative h-48 w-full bg-gradient-to-br ${project.gradient} flex items-center justify-center p-6 border-b border-white/[0.06] overflow-hidden`}
              >
                {/* Decorative mesh lines */}
                <div className="absolute inset-0 tech-grid-pattern opacity-40 pointer-events-none" />

                {/* Main Icon Art */}
                <div className="relative z-10 p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-xl group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300">
                  {getProjectIcon(project.icon)}
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium border ${getStatusBadgeStyle(
                      project.status
                    )} backdrop-blur-md`}
                  >
                    {t.projects.statusLabels[project.status]}
                  </span>
                </div>

                {/* Playable Indicator */}
                {project.isPlayable && (
                  <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
                    <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                    <span>Playable</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {project.description[lang]}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] text-[11px] font-mono text-slate-300 border border-white/[0.05]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/[0.06]">
                    <button
                      onClick={() => {
                        playSfx('click');
                        setSelectedProject(project);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>
                        {project.isPlayable
                          ? t.projects.playNow
                          : t.projects.viewDetails}
                      </span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>

                    <button
                      onClick={() => {
                        playSfx('click');
                        setSelectedProject(project);
                      }}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all"
                      aria-label={`${project.title} tafsilotlari`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
