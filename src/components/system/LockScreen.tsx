import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);

      const weekdays = [
        'Domingo',
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado'
      ];
      const months = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
      ];
      const dayName = weekdays[now.getDay()];
      const day = now.getDate();
      const monthName = months[now.getMonth()];

      setDateStr(`${dayName}, ${day} de ${monthName}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = () => {
    soundManager.playSuccess();
    onUnlock();
  };

  // Global keyboard listener — Enter or Space to unlock
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        onUnlock();
      }
    };
    window.addEventListener('keydown', handleGlobalKey, true);
    return () => window.removeEventListener('keydown', handleGlobalKey, true);
  }, [onUnlock]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)', transition: { duration: 0.6 } }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-between py-8 px-4 sm:py-12 sm:px-6 overflow-y-auto bg-slate-950/40 backdrop-blur-md text-white select-none outline-none"
    >
      {/* Top Clock and Date */}
      <div className="flex flex-col items-center justify-center text-center mt-6 select-none">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl sm:text-8xl md:text-9xl font-extralight tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] font-mono tabular-nums leading-none text-center"
        >
          {timeStr || '12:00'}
        </motion.div>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 0.9 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl font-medium text-cyan-200/90 mt-4 tracking-wide drop-shadow text-center"
        >
          {dateStr}
        </motion.div>
      </div>

      {/* Center Unlock Trigger */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col items-center max-w-sm w-full"
      >
        {/* Unlock Button */}
        <button
          onClick={handleUnlock}
          className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 hover:bg-cyan-500/20 backdrop-blur-xl border border-white/20 hover:border-cyan-400/50 text-sm font-semibold text-white shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 active:scale-95 group"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>Entrar no Sistema</span>
          <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-[11px] text-zinc-400 mt-4 tracking-wider">
          Pressione <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">ENTER</span> para continuar
        </p>
      </motion.div>

      {/* Bottom Footer Info */}
      <div className="text-xs text-zinc-400/70 font-mono flex items-center gap-2">
        <span>Apex Studio Edition</span>
        <span>•</span>
        <span>Portfólio Interativo</span>
      </div>
    </motion.div>
  );
};
