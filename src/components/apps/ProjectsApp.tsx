import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Sparkles, Filter, CheckCircle2, ChevronRight, X, FolderKanban, Code2, Cpu, Globe, Clock } from 'lucide-react';
import { PROJECTS, PERSONAL_INFO } from '../../data/portfolioData';
import { ProjectItem } from '../../types';

export const ProjectsApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const categories = ['Todos', 'Web', 'Mobile', 'AI & Cloud', 'UI/UX'];

  const filteredProjects = selectedCategory === 'Todos'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  // If there are no projects in the portfolio yet
  if (PROJECTS.length === 0) {
    return (
      <div className="space-y-6 pb-6 select-text max-w-4xl mx-auto">
        {/* Main Coming Soon Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden text-center space-y-5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Icon with Glow */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 blur-lg opacity-60 animate-pulse" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950 border border-white/20 flex items-center justify-center text-purple-400 shadow-xl">
              <FolderKanban className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300" />
            </div>
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-purple-300" />
              <span>Em Desenvolvimento</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Projetos em Construção
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Atualmente estou desenvolvendo e estruturando meus primeiros projetos práticos focados primariamente em <span className="text-cyan-300 font-semibold">desenvolvimento de software</span> e <span className="text-blue-300 font-semibold">desenvolvimento web</span>, além de inteligência artificial. Em breve todas as aplicações, códigos-fonte e demonstrações ao vivo estarão disponíveis aqui.
            </p>
          </div>

          {/* Future Focus Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                <Cpu className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">Desenvolvimento de Software</h2>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Construção de sistemas, POO, lógica de programação e boas práticas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                <Globe className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">Desenvolvimento Web</h2>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Aplicações reativas, interfaces modernas, frontend e backend.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">IA & Automações</h2>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Automações inteligentes, integração de modelos e APIs REST.
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-500/25 transition active:scale-95 cursor-pointer"
            >
              <Github className="w-4 h-4" />
              <span>Acompanhar no GitHub</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-4">
      {/* Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/60 border border-white/10">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono shrink-0">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Categorias:</span>
        </div>

        <div className="flex overflow-x-auto sm:flex-wrap gap-1.5 scrollbar-none pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20 font-semibold'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid or Category Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950/40 border border-white/10 text-center space-y-2">
          <p className="text-sm font-semibold text-zinc-300">Nenhum projeto nesta categoria.</p>
          <p className="text-xs text-zinc-500">Selecione &quot;Todos&quot; para visualizar todos os projetos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredProjects.map((proj) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Image Cover */}
              <div className="relative h-36 sm:h-44 overflow-hidden bg-zinc-950">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

                {/* Status Badge */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 max-w-[calc(100%-65px)]">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-[10px] font-bold text-cyan-300 tracking-wider truncate">
                    {proj.category}
                  </span>
                  {proj.status === 'Em Destaque' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/85 text-black text-[9px] font-extrabold flex items-center gap-1 shadow">
                      <Sparkles className="w-2.5 h-2.5 fill-current shrink-0" />
                      DESTAQUE
                    </span>
                  )}
                </div>

                <span className="absolute top-2.5 right-2.5 text-[11px] font-mono text-zinc-300 bg-slate-950/80 px-2 py-0.5 rounded border border-white/10">
                  {proj.year}
                </span>
              </div>

              {/* Card Body Details */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-zinc-300/90 mt-1 line-clamp-2 leading-relaxed">
                    {proj.shortDescription}
                  </p>
                </div>

                {/* Technologies Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.technologies.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                  {proj.technologies.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] text-zinc-400 font-mono">
                      +{proj.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Action Links */}
                <div className="flex items-center justify-between pt-2.5 border-t border-white/10 gap-2">
                  <button
                    onClick={() => setSelectedProject(proj)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/btn py-1"
                  >
                    <span>Ver Detalhes</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition shrink-0"
                        title="Repositório GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-cyan-300 hover:text-white transition border border-blue-500/30 shrink-0"
                        title="Acessar Demonstração"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-white/20 p-4 sm:p-6 text-white shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] max-h-[90dvh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-start justify-between border-b border-white/10 pb-3 gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-[11px] sm:text-xs font-bold border border-blue-500/30">
                      {selectedProject.category}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">{selectedProject.year}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white truncate">{selectedProject.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="h-40 sm:h-52 rounded-xl overflow-hidden border border-white/10 bg-zinc-950">
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {selectedProject.fullDescription}
              </p>

              {/* Key Highlights */}
              <div className="space-y-2 bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/10">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
                  Destaques da Arquitetura
                </h4>
                <ul className="space-y-1.5">
                  {selectedProject.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedProject.metrics && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 font-semibold">
                  🚀 Impacto Medido: {selectedProject.metrics}
                </div>
              )}

              {/* Modal Footer Links */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub Repo</span>
                  </a>
                )}
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-xs font-semibold text-white shadow-lg transition cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ver Live Demo</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
