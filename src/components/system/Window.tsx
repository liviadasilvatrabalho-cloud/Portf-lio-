import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import {
  Minus,
  Square,
  X,
  Maximize2,
  Layers,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';
import { WindowState, AppId } from '../../types';
import { APPS_CONFIG } from '../../data/portfolioData';
import { soundManager } from '../../utils/audio';

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface WindowProps {
  windowState: WindowState;
  openWindows: WindowState[];
  onClose: () => void;
  onCloseApp: (appId: AppId) => void;
  onCloseAll: () => void;
  onCloseOthers: (appId: AppId) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onFocusApp: (appId: AppId) => void;
  onUpdatePosition: (pos: { x: number; y: number }) => void;
  onUpdateSize: (size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

export const MacWindow: React.FC<WindowProps> = ({
  windowState,
  openWindows,
  onClose,
  onCloseApp,
  onCloseAll,
  onCloseOthers,
  onMinimize,
  onMaximize,
  onFocus,
  onFocusApp,
  onUpdatePosition,
  onUpdateSize,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [activeResizeDir, setActiveResizeDir] = useState<ResizeDirection | null>(null);
  const [screenMode, setScreenMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const dragStartRef = useRef({ x: 0, y: 0, winX: 0, winY: 0 });
  const resizeStartRef = useRef({
    x: 0,
    y: 0,
    winX: 0,
    winY: 0,
    winW: 0,
    winH: 0,
    dir: 'se' as ResizeDirection
  });

  const currentAppConfig = APPS_CONFIG.find((a) => a.id === windowState.id);
  const CurrentAppIcon = currentAppConfig?.icon
    ? (LucideIcons as unknown as Record<string, React.FC<{ className?: string }>>)[currentAppConfig.icon] || Layers
    : Layers;

  useEffect(() => {
    const handleScreenResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setScreenMode('mobile');
      } else if (w < 1024) {
        setScreenMode('tablet');
      } else {
        setScreenMode('desktop');
      }
    };
    handleScreenResize();
    window.addEventListener('resize', handleScreenResize);
    return () => window.removeEventListener('resize', handleScreenResize);
  }, []);

  // Keyboard navigation: Escape or Cmd+W to close active window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'w') {
        if (windowState.isOpen && !windowState.isMinimized) {
          e.preventDefault();
          soundManager.playCloseWindow();
          onClose();
        }
      } else if (e.key === 'Escape') {
        if (screenMode === 'mobile' && windowState.isOpen && !windowState.isMinimized) {
          soundManager.playCloseWindow();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [windowState.isOpen, windowState.isMinimized, onClose, screenMode]);

  // Handle Dragging (Desktop & Tablet windowed mode)
  const startDrag = (clientX: number, clientY: number, _target: HTMLElement) => {
    if (screenMode === 'mobile') return;
    if (windowState.isMaximized) return;
    onFocus();
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      winX: windowState.position.x,
      winY: windowState.position.y
    };
  };

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, textarea, select, .no-drag')) return;
    startDrag(e.clientX, e.clientY, e.target as HTMLElement);
  };

  const handleHeaderTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      const target = e.target as HTMLElement;
      if (target.closest('button, input, textarea, select, .no-drag')) return;
      startDrag(t.clientX, t.clientY, target);
    }
  };

  // Handle Resizing (Desktop & Tablet windowed mode)
  const startResize = (clientX: number, clientY: number, dir: ResizeDirection) => {
    if (screenMode === 'mobile') return;
    onFocus();
    if (windowState.isMaximized) return;

    setIsResizing(true);
    setActiveResizeDir(dir);
    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      winX: windowState.position.x,
      winY: windowState.position.y,
      winW: windowState.size.width,
      winH: windowState.size.height,
      dir
    };
  };

  useEffect(() => {
    const processMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        const dx = clientX - dragStartRef.current.x;
        const dy = clientY - dragStartRef.current.y;
        const newX = Math.max(0, Math.min(window.innerWidth - 120, dragStartRef.current.winX + dx));
        const newY = Math.max(32, Math.min(window.innerHeight - 80, dragStartRef.current.winY + dy));
        onUpdatePosition({ x: Math.round(newX), y: Math.round(newY) });
      } else if (isResizing) {
        const { x: startX, y: startY, winX, winY, winW, winH, dir } = resizeStartRef.current;
        const dx = clientX - startX;
        const dy = clientY - startY;

        const minW = 360;
        const minH = 260;
        const maxW = Math.max(minW, window.innerWidth - 16);
        const maxH = Math.max(minH, window.innerHeight - 44);

        let newW = winW;
        let newH = winH;
        let newX = winX;
        let newY = winY;

        // Horizontal sizing
        if (dir.includes('e')) {
          newW = Math.max(minW, Math.min(maxW, winW + dx));
        } else if (dir.includes('w')) {
          const targetW = winW - dx;
          newW = Math.max(minW, Math.min(maxW, targetW));
          newX = Math.max(0, Math.min(window.innerWidth - 100, winX + (winW - newW)));
        }

        // Vertical sizing
        if (dir.includes('s')) {
          newH = Math.max(minH, Math.min(maxH, winH + dy));
        } else if (dir.includes('n')) {
          const targetH = winH - dy;
          newH = Math.max(minH, Math.min(maxH, targetH));
          newY = Math.max(32, Math.min(window.innerHeight - 80, winY + (winH - newH)));
        }

        onUpdateSize({ width: Math.round(newW), height: Math.round(newH) });
        if (newX !== winX || newY !== winY) {
          onUpdatePosition({ x: Math.round(newX), y: Math.round(newY) });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      processMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        processMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      if (isDragging) setIsDragging(false);
      if (isResizing) {
        setIsResizing(false);
        setActiveResizeDir(null);
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, isResizing, onUpdatePosition, onUpdateSize]);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  // Determine window positioning and frame styling based on screen device category
  let containerClasses = '';
  let customStyle: React.CSSProperties = { zIndex: windowState.zIndex };

  if (screenMode === 'mobile') {
    // Smartphone: Full screen app overlay covering entire viewport like a native phone app
    containerClasses =
      'fixed window-frame inset-0 z-50 bg-zinc-950 flex flex-col overflow-hidden select-none w-full h-[100dvh]';
    customStyle = { top: 0, left: 0, width: '100%', height: '100dvh', zIndex: windowState.zIndex };
  } else {
    // Desktop & Tablet: Windowed system with traffic light controls, draggable header and resize
    if (windowState.isMaximized) {
      containerClasses =
        'fixed window-frame inset-0 z-50 bg-zinc-950/98 backdrop-blur-md border-none rounded-none shadow-none flex flex-col overflow-hidden select-none';
      customStyle = {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: windowState.zIndex,
        transform: 'translateZ(0)',
        willChange: 'transform, opacity'
      };
    } else {
      containerClasses =
        'fixed window-frame rounded-2xl bg-zinc-900/95 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col overflow-hidden select-none';
      customStyle = {
        top: Math.max(32, Math.min(windowState.position.y, window.innerHeight - 120)),
        left: Math.max(8, Math.min(windowState.position.x, window.innerWidth - 100)),
        width: Math.min(windowState.size.width, window.innerWidth - 16),
        height: Math.min(windowState.size.height, window.innerHeight - 60),
        zIndex: windowState.zIndex,
        transform: 'translateZ(0)',
        willChange: 'transform, opacity'
      };
    }
  }

  const visibleTabs = openWindows.filter((w) => w.isOpen && !w.isMinimized);

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          scale: screenMode === 'mobile' ? 1 : 0.92,
          y: screenMode === 'mobile' ? 24 : 15
        }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{
          opacity: 0,
          scale: screenMode === 'mobile' ? 1 : 0.88,
          y: screenMode === 'mobile' ? 24 : 15,
          transition: { duration: 0.18 }
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={(e) => {
          e.stopPropagation();
          onFocus();
        }}
        style={customStyle}
        className={containerClasses}
      >
        {/* ================= 1. MOBILE SMARTPHONE HEADER (FULL NATIVE APP LOOK - NO X BUTTON) ================= */}
        {screenMode === 'mobile' && (
          <div className="h-14 px-3.5 bg-zinc-900/98 border-b border-white/10 flex items-center justify-between shrink-0 safe-top">
            {/* Native Mobile Back Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playCloseWindow();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-cyan-500/30 text-cyan-300 active:text-cyan-200 font-bold text-xs active:scale-95 transition"
              title="Voltar à tela inicial"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            {/* App Title and Icon */}
            <div className="flex items-center gap-2 max-w-[200px] truncate">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-tr ${
                  currentAppConfig?.color || 'from-blue-600 to-cyan-500'
                } text-white text-xs shrink-0 shadow`}
              >
                <CurrentAppIcon className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-white truncate">{windowState.title}</span>
            </div>

            {/* Right Spacer for balance (No X button on Mobile) */}
            <div className="w-16 flex justify-end" />
          </div>
        )}

        {/* ================= 2. TABLET HEADER BAR (WITH DEDICATED TABLET BACK BUTTON - NO X BUTTON) ================= */}
        {screenMode === 'tablet' && (
          <div
            onMouseDown={handleHeaderMouseDown}
            onTouchStart={handleHeaderTouchStart}
            onDoubleClick={(e) => {
              if ((e.target as HTMLElement).closest('button, .no-drag')) return;
              soundManager.playClick();
              onMaximize();
            }}
            className="h-11 px-4 bg-zinc-900/95 border-b border-white/10 flex items-center justify-between relative shrink-0 cursor-default"
          >
            {/* Left: Prominent Tablet "Voltar" Back Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playCloseWindow();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-cyan-500/30 text-cyan-300 active:text-cyan-200 font-bold text-xs active:scale-95 transition"
                title="Voltar ao Início"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              {/* Tablet Minimize Control (No X button) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  onMinimize();
                }}
                className="w-4 h-4 rounded-full bg-[#FEBC2E] shadow-inner flex items-center justify-center text-amber-950 font-bold transition hover:brightness-110 active:scale-90"
                title="Minimizar Janela"
              >
                <Minus className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
              </button>
            </div>

            {/* Tablet Center: App Title and Icon */}
            <div className="flex items-center gap-2 max-w-[240px] truncate">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center bg-gradient-to-tr ${
                  currentAppConfig?.color || 'from-blue-600 to-cyan-500'
                } text-white text-[10px] shrink-0`}
              >
                <CurrentAppIcon className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-xs text-white truncate">{windowState.title}</span>
            </div>

            {/* Tablet Right Controls (No X button on Tablet) */}
            <div className="w-16 flex items-center justify-end gap-2">
              {/* Tablet Maximize / Restore Control */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  onMaximize();
                }}
                className="w-4 h-4 rounded-full bg-[#28C840] shadow-inner flex items-center justify-center text-emerald-950 font-bold transition hover:brightness-110 active:scale-90"
                title={windowState.isMaximized ? 'Restaurar Janela' : 'Maximizar Janela'}
              >
                {windowState.isMaximized ? (
                  <Square className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
                ) : (
                  <Maximize2 className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= 3. DESKTOP COMPUTER WINDOW HEADER BAR ================= */}
        {screenMode === 'desktop' && (
          <div
            onMouseDown={handleHeaderMouseDown}
            onTouchStart={handleHeaderTouchStart}
            onDoubleClick={(e) => {
              // Ignore double clicks that occurred on interactive buttons
              if ((e.target as HTMLElement).closest('button, .no-drag')) return;
              soundManager.playClick();
              onMaximize();
            }}
            className="h-10 px-3 bg-black/45 border-b border-white/10 flex items-center justify-between cursor-default relative shrink-0"
          >
            {/* Left Desktop Traffic Light Controls (Close, Minimize, Maximize) */}
            <div className="flex items-center gap-2 group shrink-0">
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playCloseWindow();
                  onClose();
                }}
                className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] shadow-inner flex items-center justify-center text-red-950 font-bold transition hover:brightness-110 active:scale-90"
                title="Fechar Janela"
              >
                <X className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100" />
              </button>

              {/* Minimize Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  onMinimize();
                }}
                className="w-3.5 h-3.5 rounded-full bg-[#FEBC2E] shadow-inner flex items-center justify-center text-amber-950 font-bold transition hover:brightness-110 active:scale-90"
                title="Minimizar Janela"
              >
                <Minus className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100" />
              </button>

              {/* Maximize Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  onMaximize();
                }}
                className="w-3.5 h-3.5 rounded-full bg-[#28C840] shadow-inner flex items-center justify-center text-emerald-950 font-bold transition hover:brightness-110 active:scale-90"
                title="Expandir / Restaurar Janela"
              >
                {windowState.isMaximized ? (
                  <Square className="w-2 h-2 opacity-0 group-hover:opacity-100" />
                ) : (
                  <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100" />
                )}
              </button>
            </div>

            {/* Middle Open Tabs Bar */}
            <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto mx-2 px-1 scrollbar-none">
              {visibleTabs.map((tabWin) => {
                const isCurrent = tabWin.id === windowState.id;
                const appConf = APPS_CONFIG.find((a) => a.id === tabWin.id);
                const IconComponent = appConf?.icon
                  ? (LucideIcons as unknown as Record<string, React.FC<{ className?: string }>>)[appConf.icon] || Layers
                  : Layers;

                return (
                  <div
                    key={tabWin.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFocusApp(tabWin.id as AppId);
                    }}
                    className={`group/tab relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 max-w-[140px] sm:max-w-[170px] min-w-0 ${
                      isCurrent
                        ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 border border-transparent'
                    }`}
                    title={tabWin.title}
                  >
                    <IconComponent className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                    <span className="truncate text-[11px] font-sans min-w-0">{tabWin.title}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playCloseWindow();
                        onCloseApp(tabWin.id as AppId);
                      }}
                      className="ml-1 p-0.5 rounded-md hover:bg-rose-500/30 hover:text-rose-300 text-zinc-400 opacity-60 group-hover/tab:opacity-100 transition shrink-0"
                      title={`Fechar Aba ${tabWin.title}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Right Window Sizing & Options Toolbar (Desktop only) */}
            <div className="flex items-center gap-1.5 shrink-0 relative no-drag ml-auto">
              {/* Quick Restore Button when in Fullscreen mode */}
              {windowState.isMaximized && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playClick();
                    onMaximize();
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 active:bg-cyan-500/30 text-cyan-300 active:text-cyan-200 text-xs font-medium transition active:scale-95 mr-1"
                  title="Sair da tela cheia (Restaurar Janela)"
                >
                  <Square className="w-3 h-3" />
                  <span className="hidden sm:inline">Restaurar</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= SCROLLABLE CONTENT AREA ================= */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-3.5 sm:p-5 md:p-6 pb-10 sm:pb-6 text-zinc-100 font-sans select-text custom-scrollbar">
          {children}
        </div>

        {/* ================= RESIZE HANDLES (DESKTOP & TABLET, NOT MOBILE) ================= */}
        {screenMode !== 'mobile' && !windowState.isMaximized && (
          <>
            {/* Top Edge Handle */}
            <div
              onMouseDown={(e) => { e.stopPropagation(); startResize(e.clientX, e.clientY, 'n'); }}
              onTouchStart={(e) => { e.stopPropagation(); if (e.touches.length === 1) startResize(e.touches[0].clientX, e.touches[0].clientY, 'n'); }}
              className="absolute top-0 left-2 right-2 h-2 cursor-ns-resize z-30 touch-none"
              title="Redimensionar Altura Superior"
            />

            {/* Bottom Edge Handle */}
            <div
              onMouseDown={(e) => { e.stopPropagation(); startResize(e.clientX, e.clientY, 's'); }}
              onTouchStart={(e) => { e.stopPropagation(); if (e.touches.length === 1) startResize(e.touches[0].clientX, e.touches[0].clientY, 's'); }}
              className="absolute bottom-0 left-2 right-2 h-2 cursor-ns-resize z-30 touch-none"
              title="Redimensionar Altura Inferior"
            />

            {/* Left Edge Handle */}
            <div
              onMouseDown={(e) => { e.stopPropagation(); startResize(e.clientX, e.clientY, 'w'); }}
              onTouchStart={(e) => { e.stopPropagation(); if (e.touches.length === 1) startResize(e.touches[0].clientX, e.touches[0].clientY, 'w'); }}
              className="absolute top-2 bottom-2 left-0 w-2 cursor-ew-resize z-30 touch-none"
              title="Redimensionar Largura Esquerda"
            />

            {/* Right Edge Handle */}
            <div
              onMouseDown={(e) => { e.stopPropagation(); startResize(e.clientX, e.clientY, 'e'); }}
              onTouchStart={(e) => { e.stopPropagation(); if (e.touches.length === 1) startResize(e.touches[0].clientX, e.touches[0].clientY, 'e'); }}
              className="absolute top-2 bottom-2 right-0 w-2 cursor-ew-resize z-30 touch-none"
              title="Redimensionar Largura Direita"
            />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export { MacWindow as Window };

