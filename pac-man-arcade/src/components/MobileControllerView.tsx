import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Volume2,
  VolumeX,
  Vibrate,
  VibrateOff,
  Palette,
  RotateCcw,
  Play,
  Pause,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Wifi,
  WifiOff,
  Smartphone,
  ChevronDown,
} from 'lucide-react';
import { useRemoteControl } from '../hooks/useRemoteControl';
import { ControllerTheme, ControllerLayout, RemoteInputAction } from '../types';
import { soundEngine } from '../utils/audio';

interface MobileControllerViewProps {
  roomIdOverride?: string;
  onCloseController?: () => void;
}

export const MobileControllerView: React.FC<MobileControllerViewProps> = ({
  roomIdOverride,
  onCloseController,
}) => {
  const [theme, setTheme] = useState<ControllerTheme>('classic');
  const [layout, setLayout] = useState<ControllerLayout>('dpad');
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  const {
    roomId,
    isConnected,
    hasHost,
    latestGameState,
    sendInput,
  } = useRemoteControl({
    role: 'CONTROLLER',
    roomIdOverride,
  });

  // Handle haptic vibration
  const triggerHaptic = (ms = 25) => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // ignore
      }
    }
  };

  // Dispatch direction or action command
  const handleAction = (action: RemoteInputAction) => {
    triggerHaptic();
    if (soundEnabled) {
      soundEngine.playWaka();
    }
    sendInput(action);

    if (['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(action)) {
      setActiveDirection(action);
      setTimeout(() => setActiveDirection(null), 180);
    }
  };

  // Touch Swipe Gesture handler
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;
    const minSwipeDist = 25;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minSwipeDist) {
        handleAction(dx > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(dy) > minSwipeDist) {
        handleAction(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartPos.current = null;
  };

  // Theme Styles map
  const themeStyles = {
    classic: {
      bg: 'bg-slate-950',
      card: 'bg-slate-900 border-yellow-500/50 shadow-yellow-500/10',
      accent: 'from-yellow-400 via-amber-400 to-yellow-500',
      btnDpad: 'bg-slate-800 text-yellow-400 border-yellow-500/40 active:bg-yellow-400 active:text-slate-950 shadow-lg shadow-yellow-500/20',
      btnAction: 'bg-yellow-400 text-slate-950 font-black hover:bg-yellow-300 shadow-yellow-500/30',
      badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    },
    cyberpunk: {
      bg: 'bg-black',
      card: 'bg-purple-950/80 border-cyan-400/60 shadow-cyan-500/20',
      accent: 'from-cyan-400 via-fuchsia-500 to-pink-500',
      btnDpad: 'bg-fuchsia-950 text-cyan-300 border-cyan-400/50 active:bg-cyan-400 active:text-black shadow-lg shadow-cyan-500/30',
      btnAction: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black font-black shadow-cyan-500/40',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50',
    },
    gameboy: {
      bg: 'bg-stone-900',
      card: 'bg-stone-800 border-emerald-600/50 shadow-emerald-500/10',
      accent: 'from-emerald-400 to-teal-500',
      btnDpad: 'bg-stone-900 text-emerald-400 border-emerald-600/40 active:bg-emerald-500 active:text-stone-950',
      btnAction: 'bg-rose-600 text-white font-bold active:bg-rose-500 shadow-rose-600/30',
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    },
    red_ghost: {
      bg: 'bg-zinc-950',
      card: 'bg-zinc-900 border-red-500/50 shadow-red-500/10',
      accent: 'from-red-500 via-rose-500 to-amber-500',
      btnDpad: 'bg-zinc-900 text-red-400 border-red-500/40 active:bg-red-500 active:text-white',
      btnAction: 'bg-red-500 text-white font-bold hover:bg-red-400 shadow-red-500/30',
      badge: 'bg-red-500/20 text-red-400 border-red-500/40',
    },
    midnight: {
      bg: 'bg-slate-950',
      card: 'bg-indigo-950/90 border-indigo-500/50 shadow-indigo-500/10',
      accent: 'from-indigo-400 via-sky-400 to-blue-500',
      btnDpad: 'bg-slate-900 text-sky-400 border-indigo-500/40 active:bg-sky-400 active:text-slate-950',
      btnAction: 'bg-indigo-500 text-white font-bold hover:bg-indigo-400 shadow-indigo-500/30',
      badge: 'bg-indigo-500/20 text-sky-300 border-indigo-500/40',
    },
  }[theme];

  return (
    <div className={`min-h-screen ${themeStyles.bg} text-white flex flex-col justify-between p-3 select-none touch-none`}>
      {/* TOP HEADER: CONTROLLER TITLE & REALTIME SYNC BADGE */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <Gamepad2 className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="font-mono text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
              CONTROLE PAC-MAN
            </h1>
            <p className="font-mono text-[10px] text-slate-400">
              SALA: <span className="font-bold text-yellow-400">{roomId}</span>
            </p>
          </div>
        </div>

        {/* CONNECTION BADGE & QUICK SETTINGS TRIGGER */}
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
              hasHost
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}
          >
            {hasHost ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>CONECTADO</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>BUSCANDO...</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Palette className="w-4 h-4" />
          </button>

          {onCloseController && (
            <button
              type="button"
              onClick={onCloseController}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* SYNCED GAME STATS DASHBOARD (LIVE FEED FROM PC) */}
      <section className={`my-2 p-3 rounded-2xl border ${themeStyles.card} flex items-center justify-between font-mono text-xs shadow-xl`}>
        <div>
          <span className="text-slate-400 text-[10px] uppercase block tracking-wider">PONTOS</span>
          <span className="text-xl font-black text-yellow-400 tracking-wider">
            {latestGameState?.score !== undefined ? latestGameState.score : '0'}
          </span>
        </div>

        <div className="text-center">
          <span className="text-slate-400 text-[10px] uppercase block tracking-wider">VIDAS</span>
          <div className="flex items-center justify-center space-x-1 mt-0.5">
            {Array.from({ length: Math.max(0, latestGameState?.lives ?? 3) }).map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">💛</span>
            ))}
            {(latestGameState?.lives ?? 3) === 0 && (
              <span className="text-red-500 font-bold">GAME OVER</span>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-slate-400 text-[10px] uppercase block tracking-wider">NÍVEL / STATUS</span>
          <div className="flex items-center justify-end space-x-1">
            <span className="font-bold text-emerald-400">
              L{latestGameState?.level ?? 1}
            </span>
            <span className="text-slate-500">•</span>
            <span className="font-bold text-slate-300 text-[10px]">
              {latestGameState?.gameState ?? 'SALA'}
            </span>
          </div>
        </div>
      </section>

      {/* CUSTOMIZABLE MAIN CONTROLLER BODY */}
      <main className="flex-1 flex flex-col items-center justify-center py-2 px-1">
        {layout === 'dpad' && (
          <div className="relative w-64 h-64 flex items-center justify-center my-auto">
            {/* CROSS DPAD BACKPLATE */}
            <div className="absolute inset-0 m-auto w-52 h-52 bg-slate-900/80 rounded-full border border-slate-800 flex items-center justify-center shadow-inner" />

            {/* UP BUTTON */}
            <button
              type="button"
              onPointerDown={() => handleAction('UP')}
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-24 rounded-t-2xl border-t-2 border-x-2 ${themeStyles.btnDpad} flex flex-col items-center justify-start pt-3 active:scale-95 transition-all shadow-md cursor-pointer ${
                activeDirection === 'UP' ? 'ring-4 ring-yellow-400 bg-yellow-400 text-slate-950' : ''
              }`}
            >
              <ArrowUp className="w-8 h-8" />
            </button>

            {/* DOWN BUTTON */}
            <button
              type="button"
              onPointerDown={() => handleAction('DOWN')}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24 rounded-b-2xl border-b-2 border-x-2 ${themeStyles.btnDpad} flex flex-col items-center justify-end pb-3 active:scale-95 transition-all shadow-md cursor-pointer ${
                activeDirection === 'DOWN' ? 'ring-4 ring-yellow-400 bg-yellow-400 text-slate-950' : ''
              }`}
            >
              <ArrowDown className="w-8 h-8" />
            </button>

            {/* LEFT BUTTON */}
            <button
              type="button"
              onPointerDown={() => handleAction('LEFT')}
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-24 h-20 rounded-l-2xl border-l-2 border-y-2 ${themeStyles.btnDpad} flex items-center justify-start pl-3 active:scale-95 transition-all shadow-md cursor-pointer ${
                activeDirection === 'LEFT' ? 'ring-4 ring-yellow-400 bg-yellow-400 text-slate-950' : ''
              }`}
            >
              <ArrowLeft className="w-8 h-8" />
            </button>

            {/* RIGHT BUTTON */}
            <button
              type="button"
              onPointerDown={() => handleAction('RIGHT')}
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-24 h-20 rounded-r-2xl border-r-2 border-y-2 ${themeStyles.btnDpad} flex items-center justify-end pr-3 active:scale-95 transition-all shadow-md cursor-pointer ${
                activeDirection === 'RIGHT' ? 'ring-4 ring-yellow-400 bg-yellow-400 text-slate-950' : ''
              }`}
            >
              <ArrowRight className="w-8 h-8" />
            </button>

            {/* CENTER PIVOT BUTTON */}
            <div className="relative w-16 h-16 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center shadow-2xl z-10">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-yellow-400/80 animate-ping" />
              </div>
            </div>
          </div>
        )}

        {layout === 'joystick' && (
          <div className="relative w-64 h-64 flex items-center justify-center my-auto">
            <div className="absolute inset-0 m-auto w-56 h-56 bg-slate-900 border-4 border-slate-800 rounded-full flex items-center justify-center shadow-2xl">
              {/* JOYSTICK ARROWS GRID */}
              <button
                type="button"
                onPointerDown={() => handleAction('UP')}
                className="absolute top-2 w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 text-yellow-400 flex items-center justify-center active:bg-yellow-400 active:text-slate-950"
              >
                <ArrowUp className="w-8 h-8" />
              </button>
              <button
                type="button"
                onPointerDown={() => handleAction('DOWN')}
                className="absolute bottom-2 w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 text-yellow-400 flex items-center justify-center active:bg-yellow-400 active:text-slate-950"
              >
                <ArrowDown className="w-8 h-8" />
              </button>
              <button
                type="button"
                onPointerDown={() => handleAction('LEFT')}
                className="absolute left-2 w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 text-yellow-400 flex items-center justify-center active:bg-yellow-400 active:text-slate-950"
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
              <button
                type="button"
                onPointerDown={() => handleAction('RIGHT')}
                className="absolute right-2 w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 text-yellow-400 flex items-center justify-center active:bg-yellow-400 active:text-slate-950"
              >
                <ArrowRight className="w-8 h-8" />
              </button>

              {/* JOYSTICK KNOB CENTER */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-600 shadow-2xl flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-yellow-400 shadow-lg shadow-yellow-500/50" />
              </div>
            </div>
          </div>
        )}

        {layout === 'swipe' && (
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full max-w-xs h-64 rounded-3xl border-2 border-dashed border-yellow-500/50 bg-slate-900/80 flex flex-col items-center justify-center p-6 text-center shadow-xl my-auto cursor-pointer"
          >
            <Smartphone className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
            <h3 className="font-mono text-sm font-bold text-yellow-400">ÁREA DE GESTOS TOUCH</h3>
            <p className="font-mono text-xs text-slate-400 mt-1">
              Deslize o dedo em qualquer direção (Cima, Baixo, Esquerda, Direita) para controlar o Pac-Man.
            </p>
          </div>
        )}
      </main>

      {/* ACTION BUTTONS FOOTER BAR */}
      <footer className="space-y-2 mt-auto">
        <div className="grid grid-cols-3 gap-2">
          {/* START / ENTER BUTTON */}
          <button
            type="button"
            onPointerDown={() => handleAction('START')}
            className={`py-3.5 px-2 rounded-2xl ${themeStyles.btnAction} flex items-center justify-center space-x-1 font-mono text-xs shadow-lg active:scale-95 transition-all cursor-pointer col-span-2`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START / JOGAR</span>
          </button>

          {/* PAUSE / CONTINUAR */}
          <button
            type="button"
            onPointerDown={() => handleAction('PAUSE')}
            className="py-3.5 px-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold flex items-center justify-center space-x-1 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <Pause className="w-4 h-4" />
            <span>PAUSA</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* RESTART BUTTON */}
          <button
            type="button"
            onPointerDown={() => handleAction('RESET')}
            className="py-2.5 px-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center space-x-1 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>REINICIAR</span>
          </button>

          {/* TURBO SPEED BOOST */}
          <button
            type="button"
            onPointerDown={() => handleAction('TURBO_ON')}
            onPointerUp={() => handleAction('TURBO_OFF')}
            className="py-2.5 px-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 font-mono text-xs font-bold flex items-center justify-center space-x-1 active:scale-95 active:bg-amber-500 active:text-slate-950 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>TURBO</span>
          </button>
        </div>
      </footer>

      {/* THEME & SETTINGS DRAWER OVERLAY */}
      {showSettingsDrawer && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 p-4 flex flex-col justify-end">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 space-y-4 max-w-md mx-auto w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-mono text-sm font-bold text-yellow-400">PERSONALIZAR CONTROLE</h3>
              <button
                type="button"
                onClick={() => setShowSettingsDrawer(false)}
                className="text-slate-400 hover:text-white font-mono text-xs p-1"
              >
                FECHAR
              </button>
            </div>

            {/* THEME CHOOSER */}
            <div>
              <label className="font-mono text-xs text-slate-400 block mb-2">TEMA VISUAL</label>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setTheme('classic')}
                  className={`p-2.5 rounded-xl border ${
                    theme === 'classic'
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  🟡 Amarelo Arcade
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('cyberpunk')}
                  className={`p-2.5 rounded-xl border ${
                    theme === 'cyberpunk'
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  🟣 Neon Cyber
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('gameboy')}
                  className={`p-2.5 rounded-xl border ${
                    theme === 'gameboy'
                      ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  🟢 Retro GameBoy
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('red_ghost')}
                  className={`p-2.5 rounded-xl border ${
                    theme === 'red_ghost'
                      ? 'border-red-400 bg-red-400/20 text-red-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  🔴 Ghost Fire
                </button>
              </div>
            </div>

            {/* LAYOUT TYPE */}
            <div>
              <label className="font-mono text-xs text-slate-400 block mb-2">ESTILO DE DIREÇÃO</label>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setLayout('dpad')}
                  className={`p-2.5 rounded-xl border text-center ${
                    layout === 'dpad'
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  🎯 Cruzeta D-Pad
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('joystick')}
                  className={`p-2.5 rounded-xl border text-center ${
                    layout === 'joystick'
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  🕹️ Joystick
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('swipe')}
                  className={`p-2.5 rounded-xl border text-center ${
                    layout === 'swipe'
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  👆 Swipe Touch
                </button>
              </div>
            </div>

            {/* HAPTIC VIBRATION & SOUND TOGGLES */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setVibrationEnabled(!vibrationEnabled)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center space-x-2 font-mono text-xs"
              >
                {vibrationEnabled ? (
                  <>
                    <Vibrate className="w-4 h-4 text-emerald-400" />
                    <span>Vibração ON</span>
                  </>
                ) : (
                  <>
                    <VibrateOff className="w-4 h-4 text-slate-500" />
                    <span>Vibração OFF</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center space-x-2 font-mono text-xs"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-yellow-400" />
                    <span>Sons ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-slate-500" />
                    <span>Sons OFF</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSettingsDrawer(false)}
              className="w-full py-3 rounded-2xl bg-yellow-400 text-slate-950 font-mono font-bold text-xs"
            >
              SALVAR E CONTINUAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
