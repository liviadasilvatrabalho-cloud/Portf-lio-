import React from 'react';
import { GameStats, HighScore } from '../types';
import { Trophy, X, Zap, Snowflake, Crosshair, Award } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  highScores: HighScore[];
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats, highScores }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-indigo-900/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider font-mono">
              ESTATÍSTICAS & PLACAR
            </h2>
            <p className="text-xs text-slate-400 font-mono">REGISTROS E CONQUISTAS DO JOGADOR</p>
          </div>
        </div>

        {/* Lifetime Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase">RECORD DE PONTOS</p>
              <p className="text-lg font-black text-amber-400 font-mono">{stats.highScore}</p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <Crosshair className="w-8 h-8 text-rose-400" />
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase">FANTASMAS DEVORADOS</p>
              <p className="text-lg font-black text-rose-400 font-mono">{stats.ghostsEaten}</p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase">PONTOS COMIDOS</p>
              <p className="text-lg font-black text-yellow-400 font-mono">{stats.dotsEaten}</p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <Snowflake className="w-8 h-8 text-cyan-400" />
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase">PARTIDAS JOGADAS</p>
              <p className="text-lg font-black text-cyan-400 font-mono">{stats.gamesPlayed}</p>
            </div>
          </div>
        </div>

        {/* High Scores List */}
        <div className="mb-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> TOP RECTORDES
          </h3>

          <div className="bg-slate-950/90 rounded-2xl border border-slate-800 overflow-hidden font-mono text-sm">
            {highScores.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-xs">
                Nenhum recorde registrado ainda. Jogue para entrar no placar!
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {highScores.map((score, index) => (
                  <div key={index} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          index === 0
                            ? 'bg-amber-400 text-slate-950'
                            : index === 1
                            ? 'bg-slate-300 text-slate-950'
                            : index === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-200">{score.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500">Nível {score.level}</span>
                      <span className="font-extrabold text-amber-400">{score.score} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold uppercase rounded-2xl transition-colors shadow-lg"
        >
          VOLTAR AO JOGO
        </button>
      </div>
    </div>
  );
};
