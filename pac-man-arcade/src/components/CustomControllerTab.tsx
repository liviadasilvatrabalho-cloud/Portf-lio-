import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Smartphone,
  Copy,
  Check,
  Wifi,
  WifiOff,
  Palette,
  Gamepad2,
  RefreshCw,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ControllerTheme, ControllerLayout, RemoteInputAction, GameState } from '../types';

interface CustomControllerTabProps {
  roomId: string;
  onChangeRoomId: (newRoomId: string) => void;
  controllerConnected: boolean;
  controllerCount: number;
  onSendRemoteInput: (action: RemoteInputAction) => void;
  score: number;
  lives: number;
  level: number;
  gameState: GameState;
}

export const CustomControllerTab: React.FC<CustomControllerTabProps> = ({
  roomId,
  onChangeRoomId,
  controllerConnected,
  controllerCount,
  onSendRemoteInput,
  score,
  lives,
  level,
  gameState,
}) => {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<ControllerTheme>('classic');
  const [layout, setLayout] = useState<ControllerLayout>('dpad');

  // Build direct full controller URL
  const controllerUrl = `${window.location.origin}${window.location.pathname}?mode=controller&room=${roomId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(controllerUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateNewRoomCode = () => {
    const newId = 'PAC-' + Math.floor(1000 + Math.random() * 9000);
    onChangeRoomId(newId);
  };

  // Theme styling previews
  const themeCardStyles = {
    classic: 'border-yellow-500/60 bg-slate-900 shadow-yellow-500/10',
    cyberpunk: 'border-cyan-400/60 bg-purple-950/60 shadow-cyan-500/10',
    gameboy: 'border-emerald-500/60 bg-stone-900 shadow-emerald-500/10',
    red_ghost: 'border-red-500/60 bg-zinc-900 shadow-red-500/10',
    midnight: 'border-indigo-500/60 bg-slate-900 shadow-indigo-500/10',
  }[theme];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-white p-2 sm:p-4">
      {/* HEADER BANNER */}
      <div className="rounded-3xl border-2 border-yellow-400/80 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>CONTROLE REMOTO SEM FIO</span>
          </div>
          <h2 className="font-mono text-xl sm:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
            JOGUE COM O SEU CELULAR
          </h2>
          <p className="font-mono text-xs text-slate-300 mt-1 max-w-lg">
            Transforme seu smartphone em um controle arcade personalizado para jogar Pac-Man no computador ou tablet!
          </p>
        </div>

        {/* CONNECTION STATUS BADGE */}
        <div className="flex flex-col items-center sm:items-end">
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-mono text-xs font-bold border shadow-lg ${
              controllerConnected
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/20'
            }`}
          >
            {controllerConnected ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{controllerCount} CELULAR(ES) CONECTADO(S)</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-400" />
                <span>AGUARDANDO CELULAR...</span>
              </>
            )}
          </div>
          <span className="font-mono text-[10px] text-slate-400 mt-1">
            SALA: <strong className="text-yellow-400">{roomId}</strong>
          </span>
        </div>
      </div>

      {/* MAIN CONTENT GRID: QR CODE PANEL & CONTROLLER STUDIO PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: QR CODE & CONNECTION INSTRUCTIONS */}
        <div className="rounded-3xl border-2 border-slate-800 bg-slate-900/90 p-6 flex flex-col items-center justify-between shadow-2xl">
          <div className="w-full text-center space-y-2 mb-4">
            <h3 className="font-mono text-base font-bold text-yellow-400 flex items-center justify-center space-x-2">
              <QrCode className="w-5 h-5" />
              <span>ESCANEIE O QR CODE</span>
            </h3>
            <p className="font-mono text-xs text-slate-400">
              Abra a câmera do celular para abrir o controle personalizado
            </p>
          </div>

          {/* QR CODE DISPLAY */}
          <div className="relative p-4 rounded-2xl bg-white border-4 border-yellow-400 shadow-2xl shadow-yellow-500/20 my-2 group">
            <QRCodeSVG
              value={controllerUrl}
              size={200}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23eab308'><circle cx='12' cy='12' r='10'/></svg>",
                x: undefined,
                y: undefined,
                height: 32,
                width: 32,
                excavate: true,
              }}
            />
            {controllerConnected && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center p-2 text-center">
                <Smartphone className="w-10 h-10 text-emerald-400 animate-bounce mb-1" />
                <span className="font-mono text-xs font-bold text-emerald-300">CELULAR CONECTADO!</span>
                <span className="font-mono text-[10px] text-slate-300 mt-0.5">Pressione os botões no telefone para jogar</span>
              </div>
            )}
          </div>

          {/* ROOM CODE & COPY LINK BUTTONS */}
          <div className="w-full space-y-3 mt-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Código da Sala:</span>
                <strong className="text-yellow-400 text-sm tracking-wider">{roomId}</strong>
              </div>
              <button
                type="button"
                onClick={generateNewRoomCode}
                title="Gerar Novo Código"
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-3 px-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold flex items-center justify-center space-x-2 shadow-lg shadow-yellow-500/20 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>LINK COPIADO!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPIAR LINK DO CONTROLE</span>
                </>
              )}
            </button>
          </div>

          {/* QUICK STEPS INSTRUCTIONS */}
          <div className="w-full mt-6 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
            <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-yellow-400 font-bold block text-sm mb-0.5">1</span>
              <span className="text-slate-300">Escaneie o QR Code</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-yellow-400 font-bold block text-sm mb-0.5">2</span>
              <span className="text-slate-300">Escolha o Tema</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-yellow-400 font-bold block text-sm mb-0.5">3</span>
              <span className="text-slate-300">Jogue no PC/Tablet!</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTROLLER CUSTOMIZER STUDIO & LIVE TEST */}
        <div className={`rounded-3xl border-2 ${themeCardStyles} p-6 flex flex-col justify-between shadow-2xl transition-all`}>
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="font-mono text-base font-bold text-yellow-400 flex items-center space-x-2">
                <Gamepad2 className="w-5 h-5" />
                <span>PERSONALIZAR CONTROLE</span>
              </h3>
              <div className="flex items-center space-x-1 font-mono text-xs text-slate-400">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Custom Studio</span>
              </div>
            </div>

            {/* THEME SELECTION */}
            <div className="space-y-2 mb-4">
              <label className="font-mono text-xs text-slate-400 block">TEMA VISUAL DO CONTROLE:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setTheme('classic')}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                    theme === 'classic'
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  🟡 Amarelo Arcade
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('cyberpunk')}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                    theme === 'cyberpunk'
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  🟣 Neon Cyber
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('gameboy')}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                    theme === 'gameboy'
                      ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  🟢 Retro GameBoy
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('red_ghost')}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                    theme === 'red_ghost'
                      ? 'border-red-400 bg-red-400/20 text-red-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  🔴 Ghost Fire
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('midnight')}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                    theme === 'midnight'
                      ? 'border-indigo-400 bg-indigo-400/20 text-sky-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  🔵 Midnight
                </button>
              </div>
            </div>

            {/* DIRECTION LAYOUT SELECTION */}
            <div className="space-y-2 mb-6">
              <label className="font-mono text-xs text-slate-400 block">ESTILO DE DIREÇÃO:</label>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setLayout('dpad')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    layout === 'dpad'
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  🎯 Cruzeta D-Pad
                </button>

                <button
                  type="button"
                  onClick={() => setLayout('joystick')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    layout === 'joystick'
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  🕹️ Joystick
                </button>

                <button
                  type="button"
                  onClick={() => setLayout('swipe')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    layout === 'swipe'
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  👆 Swipe Touch
                </button>
              </div>
            </div>

            {/* INTERACTIVE CONTROLLER TEST PAD */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
              <span className="font-mono text-xs font-bold text-yellow-400 block uppercase">
                TESTE DE BOTÕES NO COMPUTADOR / TABLET
              </span>

              {/* DPAD BUTTONS PREVIEW */}
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-2">
                <button
                  type="button"
                  onClick={() => onSendRemoteInput('UP')}
                  className="absolute top-0 w-12 h-14 rounded-t-xl bg-slate-800 border-2 border-yellow-500/50 text-yellow-400 flex items-center justify-center hover:bg-yellow-400 hover:text-slate-950 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => onSendRemoteInput('DOWN')}
                  className="absolute bottom-0 w-12 h-14 rounded-b-xl bg-slate-800 border-2 border-yellow-500/50 text-yellow-400 flex items-center justify-center hover:bg-yellow-400 hover:text-slate-950 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowDown className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => onSendRemoteInput('LEFT')}
                  className="absolute left-0 w-14 h-12 rounded-l-xl bg-slate-800 border-2 border-yellow-500/50 text-yellow-400 flex items-center justify-center hover:bg-yellow-400 hover:text-slate-950 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => onSendRemoteInput('RIGHT')}
                  className="absolute right-0 w-14 h-12 rounded-r-xl bg-slate-800 border-2 border-yellow-500/50 text-yellow-400 flex items-center justify-center hover:bg-yellow-400 hover:text-slate-950 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-500">
                  PAC
                </div>
              </div>

              {/* ACTION TEST BUTTONS */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onSendRemoteInput('START')}
                  className="py-2.5 px-3 rounded-xl bg-yellow-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center space-x-1 hover:bg-yellow-300 active:scale-95 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>START</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSendRemoteInput('PAUSE')}
                  className="py-2.5 px-3 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center space-x-1 hover:bg-indigo-500 active:scale-95 cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>PAUSA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
