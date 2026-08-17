import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, CheckCircle2, TrendingUp } from 'lucide-react';
import { EXPERIENCES } from '../../data/portfolioData';

export const ExperienceApp: React.FC = () => {
  return (
    <div className="space-y-6 pb-4">
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Trajetória Profissional</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Histórico e vivência no ambiente corporativo
          </p>
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-emerald-500 before:to-purple-600">
        {EXPERIENCES.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="relative bg-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-xl hover:border-emerald-500/40 transition-all duration-300"
          >
            {/* Timeline Dot Node */}
            <div className="absolute -left-[31px] top-6 w-4 h-4 rounded-full bg-slate-950 border-2 border-emerald-400 shadow-[0_0_10px_#10b981]" />

            {/* Header Box */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${exp.color} text-white font-black text-xs flex items-center justify-center shadow-lg tracking-wider`}>
                  {exp.logoText}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{exp.role}</h3>
                  <div className="text-xs font-semibold text-emerald-300">{exp.company}</div>
                </div>
              </div>

              <div className="flex flex-col items-end text-xs text-zinc-400 font-mono">
                <span className="flex items-center gap-1 text-cyan-300 font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  <Calendar className="w-3 h-3" />
                  {exp.period}
                </span>
                <span className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  {exp.location}
                </span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-zinc-300 mb-4 leading-relaxed">
              {exp.description}
            </p>

            {/* Responsibilities */}
            <div className="space-y-2 mb-4 bg-white/5 p-3.5 rounded-xl border border-white/10">
              <h4 className="text-xs font-bold text-zinc-200 tracking-wider font-mono">
                Atribuições e Projetos Principais
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Measured Impact Results */}
            <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Resultados e Métricas Alcançadas</span>
              </h4>
              {exp.results.map((res, i) => (
                <p key={i} className="text-xs text-emerald-200 font-medium pl-5">
                  • {res}
                </p>
              ))}
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-1.5">
              {exp.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-zinc-300 font-mono font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
