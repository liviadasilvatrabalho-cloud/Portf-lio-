import React, { useState } from 'react';
import { Gamepad2, Trophy, Play } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ArcadeCabinet } from '../../../pac-man-arcade/src/components/ArcadeCabinet';

export const ArcadeApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-6 pb-4">
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg font-bold">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Arcade Center</h2>
            <p className="text-xs text-zinc-400">Espaço de Jogos Retro & Entretenimento</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-amber-300 font-bold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Pac-Man clássico</span>
        </div>
      </div>

      {!isPlaying ? (
        <div className="max-w-2xl mx-auto">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl space-y-6 text-center relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-950 border border-white/10 flex items-center justify-center p-4">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
                alt="Pac-Man Arcade"
                className="w-full h-full object-cover rounded-xl opacity-60 group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col items-center justify-end p-6">
                <h3 className="text-2xl font-black text-white tracking-wide font-mono">PAC-MAN RETRO</h3>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsPlaying(true);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Jogar Pac-Man Agora</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ArcadeCabinet embedded onBack={() => setIsPlaying(false)} />
      )}
    </div>
  );
};
