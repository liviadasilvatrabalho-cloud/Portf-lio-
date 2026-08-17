import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Wrench,
  Code2,
  Database,
  Layout,
  Server,
  Bot,
  ShieldCheck,
  Search,
  Zap,
  Globe,
  Smartphone,
  Workflow,
  Share2,
  Box,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';
import { SKILL_CATEGORIES, TECHNOLOGIES, LANGUAGES } from '../../data/portfolioData';
import { TechItem } from '../../types';

export const SkillsApp: React.FC = () => {
  const [mainTab, setMainTab] = useState<'overview' | 'matrix' | 'technologies'>('overview');
  const [activeSkillCategory, setActiveSkillCategory] = useState<number>(0);
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(TECHNOLOGIES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [techCategoryFilter, setTechCategoryFilter] = useState<string>('all');

  const activeCategory = SKILL_CATEGORIES[activeSkillCategory];

  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0: return <Code2 className="w-4 h-4 text-blue-400" />;
      case 1: return <Layout className="w-4 h-4 text-cyan-400" />;
      case 2: return <Globe className="w-4 h-4 text-purple-400" />;
      case 3: return <Bot className="w-4 h-4 text-pink-400" />;
      case 4: return <Share2 className="w-4 h-4 text-amber-400" />;
      case 5: return <Database className="w-4 h-4 text-emerald-400" />;
      case 6: return <Wrench className="w-4 h-4 text-rose-400" />;
      case 7: return <BookOpen className="w-4 h-4 text-indigo-400" />;
      case 8: return <FileSpreadsheet className="w-4 h-4 text-teal-400" />;
      default: return <Zap className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getProficiencyBadgeClass = (proficiency?: string) => {
    switch (proficiency) {
      case 'Especialista':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Avançado':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Intermediário/Avançado':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Intermediário':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Em aprendizado':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Conhecimentos básicos':
        return 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30';
      default:
        return 'bg-white/10 text-zinc-300 border-white/15';
    }
  };

  const filteredTechnologies = TECHNOLOGIES.filter((tech) => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      techCategoryFilter === 'all' || tech.category === techCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ['all', ...Array.from(new Set(TECHNOLOGIES.map((t) => t.category)))];

  return (
    <div className="space-y-6 pb-6 select-text">
      {/* Top Navigation Mode Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-950/60 border border-white/10">
        <button
          onClick={() => setMainTab('overview')}
          className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            mainTab === 'overview'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-white/5 text-zinc-300 hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-300 shrink-0" />
          <span className="truncate">Mapa de Habilidades</span>
        </button>

        <button
          onClick={() => setMainTab('matrix')}
          className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            mainTab === 'matrix'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-white/5 text-zinc-300 hover:bg-white/10'
          }`}
        >
          <Zap className="w-4 h-4 text-pink-300 shrink-0" />
          <span className="truncate">Por Categoria</span>
        </button>

        <button
          onClick={() => setMainTab('technologies')}
          className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            mainTab === 'technologies'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 text-zinc-300 hover:bg-white/10'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-300 shrink-0" />
          <span className="truncate">Ecossistema Stack</span>
        </button>
      </div>

      {/* TAB 1: MAPA GERAL DE HABILIDADES */}
      {mainTab === 'overview' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Habilidades Técnicas & Áreas de Atuação</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                Competências organizadas por domínio prático e experiência
              </p>
            </div>
            <div className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-mono text-cyan-300">
              {SKILL_CATEGORIES.length} Categorias • {SKILL_CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0)} Competências
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
            {SKILL_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center gap-2.5 border-b border-white/10 pb-2.5 mb-3">
                    <div
                      className="p-2 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${cat.color}20`, border: `1px solid ${cat.color}40` }}
                    >
                      {getCategoryIcon(idx)}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight min-w-0 truncate">
                      {cat.name}
                    </h3>
                  </div>

                  <ul className="space-y-2">
                    {cat.skills.map((s, sIdx) => (
                      <li key={sIdx} className="flex items-center justify-between text-xs text-zinc-300 gap-2 min-w-0">
                        <span className="flex items-center gap-2 min-w-0 flex-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: cat.color }} />
                          <span className="font-medium truncate text-[11px] sm:text-xs">{s.name}</span>
                        </span>
                        {s.proficiency && (
                          <span className={`text-[9px] sm:text-[10px] font-mono shrink-0 px-1.5 sm:px-2 py-0.5 rounded-md border ${getProficiencyBadgeClass(s.proficiency)}`}>
                            {s.proficiency}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Languages Section Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Idiomas</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {LANGUAGES.map((lang, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{lang.name}</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXPLORADOR POR CATEGORIA */}
      {mainTab === 'matrix' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Category Selector Sub-tabs - Smooth Horizontal Scroll on Mobile */}
          <div className="flex overflow-x-auto items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/60 border border-white/10 scrollbar-none snap-x pb-2">
            {SKILL_CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSkillCategory(idx)}
                className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 snap-start whitespace-nowrap ${
                  activeSkillCategory === idx
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div style={{ color: cat.color }} className="shrink-0">{getCategoryIcon(idx)}</div>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Active Category Detail Panel */}
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 sm:space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 sm:p-3 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${activeCategory.color}25`, border: `1px solid ${activeCategory.color}50` }}
                >
                  {getCategoryIcon(activeSkillCategory)}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{activeCategory.name}</h3>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                    {activeCategory.skills.length} competências mapeadas nesta categoria
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
              {activeCategory.skills.map((skill, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className="p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-white/10 hover:border-white/20 transition flex flex-col justify-between space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: activeCategory.color }} />
                      <span className="font-bold text-xs sm:text-sm text-white truncate">{skill.name}</span>
                    </div>
                  </div>

                  {skill.proficiency && (
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2">
                      <span className="text-[10px] sm:text-[11px] text-zinc-400">Nível prático:</span>
                      <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded border shrink-0 ${getProficiencyBadgeClass(skill.proficiency)}`}>
                        {skill.proficiency}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ECOSSISTEMA DE TECNOLOGIAS */}
      {mainTab === 'technologies' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Stack Tecnológica & Ferramentas</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                Clique sobre qualquer tecnologia para inspecionar aplicação
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar tecnologia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none snap-x">
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setTechCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition snap-start ${
                  techCategoryFilter === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                {cat === 'all' ? 'Todas as Áreas' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
            {filteredTechnologies.map((tech) => {
              const isSelected = selectedTech?.name === tech.name;

              return (
                <motion.div
                  key={tech.name}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => setSelectedTech(tech)}
                  className={`p-3 sm:p-4 rounded-2xl cursor-pointer border transition-all duration-300 flex flex-col items-center text-center space-y-2 select-none relative group ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.25)]'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform"
                    style={{
                      backgroundColor: `${tech.glowColor}20`,
                      border: `1px solid ${tech.glowColor}40`
                    }}
                  >
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: tech.glowColor }} />
                  </div>

                  <div className="w-full min-w-0">
                    <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition truncate">
                      {tech.name}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono mt-0.5 truncate">
                      {tech.category}
                    </div>
                  </div>

                  <span className={`text-[8px] sm:text-[9px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full border truncate max-w-full ${getProficiencyBadgeClass(tech.level)}`}>
                    {tech.level}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Selected Tech Inspector Box */}
          {selectedTech && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={selectedTech.name}
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-white/20 shadow-2xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md shrink-0 text-sm sm:text-base"
                    style={{ backgroundColor: selectedTech.glowColor }}
                  >
                    {selectedTech.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-white truncate">{selectedTech.name}</h3>
                    <span className="text-xs text-cyan-300 font-mono">{selectedTech.category}</span>
                  </div>
                </div>

                <span className={`self-start sm:self-auto px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold font-mono border ${getProficiencyBadgeClass(selectedTech.level)}`}>
                  Nível: {selectedTech.level}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {selectedTech.description}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
