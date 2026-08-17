import React from 'react';
import { FRUIT_ITEMS, getFruitForLevel } from '../utils/mazeData';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  lives: number;
  level: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  highScore,
  lives,
  level,
}) => {
  const currentFruit = getFruitForLevel(level);

  return (
    <div className="w-full max-w-md rounded-t-xl border-t-2 border-x-2 border-indigo-900/80 bg-slate-950 p-4 font-mono text-white shadow-lg">
      <div className="flex justify-between items-center text-xs sm:text-sm tracking-wider font-bold">
        {/* 1UP / SCORE */}
        <div className="flex flex-col items-start">
          <span className="text-red-500 animate-pulse">1UP</span>
          <span className="text-xl sm:text-2xl text-yellow-400 font-black tracking-widest drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">
            {score.toString().padStart(6, '0')}
          </span>
        </div>

        {/* HIGH SCORE */}
        <div className="flex flex-col items-center">
          <span className="text-blue-400">HIGH SCORE</span>
          <span className="text-xl sm:text-2xl text-cyan-300 font-black tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            {highScore.toString().padStart(6, '0')}
          </span>
        </div>

        {/* FASE / LEVEL */}
        <div className="flex flex-col items-end">
          <span className="text-purple-400">FASE</span>
          <span className="text-xl sm:text-2xl text-pink-400 font-black">
            {level}
          </span>
        </div>
      </div>

      {/* LIVES & FRUIT DISPLAY BAR */}
      <div className="mt-3 flex justify-between items-center border-t border-slate-800 pt-2 text-xs">
        {/* Pac-Man Lives Icons */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 font-sans mr-1">VIDAS:</span>
          {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-yellow-400 relative overflow-hidden drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 30% 50%, 0 0)',
              }}
            />
          ))}
        </div>

        {/* Fruit icon */}
        <div className="flex items-center space-x-1">
          <span className="text-slate-400 font-sans mr-1">FRUTA:</span>
          <span className="text-lg animate-bounce">{currentFruit.symbol}</span>
        </div>
      </div>
    </div>
  );
};
