import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { TECHNOLOGIES } from '../../data/portfolioData';
import { TechItem } from '../../types';

export const TechCloudApp: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(TECHNOLOGIES[0]);

  return (
    <div className="space-y-6 pb-4">
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Ecossistema de Tecnologias</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Passe o mouse ou clique sobre qualquer tecnologia para inspecionar
          </p>
        </div>
      </div>

      {/* Interactive Tech Icons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {TECHNOLOGIES.map((tech) => {
          const isSelected = selectedTech?.name === tech.name;

          return (
            <motion.div
              key={tech.name}
              whileHover={{ scale: 1.06, rotate: 1, y: -4 }}
              onClick={() => setSelectedTech(tech)}
              className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 flex flex-col items-center text-center space-y-2 select-none relative group ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.3)]'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/30'
              }`}
            >
              {/* Glow backdrop on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none"
                style={{ backgroundColor: tech.glowColor }}
              />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform"
                style={{ backgroundColor: `${tech.glowColor}25`, border: `1px solid ${tech.glowColor}50` }}
              >
                <Sparkles className="w-6 h-6" style={{ color: tech.glowColor }} />
              </div>

              <div>
                <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition">
                  {tech.name}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                  {tech.category}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Tech Detail Drawer */}
      {selectedTech && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={selectedTech.name}
          className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-white/20 shadow-2xl space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                style={{ backgroundColor: selectedTech.glowColor }}
              >
                {selectedTech.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedTech.name}</h3>
                <span className="text-xs text-cyan-300 font-mono">{selectedTech.category}</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-emerald-300 font-mono">
              Nível: {selectedTech.level}
            </span>
          </div>

          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
            {selectedTech.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono pt-1">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Homologado e testado em produção corporativa</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
