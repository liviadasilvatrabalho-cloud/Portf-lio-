import React, { useState, useEffect, useCallback } from 'react';
import { Direction } from './types';
import { sounds } from './utils/sound';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
  Vibrate,
  Gamepad2,
  Radio,
  Sparkles,
  Activity,
  Zap,
} from 'lucide-react';

export default function App() {
  const [activeDirection, setActiveDirection] = useState<Direction>('NONE');
  const [inputType, setInputType] = useState<'dpad' | 'joystick'>('dpad');
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isVibrateOn, setIsVibrateOn] = useState(true);
  const [inputCount, setInputCount] = useState(0);
  const [lastAction, setLastAction] = useState<string>('NEUTRO');
  const [actionA, setActionA] = useState(false);
  const [actionB, setActionB] = useState(false);

  // Joystick position state
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDraggingJoystick, setIsDraggingJoystick] = useState(false);

  const handlePressDirection = useCallback((dir: Direction) => {
    setActiveDirection(dir);
    setLastAction(dir);
    setInputCount((c) => c + 1);
    sounds.playButtonClick();
  }, []);

  const handleReleaseDirection = useCallback(() => {
    setActiveDirection('NONE');
  }, []);

  const triggerButtonA = useCallback(() => {
    setActionA(true);
    setLastAction('BOTÃO A');
    setInputCount((c) => c + 1);
    sounds.playBoost();
    setTimeout(() => setActionA(false), 200);
  }, []);

  const triggerButtonB = useCallback(() => {
    setActionB(true);
    setLastAction('BOTÃO B');
    setInputCount((c) => c + 1);
    sounds.playFreeze();
    setTimeout(() => setActionB(false), 200);
  }, []);

  const toggleSound = useCallback(() => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    sounds.setSoundEnabled(next);
  }, [isSoundOn]);

  const toggleVibrate = useCallback(() => {
    const next = !isVibrateOn;
    setIsVibrateOn(next);
    sounds.setVibrationEnabled(next);
  }, [isVibrateOn]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        handlePressDirection('UP');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        handlePressDirection('DOWN');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handlePressDirection('LEFT');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handlePressDirection('RIGHT');
      } else if (e.code === 'Space' || e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        triggerButtonA();
      } else if (e.key === 'x' || e.key === 'X') {
        triggerButtonB();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        ['ArrowUp', 'w', 'W', 'ArrowDown', 's', 'S', 'ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D'].includes(
          e.key
        )
      ) {
        handleReleaseDirection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handlePressDirection, handleReleaseDirection, triggerButtonA, triggerButtonB]);

  const isUpActive = activeDirection === 'UP';
  const isDownActive = activeDirection === 'DOWN';
  const isLeftActive = activeDirection === 'LEFT';
  const isRightActive = activeDirection === 'RIGHT';

  // Rotation for mini interactive preview
  let pacmanRotation = 'rotate-0';
  if (activeDirection === 'DOWN') pacmanRotation = 'rotate-90';
  if (activeDirection === 'LEFT') pacmanRotation = 'rotate-180';
  if (activeDirection === 'UP') pacmanRotation = '-rotate-90';

  return (
    <div className="min-h-screen bg-[#06070d] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Arcade Controller Unit Console */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#131627] via-[#0d101d] to-[#080a14] border-[3px] border-[#222a45] rounded-[42px] p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.95),inset_0_1px_2px_rgba(255,255,255,0.15)] relative z-10 flex flex-col gap-8">
        
        {/* Top Console Display Header */}
        <div className="bg-[#080a12] rounded-3xl border border-[#1d253d] p-4 sm:p-5 shadow-inner flex flex-wrap items-center justify-between gap-4 font-mono">
          {/* Brand & Connection Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#121729] border border-blue-500/30 flex items-center justify-center shadow-[inset_0_0_10px_rgba(59,130,246,0.3)]">
              <div className={`w-5 h-5 rounded-full bg-[#ffe600] clip-pacman shadow-[0_0_10px_#ffe600] transition-transform duration-150 ${pacmanRotation}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                <h1 className="text-sm font-extrabold text-white tracking-widest uppercase">CONTROLE ARCADE</h1>
              </div>
              <p className="text-[10px] text-blue-400/70 tracking-widest uppercase">PAC-COMMAND NEXUS v2.0</p>
            </div>
          </div>

          {/* Real-Time Telemetry HUD */}
          <div className="flex items-center gap-4 bg-[#0d101e] px-4 py-2 rounded-2xl border border-[#1d253d]">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-400 tracking-wider uppercase">DIREÇÃO</span>
              <span className="text-xs font-black text-[#ffe600] drop-shadow-[0_0_8px_rgba(255,230,0,0.5)]">
                {activeDirection === 'NONE' ? 'NEUTRO' : activeDirection}
              </span>
            </div>
            <div className="h-6 w-px bg-[#1d253d]" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-400 tracking-wider uppercase">COMANDOS</span>
              <span className="text-xs font-black text-white">{inputCount}</span>
            </div>
          </div>

          {/* Sound & Vibration Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              title="Alternar Som"
              className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                isSoundOn
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-[#121627] border-[#1d253d] text-slate-500'
              }`}
            >
              {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleVibrate}
              title="Alternar Vibração"
              className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                isVibrateOn
                  ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                  : 'bg-[#121627] border-[#1d253d] text-slate-500'
              }`}
            >
              <Vibrate className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Console Deck Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2">
          
          {/* LEFT: Classic Beveled Neon D-Pad */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-[#080a12] border-2 border-[#1d253d] shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] flex items-center justify-center p-4">
              
              {/* Outer Ring Accent */}
              <div className="absolute inset-4 rounded-full border border-dashed border-[#1d253d]/60 pointer-events-none" />

              <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
                {/* UP BUTTON */}
                <button
                  type="button"
                  onPointerDown={() => handlePressDirection('UP')}
                  onPointerUp={handleReleaseDirection}
                  onPointerLeave={handleReleaseDirection}
                  className={`absolute top-0 w-16 sm:w-20 h-24 sm:h-28 rounded-t-3xl flex items-start justify-center pt-3 transition-all duration-100 ${
                    isUpActive
                      ? 'bg-[#ffe600] text-slate-950 shadow-[0_0_35px_#ffe600] scale-95 z-20'
                      : 'bg-[#1b2238] hover:bg-[#232c48] text-white border-t-2 border-x border-[#2b375b] shadow-[0_8px_16px_rgba(0,0,0,0.5)] z-10'
                  }`}
                >
                  <ArrowUp className="w-8 h-8 sm:w-9 sm:h-9 stroke-[3]" />
                </button>

                {/* DOWN BUTTON */}
                <button
                  type="button"
                  onPointerDown={() => handlePressDirection('DOWN')}
                  onPointerUp={handleReleaseDirection}
                  onPointerLeave={handleReleaseDirection}
                  className={`absolute bottom-0 w-16 sm:w-20 h-24 sm:h-28 rounded-b-3xl flex items-end justify-center pb-3 transition-all duration-100 ${
                    isDownActive
                      ? 'bg-[#ffe600] text-slate-950 shadow-[0_0_35px_#ffe600] scale-95 z-20'
                      : 'bg-[#1b2238] hover:bg-[#232c48] text-white border-b-2 border-x border-[#2b375b] shadow-[0_8px_16px_rgba(0,0,0,0.5)] z-10'
                  }`}
                >
                  <ArrowDown className="w-8 h-8 sm:w-9 sm:h-9 stroke-[3]" />
                </button>

                {/* LEFT BUTTON */}
                <button
                  type="button"
                  onPointerDown={() => handlePressDirection('LEFT')}
                  onPointerUp={handleReleaseDirection}
                  onPointerLeave={handleReleaseDirection}
                  className={`absolute left-0 h-16 sm:h-20 w-24 sm:w-28 rounded-l-3xl flex items-center justify-start pl-3 transition-all duration-100 ${
                    isLeftActive
                      ? 'bg-[#ffe600] text-slate-950 shadow-[0_0_35px_#ffe600] scale-95 z-20'
                      : 'bg-[#1b2238] hover:bg-[#232c48] text-white border-l-2 border-y border-[#2b375b] shadow-[0_8px_16px_rgba(0,0,0,0.5)] z-10'
                  }`}
                >
                  <ArrowLeft className="w-8 h-8 sm:w-9 sm:h-9 stroke-[3]" />
                </button>

                {/* RIGHT BUTTON */}
                <button
                  type="button"
                  onPointerDown={() => handlePressDirection('RIGHT')}
                  onPointerUp={handleReleaseDirection}
                  onPointerLeave={handleReleaseDirection}
                  className={`absolute right-0 h-16 sm:h-20 w-24 sm:w-28 rounded-r-3xl flex items-center justify-end pr-3 transition-all duration-100 ${
                    isRightActive
                      ? 'bg-[#ffe600] text-slate-950 shadow-[0_0_35px_#ffe600] scale-95 z-20'
                      : 'bg-[#1b2238] hover:bg-[#232c48] text-white border-r-2 border-y border-[#2b375b] shadow-[0_8px_16px_rgba(0,0,0,0.5)] z-10'
                  }`}
                >
                  <ArrowRight className="w-8 h-8 sm:w-9 sm:h-9 stroke-[3]" />
                </button>

                {/* Center Pivot Cap */}
                <div className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-[#111526] rounded-2xl border border-[#2b375b] shadow-inner flex items-center justify-center pointer-events-none z-30">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#080a12] border border-[#2b375b] shadow-inner" />
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mt-1">
              <Gamepad2 className="w-3.5 h-3.5 text-[#ffe600]" /> D-PAD DIRECIONAL
            </div>
          </div>

          {/* RIGHT: Action Buttons (A & B) */}
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-[#080a12] border-2 border-[#1d253d] shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] flex items-center justify-center p-4">
              
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* BUTTON A (Green) */}
                <button
                  type="button"
                  onPointerDown={triggerButtonA}
                  className={`absolute bottom-2 right-2 w-20 h-20 rounded-full border-2 font-black text-xl flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
                    actionA
                      ? 'bg-emerald-400 border-emerald-200 text-slate-950 shadow-[0_0_25px_#10b981] scale-95'
                      : 'bg-gradient-to-br from-emerald-500 to-green-700 border-emerald-300 text-slate-950 hover:brightness-110'
                  }`}
                >
                  A
                </button>

                {/* BUTTON B (Red) */}
                <button
                  type="button"
                  onPointerDown={triggerButtonB}
                  className={`absolute top-2 left-2 w-20 h-20 rounded-full border-2 font-black text-xl flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
                    actionB
                      ? 'bg-rose-400 border-rose-200 text-slate-950 shadow-[0_0_25px_#f43f5e] scale-95'
                      : 'bg-gradient-to-br from-rose-500 to-red-700 border-rose-300 text-slate-950 hover:brightness-110'
                  }`}
                >
                  B
                </button>

                <div className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase">AÇÕES</div>
              </div>
            </div>

            <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> BOTÕES A & B
            </div>
          </div>
        </div>

        {/* Footer Shortcut Bar */}
        <div className="border-t border-[#1d253d] pt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
          <div className="flex items-center gap-3">
            <span>🎮 WASD / Setas = Direcional</span>
            <span>• Espaço/Z = Botão A</span>
            <span>• X = Botão B</span>
          </div>
          <div className="text-blue-400/80 font-bold">ARCADE DECK ONLINE</div>
        </div>

      </div>
    </div>
  );
}
