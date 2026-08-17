import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Apple } from 'lucide-react';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15 + 8);
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white select-none"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Apple Logo Icon */}
          <div className="relative mb-12">
            <Apple className="w-20 h-20 text-white fill-current drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
          </div>

          {/* Progress Bar Container */}
          <div className="w-56 h-1.5 bg-zinc-800 rounded-full overflow-hidden p-[1px] border border-white/10 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-white rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="mt-6 text-xs text-zinc-400 font-mono tracking-widest uppercase"
          >
            Apex Studio v15.4 • Initializing System
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
