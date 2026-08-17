import React from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { Direction } from '../types';

interface TouchControlsProps {
  onDirectionChange: (dir: Direction) => void;
  className?: string;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onDirectionChange,
  className = '',
}) => {
  const handlePress = (dir: Direction, e: React.SyntheticEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // ignore if vibration fails
      }
    }
    onDirectionChange(dir);
  };

  return (
    <div className={`flex flex-col items-center justify-center my-2 select-none touch-none w-full max-w-xs ${className}`}>
      {/* Sleek Ergonomic Mobile D-Pad */}
      <div className="relative w-40 h-40 rounded-full bg-slate-950/90 border-2 border-indigo-800/80 p-2 shadow-xl shadow-indigo-950/60 backdrop-blur flex items-center justify-center">
        {/* Decorative center ring */}
        <div className="absolute w-12 h-12 rounded-full border border-yellow-500/30 bg-slate-900/60 flex items-center justify-center pointer-events-none">
          <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
        </div>

        {/* UP BUTTON */}
        <button
          type="button"
          onPointerDown={(e) => handlePress('UP', e)}
          className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center bg-indigo-900/90 active:bg-yellow-400 active:text-slate-950 text-indigo-100 rounded-xl border border-indigo-700/80 shadow-md transition-all active:scale-95 touch-none cursor-pointer"
          aria-label="Mover para cima"
        >
          <ArrowUp className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* DOWN BUTTON */}
        <button
          type="button"
          onPointerDown={(e) => handlePress('DOWN', e)}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center bg-indigo-900/90 active:bg-yellow-400 active:text-slate-950 text-indigo-100 rounded-xl border border-indigo-700/80 shadow-md transition-all active:scale-95 touch-none cursor-pointer"
          aria-label="Mover para baixo"
        >
          <ArrowDown className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* LEFT BUTTON */}
        <button
          type="button"
          onPointerDown={(e) => handlePress('LEFT', e)}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-indigo-900/90 active:bg-yellow-400 active:text-slate-950 text-indigo-100 rounded-xl border border-indigo-700/80 shadow-md transition-all active:scale-95 touch-none cursor-pointer"
          aria-label="Mover para esquerda"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* RIGHT BUTTON */}
        <button
          type="button"
          onPointerDown={(e) => handlePress('RIGHT', e)}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-indigo-900/90 active:bg-yellow-400 active:text-slate-950 text-indigo-100 rounded-xl border border-indigo-700/80 shadow-md transition-all active:scale-95 touch-none cursor-pointer"
          aria-label="Mover para direita"
        >
          <ArrowRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      <span className="mt-1 text-[10px] font-mono text-slate-400 text-center">
        Toque nos botões ou deslize na tela
      </span>
    </div>
  );
};
