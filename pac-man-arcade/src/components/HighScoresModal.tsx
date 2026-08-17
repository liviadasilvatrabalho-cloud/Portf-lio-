import React, { useState } from 'react';
import { Trophy, X, Medal } from 'lucide-react';
import { HighScore } from '../types';
import { getHighScores, saveHighScore } from '../utils/highScores';

interface HighScoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore?: number;
  currentLevel?: number;
  isNewHigh?: boolean;
}

export const HighScoresModal: React.FC<HighScoresModalProps> = ({
  isOpen,
  onClose,
  currentScore = 0,
  currentLevel = 1,
  isNewHigh = false,
}) => {
  const [scores, setScores] = useState<HighScore[]>(getHighScores());
  const [playerName, setPlayerName] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    const updated = saveHighScore(playerName, currentScore, currentLevel);
    setScores(updated);
    setHasSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border-2 border-indigo-600 bg-slate-900 p-6 text-white shadow-2xl shadow-indigo-950/80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center space-x-3 mb-6 border-b border-indigo-900/60 pb-3">
          <Trophy className="w-8 h-8 text-yellow-400 animate-pulse" />
          <h2 className="font-mono text-xl font-extrabold tracking-wider text-yellow-400">
            RECORDES DA MÁQUINA
          </h2>
        </div>

        {/* Submit new High Score Form if eligible */}
        {isNewHigh && !hasSubmitted && currentScore > 0 && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-xl border border-yellow-500/50 bg-yellow-950/30 p-4 text-center"
          >
            <p className="font-mono text-sm font-bold text-yellow-300 mb-2 animate-bounce">
              🎉 NOVO RECORDE ALCANÇADO! 🎉
            </p>
            <p className="text-xs text-slate-300 mb-3">
              Pontuação: <span className="font-mono text-yellow-400 font-bold">{currentScore}</span>
            </p>

            <div className="flex items-center justify-center space-x-2">
              <input
                type="text"
                maxLength={3}
                placeholder="ABC"
                value={playerName}
                onChange={e => setPlayerName(e.target.value.toUpperCase())}
                className="w-24 rounded-lg border-2 border-yellow-400 bg-slate-950 px-3 py-1.5 text-center font-mono text-xl font-bold tracking-widest text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-lg bg-yellow-500 px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:bg-yellow-400 transition-colors cursor-pointer"
              >
                SALVAR
              </button>
            </div>
          </form>
        )}

        {/* Scores Table */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {scores.map((item, index) => {
            const isTop3 = index < 3;
            const rankColors = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-lg p-2.5 font-mono text-sm transition-colors ${
                  index % 2 === 0 ? 'bg-slate-950/80' : 'bg-slate-800/40'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-6 font-bold ${isTop3 ? rankColors[index] : 'text-slate-500'}`}>
                    #{index + 1}
                  </span>
                  <span className="font-extrabold tracking-widest text-white">{item.name}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-xs text-slate-400">FASE {item.level}</span>
                  <span className="font-bold text-yellow-400 tracking-wider">
                    {item.score.toString().padStart(6, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-indigo-600 py-2.5 font-mono text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg cursor-pointer"
          >
            FECHAR E JOGAR
          </button>
        </div>
      </div>
    </div>
  );
};
