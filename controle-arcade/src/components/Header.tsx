import React from 'react';
import { ControllerMode } from '../types';
import { Trophy, RotateCcw, LayoutGrid, Monitor, Smartphone, HelpCircle, BarChart3 } from 'lucide-react';

interface HeaderProps {
  score: number;
  highScore: number;
  lives: number;
  level: number;
  controllerMode: ControllerMode;
  onControllerModeChange: (mode: ControllerMode) => void;
  onResetGame: () => void;
  onOpenStats: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  highScore,
  lives,
  level,
  controllerMode,
  onControllerModeChange,
  onResetGame,
  onOpenStats,
  onOpenHelp,
}) => {
  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-md border-b border-indigo-900/40 sticky top-0 z-30 px-3 sm:px-6 py-3 shadow-xl">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-yellow-200 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.4)]">
            <div className="w-6 h-6 bg-slate-950 rounded-full clip-pacman border border-yellow-300" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 font-mono uppercase">
              PAC-MAN ARCADE
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">CONTROLE DE JOGO INTERATIVO</p>
          </div>
        </div>

        {/* Score & High Score Retro Display */}
        <div className="flex items-center gap-4 sm:gap-6 bg-slate-900/90 px-4 py-2 rounded-2xl border border-indigo-900/60 shadow-inner font-mono">
          {/* Current Score */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 tracking-widest uppercase">SCORE 1UP</span>
            <span className="text-lg sm:text-xl font-extrabold text-amber-400 tracking-wider">
              {score.toString().padStart(6, '0')}
            </span>
          </div>

          <div className="h-7 w-px bg-slate-800" />

          {/* High Score */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-amber-500 flex items-center gap-1 tracking-widest uppercase">
              <Trophy className="w-3 h-3" /> HIGH SCORE
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-white tracking-wider">
              {highScore.toString().padStart(6, '0')}
            </span>
          </div>

          <div className="h-7 w-px bg-slate-800 hidden sm:block" />

          {/* Level & Lives */}
          <div className="hidden sm:flex flex-col items-start gap-0.5">
            <span className="text-[10px] text-slate-400 tracking-wider">NÍVEL: <strong className="text-cyan-400">{level}</strong></span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 mr-1">VIDAS:</span>
              {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                <div key={i} className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-yellow-200" />
              ))}
            </div>
          </div>
        </div>

        {/* View Mode & Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Controller View Layout Modes */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              title="Modo Gabinete Arcade"
              onClick={() => onControllerModeChange('arcade')}
              className={`p-1.5 rounded-lg transition-all ${
                controllerMode === 'arcade' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              title="Modo Console Portátil"
              onClick={() => onControllerModeChange('handheld')}
              className={`p-1.5 rounded-lg transition-all ${
                controllerMode === 'handheld' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              title="Modo Dividido / Tela Dupla"
              onClick={() => onControllerModeChange('split')}
              className={`p-1.5 rounded-lg transition-all ${
                controllerMode === 'split' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Game */}
          <button
            onClick={onResetGame}
            title="Reiniciar Jogo"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Stats Button */}
          <button
            onClick={onOpenStats}
            title="Estatísticas & Placar"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 transition-all active:scale-95"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Help / Instructions Button */}
          <button
            onClick={onOpenHelp}
            title="Como Jogar"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all active:scale-95"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
