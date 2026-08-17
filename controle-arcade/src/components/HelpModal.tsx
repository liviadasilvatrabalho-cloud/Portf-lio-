import React from 'react';
import { X, Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#121225] border-2 border-slate-700 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto font-mono text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-[#f0f000]/10 border border-[#f0f000]/20 text-[#f0f000]">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">
              CONTROLE ARCADE
            </h2>
            <p className="text-xs text-slate-400">GUIA DE CONTROLES E ATALHOS</p>
          </div>
        </div>

        {/* Section 1: Controller Overview */}
        <div className="mb-5 bg-[#080812] p-4 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-[#f0f000] uppercase mb-2 flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" /> RECURSOS DO CONTROLE
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Controle interativo com suporte a toque, clique do mouse e atalhos no teclado físico!
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
              <span className="text-[#f0f000] font-bold">D-PAD</span>
              <span className="text-slate-400">Direcional Digital</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
              <span className="text-[#f0f000] font-bold">JOYSTICK</span>
              <span className="text-slate-400">Analógico 360°</span>
            </div>
          </div>
        </div>

        {/* Section 2: Keyboard Shortcuts */}
        <div className="bg-[#080812] p-4 rounded-2xl border border-slate-800 text-xs">
          <h3 className="text-sm font-bold text-cyan-400 uppercase mb-3">ATALHOS DO TECLADO</h3>
          <div className="space-y-2 text-slate-300">
            <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl">
              <span>Direcionais:</span>
              <span className="text-[#f0f000] font-bold">Setas (↑ ↓ ← →) ou W, A, S, D</span>
            </div>
            <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl">
              <span>Botão A / Botão B:</span>
              <span className="text-emerald-400 font-bold">Espaço / Z (A) | Tecla X (B)</span>
            </div>
            <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl">
              <span>Botão X / Botão Y:</span>
              <span className="text-blue-400 font-bold">Tecla C (X) | Tecla V (Y)</span>
            </div>
            <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl">
              <span>Gatilhos L1 / R1:</span>
              <span className="text-indigo-400 font-bold">Tecla Q (L1) | Tecla E (R1)</span>
            </div>
            <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl">
              <span>Start / Select:</span>
              <span className="text-amber-400 font-bold">Enter (Start) | Shift (Select)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export { HelpModal as default };
