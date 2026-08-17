import React from 'react';
import { Volume2, VolumeX, Monitor, Smartphone, HelpCircle, X, ShieldCheck } from 'lucide-react';
import { GameSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border-2 border-indigo-600 bg-slate-900 p-6 text-white shadow-2xl shadow-indigo-950/80 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="font-mono text-xl font-extrabold tracking-wider text-yellow-400 mb-6 border-b border-indigo-900/60 pb-3">
          CONFIGURAÇÕES DO JOGO
        </h2>

        <div className="space-y-4">
          {/* Audio Toggle */}
          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3.5 border border-slate-800">
            <div className="flex items-center space-x-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-yellow-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <span className="font-mono text-sm font-semibold">Efeitos de Áudio Synthesizer</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-yellow-400 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.soundEnabled ? 'LIGADO' : 'DESLIGADO'}
            </button>
          </div>

          {/* CRT Effect Toggle */}
          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3.5 border border-slate-800">
            <div className="flex items-center space-x-3">
              <Monitor className="w-5 h-5 text-cyan-400" />
              <span className="font-mono text-sm font-semibold">Efeito CRT Arcade (Scanlines)</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ crtEffect: !settings.crtEffect })}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                settings.crtEffect
                  ? 'bg-cyan-400 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.crtEffect ? 'ATIVADO' : 'DESATIVADO'}
            </button>
          </div>

          {/* Touch D-Pad Controls */}
          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3.5 border border-slate-800">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-pink-400" />
              <div className="flex flex-col">
                <span className="font-mono text-sm font-semibold">Controles Touch na Tela</span>
                <span className="text-[10px] text-slate-400">Ativo em celulares e tablets</span>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ touchControlsVisible: !settings.touchControlsVisible })}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                settings.touchControlsVisible
                  ? 'bg-pink-400 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.touchControlsVisible ? 'ATIVADO' : 'DESATIVADO'}
            </button>
          </div>
        </div>

        {/* HOW TO PLAY SECTION */}
        <div className="mt-6 rounded-xl border border-indigo-900/60 bg-slate-950/80 p-4 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-yellow-400 font-mono font-bold text-sm mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>COMO JOGAR PAC-MAN</span>
          </div>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            <li>
              Use as <strong className="text-yellow-400">Setas do Teclado</strong> ou os botões{' '}
              <strong className="text-yellow-400">WASD</strong> / <strong className="text-yellow-400">Touch</strong> para mover o Pac-Man.
            </li>
            <li>Coma todos os pontos dourados pelo labirinto para concluir a partida.</li>
            <li>
              Coma as <strong className="text-yellow-300">Grandes Pílulas de Poder</strong> para deixar os fantasmas azuis e assustados!
            </li>
            <li>Toque nos fantasmas azuis para devorá-los e ganhar bônus acumulativos (200, 400, 800, 1600 pontos).</li>
            <li>Cuidado com as personalidades de Blinky (Vermelho), Pinky (Rosa), Inky (Ciano) e Clyde (Laranja).</li>
          </ul>
        </div>

        {/* Close */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-indigo-600 py-2.5 font-mono text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg cursor-pointer"
          >
            VOLTAR AO JOGO
          </button>
        </div>
      </div>
    </div>
  );
};
