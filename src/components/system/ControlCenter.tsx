import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, CloudRain, Sparkles, Sliders, Lock, Monitor, Eye } from 'lucide-react';
import { SystemSettings } from '../../types';
import { soundManager } from '../../utils/audio';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onLockScreen: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onLockScreen
}) => {
  if (!isOpen) return null;

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: next });
    soundManager.setSettings(!next, settings.soundVolume);
    if (next) soundManager.playClick();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onUpdateSettings({ soundVolume: val });
    soundManager.setSettings(!settings.soundEnabled, val);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-transparent"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[calc(2.25rem+env(safe-area-inset-top,0px))] right-2 sm:right-4 w-[calc(100vw-16px)] sm:w-80 max-w-xs rounded-2xl bg-black/60 backdrop-blur-3xl border border-white/10 p-4 text-white shadow-2xl z-50 text-xs select-none max-h-[calc(100dvh-6rem)] overflow-y-auto custom-scrollbar"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2 font-semibold text-sm text-cyan-300">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Central de Controle</span>
            </div>
            <button
              onClick={onLockScreen}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 transition"
              title="Bloquear Tela"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Audio Control */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-medium">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-blue-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-zinc-500" />
                )}
                <span>Som do Sistema</span>
              </div>
              <button
                onClick={toggleSound}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider transition ${
                  settings.soundEnabled
                    ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                    : 'bg-zinc-700 text-zinc-400'
                }`}
              >
                {settings.soundEnabled ? 'LIGADO' : 'MUTADO'}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.soundVolume}
              onChange={handleVolumeChange}
              disabled={!settings.soundEnabled}
              className="w-full accent-blue-500 h-1 bg-zinc-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Graphics & Rain Control */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-medium text-cyan-200">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                <span>Intensidade da Chuva</span>
              </div>
              <span className="font-mono text-[10px] text-cyan-300">Nível {settings.rainDensity}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={settings.rainDensity}
              onChange={(e) => onUpdateSettings({ rainDensity: Number(e.target.value) })}
              className="w-full accent-cyan-400 h-1 bg-zinc-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Graphic FPS Quality */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-3">
            <div className="flex items-center gap-2 font-medium text-purple-200 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Qualidade Gráfica</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['high', 'medium', 'low'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => onUpdateSettings({ graphicQuality: q })}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold tracking-wider capitalize transition ${
                    settings.graphicQuality === q
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                  }`}
                >
                  {q === 'high' ? 'Alta (120fps)' : q === 'medium' ? 'Média' : 'Baixa'}
                </button>
              ))}
            </div>
          </div>

          {/* Dock Settings */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Efeito Lupa no Dock</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ dockMagnification: !settings.dockMagnification })}
                className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                  settings.dockMagnification ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.dockMagnification ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Ocultação Automática</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ dockAutoHide: !settings.dockAutoHide })}
                className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                  settings.dockAutoHide ? 'bg-cyan-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.dockAutoHide ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
