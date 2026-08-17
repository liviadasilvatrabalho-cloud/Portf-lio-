import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Settings, Volume2, VolumeX, Gamepad2, Smartphone, Wifi, WifiOff, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { usePacmanGame } from '../hooks/usePacmanGame';
import { useRemoteControl } from '../hooks/useRemoteControl';
import { GameSettings, Direction } from '../types';
import { soundEngine } from '../utils/audio';
import { isNewHighScore } from '../utils/highScores';
import { HighScoresModal } from './HighScoresModal';
import { PacmanCanvas } from './PacmanCanvas';
import { ScoreBoard } from './ScoreBoard';
import { SettingsModal } from './SettingsModal';
import { TouchControls } from './TouchControls';

interface ArcadeCabinetProps {
  embedded?: boolean;
  onBack?: () => void;
}

export const ArcadeCabinet: React.FC<ArcadeCabinetProps> = ({ embedded = false, onBack }) => {
  const {
    tiles,
    dotsMap,
    powerPelletsMap,
    score,
    highScore,
    lives,
    level,
    gameState,
    setGameState,
    pacman,
    ghosts,
    fruit,
    scorePopups,
    startGame,
    changeDirection,
  } = usePacmanGame();

  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    crtEffect: true,
    speedMultiplier: 1,
    touchControlsVisible: true,
  });

  const [isHighScoresOpen, setIsHighScoresOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hostOrigin, setHostOrigin] = useState(window.location.origin);

  // Detect PC's LAN IP so the phone QR code points to the right address
  useEffect(() => {
    const loc = window.location;
    const isLocal = loc.hostname === 'localhost' || loc.hostname === '127.0.0.1';
    if (!isLocal) return; // Production (Vercel) — origin is already correct

    const detectIP = async () => {
      try {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel('');
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(resolve, 2000);
          pc.onicecandidate = (e) => {
            if (e.candidate) {
              const match = e.candidate.candidate.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
              if (match && !match[1].startsWith('127.')) {
                setHostOrigin(`http://${match[1]}:5173`);
                clearTimeout(timeout);
                resolve();
              }
            }
          };
        });
        pc.close();
      } catch {
        // fallback to localhost
      }
    };
    detectIP();
  }, []);

  // Stable ref for remote input handler (avoids stale closures)
  const handleRemoteInputRef = useRef<(action: string) => void>(() => {});

  const handleRemoteInput = useCallback((action: string) => {
    if (action === 'START') {
      if (gameState === 'IDLE' || gameState === 'GAME_OVER' || gameState === 'VICTORY') {
        startGame();
      }
      return;
    }
    if (action === 'PAUSE') {
      if (gameState === 'PLAYING') setGameState('PAUSED');
      else if (gameState === 'PAUSED') setGameState('PLAYING');
      return;
    }
    if (action === 'RESET') {
      startGame();
      return;
    }
    if (gameState === 'PLAYING' && ['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(action)) {
      changeDirection(action as Direction);
    }
  }, [gameState, changeDirection, startGame, setGameState]);

  handleRemoteInputRef.current = handleRemoteInput;

  const onRemoteInput = useCallback((action: string) => {
    handleRemoteInputRef.current(action);
  }, []);

  const {
    roomId,
    isConnected,
    controllerConnected,
    controllerCount,
    sendGameState,
  } = useRemoteControl({
    role: 'GAME',
    onInputReceived: onRemoteInput,
  });

  // QR code URL: local IP for dev, origin for production
  const controllerUrl = `${hostOrigin}/?controle=true&room=${roomId}`;

  // Game state status for display
  const gameStatus = gameState === 'PLAYING' ? 'CONTROLE ATIVO' : gameState === 'IDLE' ? 'APERTE ENTER PARA START' : gameState === 'GAME_OVER' ? 'FIM DE JOGO' : gameState;

  // Broadcast game state to controller — throttled to avoid flooding WebSocket
  const lastBroadcastRef = useRef(0);
  useEffect(() => {
    const now = Date.now();
    if (now - lastBroadcastRef.current < 200) return; // max 5x/sec
    lastBroadcastRef.current = now;
    sendGameState({
      score,
      highScore,
      lives,
      level,
      gameState,
      pacmanDir: pacman.dir,
    });
  }, [score, highScore, lives, level, gameState, pacman.dir, sendGameState]);

  // Detect touch screens
  useEffect(() => {
    const checkTouch = () => {
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth < 768;
      setIsTouchDevice(hasTouch);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Sync sound engine setting
  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.soundEnabled !== undefined) {
        soundEngine.setSoundEnabled(newSettings.soundEnabled);
      }
      return updated;
    });
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault();
      }

      if (gameState === 'IDLE' || gameState === 'GAME_OVER') {
        if (e.code === 'Space' || e.code === 'Enter') {
          startGame();
          return;
        }
      }

      if (gameState === 'PLAYING') {
        if (e.code === 'KeyP' || e.code === 'Escape') {
          setGameState('PAUSED');
          return;
        }
        switch (e.code) {
          case 'ArrowUp': case 'KeyW': changeDirection('UP'); break;
          case 'ArrowDown': case 'KeyS': changeDirection('DOWN'); break;
          case 'ArrowLeft': case 'KeyA': changeDirection('LEFT'); break;
          case 'ArrowRight': case 'KeyD': changeDirection('RIGHT'); break;
        }
      } else if (gameState === 'PAUSED') {
        if (e.code === 'KeyP' || e.code === 'Space' || e.code === 'Escape') {
          setGameState('PLAYING');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, changeDirection, startGame, setGameState]);

  // Check high score on game over
  useEffect(() => {
    if (gameState === 'GAME_OVER' && isNewHighScore(score)) {
      setIsHighScoresOpen(true);
    }
  }, [gameState, score]);

  // QR Code Panel (desktop/tablet side panel)
  const qrPanel = (
    <div className="hidden lg:flex flex-col items-center gap-3 w-56 shrink-0">
      <div className="w-full rounded-2xl border-2 border-yellow-400/60 bg-slate-900/90 p-4 shadow-xl shadow-yellow-500/10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs font-bold">
          <QrCode className="w-4 h-4" />
          <span>CONTROLE NA TELA</span>
        </div>

        {/* QR Code */}
        <div className="relative p-3 rounded-xl bg-white border-2 border-yellow-400 shadow-lg shadow-yellow-500/20">
          <QRCodeSVG
            value={controllerUrl}
            size={160}
            level="H"
            includeMargin={false}
          />
          {controllerConnected && (
            <div className="absolute inset-0 bg-slate-950/85 rounded-lg flex flex-col items-center justify-center">
              <Smartphone className="w-8 h-8 text-emerald-400 animate-bounce mb-1" />
              <span className="font-mono text-[10px] font-bold text-emerald-300">CONECTADO!</span>
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] font-bold border ${
          controllerConnected
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
            : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
        }`}>
          {controllerConnected ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>{controllerCount} CELULAR(ES)</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span>AGUARDANDO...</span>
            </>
          )}
        </div>

        {/* Room Code */}
        <div className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px]">
          <span className="text-slate-400">SALA:</span>
          <strong className="text-yellow-400 tracking-wider">{roomId}</strong>
        </div>

        {/* Steps */}
        <div className="w-full grid grid-cols-3 gap-1.5 text-center font-mono text-[8px]">
          <div className="p-1.5 rounded-lg bg-slate-950/50 border border-slate-800">
            <span className="text-yellow-400 font-bold block text-[10px]">1</span>
            <span className="text-slate-300">Escaneie QR</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-950/50 border border-slate-800">
            <span className="text-yellow-400 font-bold block text-[10px]">2</span>
            <span className="text-slate-300">Clique Link</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-950/50 border border-slate-800">
            <span className="text-yellow-400 font-bold block text-[10px]">3</span>
            <span className="text-slate-300">Jogue!</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col items-center justify-center bg-slate-950 p-2 sm:p-6 text-white selection:bg-yellow-400 selection:text-slate-950 ${embedded ? 'rounded-3xl' : 'min-h-screen'}`}>
      {/* HEADER */}
      <header className="mb-4 text-center w-full max-w-4xl">
        <div className="inline-flex items-center space-x-2 rounded-2xl border-2 border-yellow-400/80 bg-slate-900/90 px-6 py-2 shadow-xl shadow-yellow-500/20">
          <Gamepad2 className="w-7 h-7 text-yellow-400 animate-pulse" />
          <h1 className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]">
            PAC-MAN CLÁSSICO
          </h1>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Arcade
          </button>
        )}
      </header>

      {/* MAIN: GAME + QR SIDE PANEL */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-4 w-full max-w-4xl">
        {/* GAME */}
        <main className="relative flex flex-col items-center w-full lg:flex-1 min-w-0 rounded-3xl border-4 border-indigo-900 bg-slate-900/90 p-3 sm:p-5 shadow-[0_0_50px_rgba(49,46,129,0.5)] backdrop-blur-md">
          <ScoreBoard score={score} highScore={highScore} lives={lives} level={level} />

          <PacmanCanvas
            tiles={tiles}
            dotsMap={dotsMap}
            powerPelletsMap={powerPelletsMap}
            pacman={pacman}
            ghosts={ghosts}
            fruit={fruit}
            scorePopups={scorePopups}
            gameState={gameState}
            crtEffect={settings.crtEffect}
            level={level}
            score={score}
            onDirectionChange={changeDirection}
          />

          {/* CONTROL BUTTONS */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 w-full max-w-md">
            {gameState === 'IDLE' || gameState === 'GAME_OVER' || gameState === 'VICTORY' ? (
              <button type="button" onClick={startGame} className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-yellow-400 px-5 py-3 font-mono font-black text-slate-950 shadow-lg shadow-yellow-500/30 hover:bg-yellow-300 active:scale-95 transition-all cursor-pointer">
                <Play className="w-5 h-5 fill-current" />
                <span>{gameState === 'VICTORY' ? 'JOGAR NOVAMENTE' : 'INICIAR JOGO'}</span>
              </button>
            ) : gameState === 'PLAYING' ? (
              <button type="button" onClick={() => setGameState('PAUSED')} className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-5 py-3 font-mono font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 transition-all cursor-pointer">
                <Pause className="w-5 h-5" />
                <span>PAUSAR</span>
              </button>
            ) : (
              <button type="button" onClick={() => setGameState('PLAYING')} className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-emerald-500 px-5 py-3 font-mono font-bold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 active:scale-95 transition-all cursor-pointer">
                <Play className="w-5 h-5 fill-current" />
                <span>CONTINUAR</span>
              </button>
            )}

            <button type="button" onClick={startGame} title="Reiniciar Jogo" className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => setIsHighScoresOpen(true)} title="Recordes" className="flex items-center justify-center rounded-xl border border-yellow-500/50 bg-slate-800 p-3 text-yellow-400 hover:bg-slate-700 hover:text-yellow-300 transition-all cursor-pointer">
              <Trophy className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => setIsSettingsOpen(true)} title="Configurações" className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer">
              <Settings className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })} title="Alternar Áudio" className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-yellow-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            </button>
          </div>

          {/* TOUCH CONTROLS */}
          {settings.touchControlsVisible && isTouchDevice && (
            <TouchControls onDirectionChange={changeDirection} className="md:hidden" />
          )}
        </main>

        {/* QR CODE SIDE PANEL */}
        {qrPanel}
      </div>

      {/* FOOTER */}
      <footer className="mt-4 text-center font-mono text-xs text-slate-500 max-w-4xl px-2">
        <p>
          Controles: <span className="text-yellow-400 font-bold">Setas / WASD</span> no teclado
          {' · '}
          <span className="text-yellow-400 font-bold">Celular</span> escaneie o QR (PC e celular na mesma Wi-Fi)
        </p>
      </footer>

      {/* MODALS */}
      <HighScoresModal isOpen={isHighScoresOpen} onClose={() => setIsHighScoresOpen(false)} currentScore={score} currentLevel={level} isNewHigh={isNewHighScore(score)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onUpdateSettings={updateSettings} />
    </div>
  );
};
