import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Direction } from '../types';
import { sounds } from '../utils/sound';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Vibrate,
  Gamepad2,
  Radio,
  Power,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ArcadeControllerProps {
  onDirectionChange: (dir: Direction) => void;
  onButtonPress: (buttonName: string) => void;
  onSoundToggle: () => void;
  onVibrateToggle: () => void;
  currentDirection: Direction;
  activeButtons: Set<string>;
  isSoundOn: boolean;
  isVibrateOn: boolean;
  isPaused: boolean;
  activePhysicalKey: string | null;
}

export const ArcadeController: React.FC<ArcadeControllerProps> = ({
  onDirectionChange,
  onButtonPress,
  onSoundToggle,
  onVibrateToggle,
  currentDirection,
  activeButtons,
  isSoundOn,
  isVibrateOn,
  isPaused,
  activePhysicalKey,
}) => {
  const [inputType, setInputType] = useState<'dpad' | 'joystick'>('dpad');
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDraggingJoystick, setIsDraggingJoystick] = useState(false);

  const joystickBaseRef = useRef<HTMLDivElement | null>(null);

  const triggerDirection = useCallback(
    (dir: Direction) => {
      sounds.playButtonClick();
      onDirectionChange(dir);
    },
    [onDirectionChange]
  );

  // Joystick Drag & Angle Handler
  const handleJoystickMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!joystickBaseRef.current) return;
      const rect = joystickBaseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = rect.width / 2 - 12;

      let clampedX = deltaX;
      let clampedY = deltaY;

      if (distance > maxDistance) {
        clampedX = (deltaX / distance) * maxDistance;
        clampedY = (deltaY / distance) * maxDistance;
      }

      setJoystickPos({ x: clampedX, y: clampedY });

      // Calculate direction from joystick angle
      if (distance > 15) {
        const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
        if (angle >= -45 && angle <= 45) {
          triggerDirection('RIGHT');
        } else if (angle > 45 && angle < 135) {
          triggerDirection('DOWN');
        } else if (angle >= 135 || angle <= -135) {
          triggerDirection('LEFT');
        } else if (angle >= -135 && angle < -45) {
          triggerDirection('UP');
        }
      }
    },
    [triggerDirection]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (inputType !== 'joystick') return;
    setIsDraggingJoystick(true);
    handleJoystickMove(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingJoystick || inputType !== 'joystick') return;
    handleJoystickMove(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDraggingJoystick(false);
    setJoystickPos({ x: 0, y: 0 });
  };

  useEffect(() => {
    const onUp = () => {
      if (isDraggingJoystick) {
        setIsDraggingJoystick(false);
        setJoystickPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, [isDraggingJoystick]);

  // Active directions
  const isUpActive = currentDirection === 'UP' || activePhysicalKey === 'UP';
  const isDownActive = currentDirection === 'DOWN' || activePhysicalKey === 'DOWN';
  const isLeftActive = currentDirection === 'LEFT' || activePhysicalKey === 'LEFT';
  const isRightActive = currentDirection === 'RIGHT' || activePhysicalKey === 'RIGHT';

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-[#16162a] to-[#0c0c18] border-[3px] border-[#252548] rounded-[36px] p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.1)] relative overflow-hidden select-none font-mono text-white">
      {/* Top Bumper / Shoulder Triggers (L1 & R1) */}
      <div className="flex justify-between items-center -mt-2 mb-6 px-4">
        {/* L1 Bumper */}
        <button
          type="button"
          onPointerDown={() => onButtonPress('L1')}
          className={`w-28 sm:w-36 h-8 rounded-t-xl border-t-2 border-x border-slate-600 font-extrabold text-xs tracking-wider transition-all active:scale-95 shadow-md flex items-center justify-center ${
            activeButtons.has('L1')
              ? 'bg-blue-500 text-white border-blue-300 shadow-[0_0_15px_#3b82f6]'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          L1
        </button>

        {/* Center Controller Status LED Display */}
        <div className="flex items-center gap-2 bg-[#080812] px-4 py-1.5 rounded-full border border-slate-700 shadow-inner">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
          <span className="text-[11px] font-bold tracking-widest text-slate-300 uppercase">
            CONTROLE ARCADE
          </span>
        </div>

        {/* R1 Bumper */}
        <button
          type="button"
          onPointerDown={() => onButtonPress('R1')}
          className={`w-28 sm:w-36 h-8 rounded-t-xl border-t-2 border-x border-slate-600 font-extrabold text-xs tracking-wider transition-all active:scale-95 shadow-md flex items-center justify-center ${
            activeButtons.has('R1')
              ? 'bg-blue-500 text-white border-blue-300 shadow-[0_0_15px_#3b82f6]'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          R1
        </button>
      </div>

      {/* Top Header Deck Controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#252548] pb-4 mb-6 gap-3">
        {/* Mode Selector (D-PAD vs JOYSTICK) */}
        <div className="flex items-center bg-[#080812] p-1 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => {
              sounds.playButtonClick();
              setInputType('dpad');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              inputType === 'dpad'
                ? 'bg-[#f0f000] text-slate-950 shadow-[0_0_12px_rgba(240,240,0,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>D-PAD</span>
          </button>
          <button
            onClick={() => {
              sounds.playButtonClick();
              setInputType('joystick');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              inputType === 'joystick'
                ? 'bg-[#f0f000] text-slate-950 shadow-[0_0_12px_rgba(240,240,0,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>JOYSTICK</span>
          </button>
        </div>

        {/* LED Signal Matrix */}
        <div className="flex items-center gap-2 bg-[#080812] px-3 py-1.5 rounded-2xl border border-slate-800 text-[11px]">
          <span className="text-slate-400">DIREÇÃO:</span>
          <span className="text-[#f0f000] font-black uppercase tracking-wider">
            {currentDirection === 'NONE' ? 'NENHUMA' : currentDirection}
          </span>
        </div>

        {/* System Utility Toggles (Sound & Vibration) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSoundToggle}
            title="Alternar Som"
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              isSoundOn
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onVibrateToggle}
            title="Alternar Vibração"
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              isVibrateOn
                ? 'bg-indigo-950/80 border-indigo-500 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Vibrate className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Gamepad Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2">
        {/* Left Control: D-PAD or ANALOG JOYSTICK */}
        <div className="flex justify-center items-center">
          {inputType === 'dpad' ? (
            /* Classic Cross D-Pad */
            <div className="relative w-48 h-48 bg-[#080812] rounded-full border-2 border-slate-800 flex items-center justify-center p-3 shadow-inner">
              <div className="relative w-40 h-40">
                {/* UP */}
                <button
                  type="button"
                  onPointerDown={() => triggerDirection('UP')}
                  className={`absolute top-0 left-13 w-14 h-16 rounded-t-2xl flex items-center justify-center transition-all active:scale-90 border-t-2 border-x border-slate-600 ${
                    isUpActive
                      ? 'bg-[#f0f000] text-slate-950 shadow-[0_0_20px_#f0f000]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <ArrowUp className="w-7 h-7 stroke-[3]" />
                </button>

                {/* DOWN */}
                <button
                  type="button"
                  onPointerDown={() => triggerDirection('DOWN')}
                  className={`absolute bottom-0 left-13 w-14 h-16 rounded-b-2xl flex items-center justify-center transition-all active:scale-90 border-b-2 border-x border-slate-600 ${
                    isDownActive
                      ? 'bg-[#f0f000] text-slate-950 shadow-[0_0_20px_#f0f000]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <ArrowDown className="w-7 h-7 stroke-[3]" />
                </button>

                {/* LEFT */}
                <button
                  type="button"
                  onPointerDown={() => triggerDirection('LEFT')}
                  className={`absolute top-13 left-0 w-16 h-14 rounded-l-2xl flex items-center justify-center transition-all active:scale-90 border-l-2 border-y border-slate-600 ${
                    isLeftActive
                      ? 'bg-[#f0f000] text-slate-950 shadow-[0_0_20px_#f0f000]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <ArrowLeft className="w-7 h-7 stroke-[3]" />
                </button>

                {/* RIGHT */}
                <button
                  type="button"
                  onPointerDown={() => triggerDirection('RIGHT')}
                  className={`absolute top-13 right-0 w-16 h-14 rounded-r-2xl flex items-center justify-center transition-all active:scale-90 border-r-2 border-y border-slate-600 ${
                    isRightActive
                      ? 'bg-[#f0f000] text-slate-950 shadow-[0_0_20px_#f0f000]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <ArrowRight className="w-7 h-7 stroke-[3]" />
                </button>

                {/* Center Pivot Cap */}
                <div className="absolute top-13 left-13 w-14 h-14 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center shadow-md">
                  <div className="w-5 h-5 bg-slate-950 rounded-full border border-slate-700" />
                </div>
              </div>
            </div>
          ) : (
            /* 360° Balltop Arcade Joystick */
            <div
              ref={joystickBaseRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative w-48 h-48 bg-[#080812] rounded-full border-2 border-slate-800 flex items-center justify-center shadow-inner cursor-grab active:cursor-grabbing touch-none"
            >
              {/* Direction Ring Markers */}
              <div className="absolute inset-3 rounded-full border border-dashed border-slate-800 pointer-events-none" />
              <ArrowUp className="absolute top-3 w-5 h-5 text-slate-600 pointer-events-none" />
              <ArrowDown className="absolute bottom-3 w-5 h-5 text-slate-600 pointer-events-none" />
              <ArrowLeft className="absolute left-3 w-5 h-5 text-slate-600 pointer-events-none" />
              <ArrowRight className="absolute right-3 w-5 h-5 text-slate-600 pointer-events-none" />

              {/* Joystick Balltop Handle */}
              <div
                className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-900 border-2 border-red-300 shadow-[0_12px_24px_rgba(0,0,0,0.8)] flex items-center justify-center transition-transform duration-75"
                style={{
                  transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                }}
              >
                <div className="w-8 h-8 rounded-full bg-red-400/40 blur-[1px]" />
              </div>
            </div>
          )}
        </div>

        {/* Right Control: Standard A, B, X, Y Action Button Diamond */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative w-48 h-48 bg-[#080812] rounded-full border-2 border-slate-800 flex items-center justify-center p-3 shadow-inner">
            {/* BUTTON Y (Top - Yellow) */}
            <button
              type="button"
              onPointerDown={() => onButtonPress('Y')}
              className={`absolute top-2 w-13 h-13 rounded-full border-2 font-black text-lg flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                activeButtons.has('Y')
                  ? 'bg-amber-400 border-amber-200 text-slate-950 shadow-[0_0_20px_#f59e0b]'
                  : 'bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-300 text-slate-950 hover:brightness-110'
              }`}
            >
              Y
            </button>

            {/* BUTTON X (Left - Blue) */}
            <button
              type="button"
              onPointerDown={() => onButtonPress('X')}
              className={`absolute left-2 w-13 h-13 rounded-full border-2 font-black text-lg flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                activeButtons.has('X')
                  ? 'bg-blue-400 border-blue-200 text-slate-950 shadow-[0_0_20px_#3b82f6]'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-300 text-slate-950 hover:brightness-110'
              }`}
            >
              X
            </button>

            {/* BUTTON B (Right - Red) */}
            <button
              type="button"
              onPointerDown={() => onButtonPress('B')}
              className={`absolute right-2 w-13 h-13 rounded-full border-2 font-black text-lg flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                activeButtons.has('B')
                  ? 'bg-red-400 border-red-200 text-slate-950 shadow-[0_0_20px_#ef4444]'
                  : 'bg-gradient-to-br from-red-500 to-rose-600 border-red-300 text-slate-950 hover:brightness-110'
              }`}
            >
              B
            </button>

            {/* BUTTON A (Bottom - Green) */}
            <button
              type="button"
              onPointerDown={() => onButtonPress('A')}
              className={`absolute bottom-2 w-13 h-13 rounded-full border-2 font-black text-lg flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                activeButtons.has('A')
                  ? 'bg-emerald-400 border-emerald-200 text-slate-950 shadow-[0_0_20px_#10b981]'
                  : 'bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-300 text-slate-950 hover:brightness-110'
              }`}
            >
              A
            </button>

            <div className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">ACTION</div>
          </div>
        </div>
      </div>

      {/* Center Utility Buttons (SELECT, HOME, START) */}
      <div className="mt-6 pt-4 border-t border-[#252548] flex items-center justify-around bg-[#080812] p-3 rounded-2xl border border-slate-800">
        {/* SELECT */}
        <button
          type="button"
          onPointerDown={() => onButtonPress('SELECT')}
          className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${
            activeButtons.has('SELECT') ? 'text-[#f0f000]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="w-12 h-5 bg-slate-800 border border-slate-600 rounded-md shadow-sm" />
          <span className="text-[10px] font-bold tracking-wider">SELECT</span>
        </button>

        {/* HOME / PAUSE */}
        <button
          type="button"
          onPointerDown={() => onButtonPress('HOME')}
          className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${
            activeButtons.has('HOME') ? 'text-[#f0f000]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shadow-sm">
            <Power className="w-4 h-4 text-[#f0f000]" />
          </div>
          <span className="text-[10px] font-bold tracking-wider">HOME</span>
        </button>

        {/* START */}
        <button
          type="button"
          onPointerDown={() => onButtonPress('START')}
          className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${
            activeButtons.has('START') ? 'text-[#f0f000]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="w-12 h-5 bg-slate-800 border border-slate-600 rounded-md shadow-sm" />
          <span className="text-[10px] font-bold tracking-wider">START</span>
        </button>
      </div>

      {/* Keyboard Shortcuts Bar */}
      <div className="mt-4 text-center text-slate-500 text-xs">
        <span className="mr-3">🎮 Setas / WASD = Direcional</span>
        <span className="mr-3">A = Tecla Z / Espaço</span>
        <span className="mr-3">B = Tecla X</span>
        <span>X/Y = C / V</span>
      </div>
    </div>
  );
};
export { ArcadeController as default };
