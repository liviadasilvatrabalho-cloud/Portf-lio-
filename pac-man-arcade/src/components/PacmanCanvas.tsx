import React, { useEffect, useRef } from 'react';
import {
  CellType,
  Direction,
  FruitItem,
  GameState,
  GhostState,
  PacmanState,
  ScorePopup,
} from '../types';
import { MAZE_COLS, MAZE_ROWS } from '../utils/mazeData';

interface PacmanCanvasProps {
  tiles: CellType[][];
  dotsMap: boolean[][];
  powerPelletsMap: boolean[][];
  pacman: PacmanState;
  ghosts: GhostState[];
  fruit: FruitItem | null;
  scorePopups: ScorePopup[];
  gameState: GameState;
  crtEffect: boolean;
  level?: number;
  score?: number;
  onDirectionChange: (dir: Direction) => void;
}

const TILE_SIZE = 18; // base cell pixel dimension

export const PacmanCanvas: React.FC<PacmanCanvasProps> = ({
  tiles,
  dotsMap,
  powerPelletsMap,
  pacman,
  ghosts,
  fruit,
  scorePopups,
  gameState,
  crtEffect,
  level = 1,
  score = 0,
  onDirectionChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wallCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Swipe & Tap gesture handling for mobile touch screens
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent default scroll behavior while swiping on maze
    if (e.touches.length === 1) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - touchStartRef.current.x;
    const dy = endY - touchStartRef.current.y;
    const minSwipe = 15;

    if (Math.abs(dx) > minSwipe || Math.abs(dy) > minSwipe) {
      if (Math.abs(dx) > Math.abs(dy)) {
        onDirectionChange(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onDirectionChange(dy > 0 ? 'DOWN' : 'UP');
      }
    } else {
      // Short tap: change direction based on tap position relative to canvas center
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const tapX = endX - rect.left - rect.width / 2;
        const tapY = endY - rect.top - rect.height / 2;
        if (Math.abs(tapX) > Math.abs(tapY)) {
          onDirectionChange(tapX > 0 ? 'RIGHT' : 'LEFT');
        } else {
          onDirectionChange(tapY > 0 ? 'DOWN' : 'UP');
        }
      }
    }
    touchStartRef.current = null;
  };

  // Pre-render static maze walls into offscreen canvas when tiles change
  useEffect(() => {
    const width = MAZE_COLS * TILE_SIZE;
    const height = MAZE_ROWS * TILE_SIZE;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const offscreen = document.createElement('canvas');
    offscreen.width = width * dpr;
    offscreen.height = height * dpr;
    const oCtx = offscreen.getContext('2d');
    if (!oCtx) return;

    oCtx.scale(dpr, dpr);

    // Fill maze background
    oCtx.fillStyle = '#05050c';
    oCtx.fillRect(0, 0, width, height);

    // Draw static walls with glow
    oCtx.strokeStyle = '#2b31a8';
    oCtx.lineWidth = 2.5;
    oCtx.shadowColor = '#4149ff';
    oCtx.shadowBlur = 4;

    for (let r = 0; r < MAZE_ROWS; r++) {
      for (let c = 0; c < MAZE_COLS; c++) {
        const tile = tiles[r]?.[c];
        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;

        if (tile === 'WALL') {
          oCtx.fillStyle = '#111538';
          oCtx.beginPath();
          oCtx.roundRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2, 4);
          oCtx.fill();
          oCtx.stroke();
        } else if (tile === 'GHOST_DOOR') {
          oCtx.strokeStyle = '#ffb8ff';
          oCtx.lineWidth = 3;
          oCtx.beginPath();
          oCtx.moveTo(x, y + TILE_SIZE / 2);
          oCtx.lineTo(x + TILE_SIZE, y + TILE_SIZE / 2);
          oCtx.stroke();
          oCtx.strokeStyle = '#2b31a8';
          oCtx.lineWidth = 2.5;
        }
      }
    }

    wallCanvasRef.current = offscreen;
  }, [tiles]);

  // Main render function triggered on frame / state updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = MAZE_COLS * TILE_SIZE;
    const height = MAZE_ROWS * TILE_SIZE;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const targetWidth = width * dpr;
    const targetHeight = height * dpr;

    // Only re-dimension canvas if DPR or size changes, to avoid resetting context per frame
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. DRAW CACHED WALL MAZE
    if (wallCanvasRef.current) {
      ctx.drawImage(
        wallCanvasRef.current,
        0,
        0,
        wallCanvasRef.current.width,
        wallCanvasRef.current.height,
        0,
        0,
        width,
        height
      );
    } else {
      ctx.fillStyle = '#05050c';
      ctx.fillRect(0, 0, width, height);
    }

    // 2. DRAW DOTS & POWER PELLETS
    const pulse = Math.sin(Date.now() / 150) * 0.3 + 0.7; // pulsating animation

    for (let r = 0; r < MAZE_ROWS; r++) {
      for (let c = 0; c < MAZE_COLS; c++) {
        const x = c * TILE_SIZE + TILE_SIZE / 2;
        const y = r * TILE_SIZE + TILE_SIZE / 2;

        if (dotsMap[r]?.[c]) {
          ctx.fillStyle = '#ffde9e';
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (powerPelletsMap[r]?.[c]) {
          ctx.fillStyle = `rgba(255, 222, 158, ${pulse})`;
          ctx.beginPath();
          ctx.arc(x, y, 6.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 3. DRAW FRUIT IF ACTIVE
    if (fruit && fruit.active) {
      const fx = fruit.gridPos.col * TILE_SIZE + TILE_SIZE / 2;
      const fy = fruit.gridPos.row * TILE_SIZE + TILE_SIZE / 2;

      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(fruit.symbol, fx, fy);
    }

    // 4. DRAW PAC-MAN
    const px = pacman.x * TILE_SIZE + TILE_SIZE / 2;
    const py = pacman.y * TILE_SIZE + TILE_SIZE / 2;
    const pacRadius = TILE_SIZE * 0.75;

    ctx.fillStyle = '#ffff00';

    if (gameState === 'PACMAN_DEATH') {
      // Death animation
      const deathAngle = (pacman.deathFrame / 30) * Math.PI;
      ctx.beginPath();
      ctx.arc(px, py, pacRadius, deathAngle, Math.PI * 2 - deathAngle);
      ctx.lineTo(px, py);
      ctx.fill();
    } else {
      // Normal wedge mouth animation
      let baseRotation = 0;
      switch (pacman.dir) {
        case 'RIGHT': baseRotation = 0; break;
        case 'DOWN': baseRotation = Math.PI / 2; break;
        case 'LEFT': baseRotation = Math.PI; break;
        case 'UP': baseRotation = (3 * Math.PI) / 2; break;
        case 'NONE': baseRotation = Math.PI; break;
      }

      const mouthAngle = pacman.mouthAngle * 0.25 * Math.PI;

      ctx.beginPath();
      ctx.arc(
        px,
        py,
        pacRadius,
        baseRotation + mouthAngle,
        baseRotation + Math.PI * 2 - mouthAngle
      );
      ctx.lineTo(px, py);
      ctx.fill();
    }

    // 5. DRAW GHOSTS
    ghosts.forEach(ghost => {
      const gx = ghost.x * TILE_SIZE + TILE_SIZE / 2;
      const gy = ghost.y * TILE_SIZE + TILE_SIZE / 2;
      const ghostRadius = TILE_SIZE * 0.75;

      if (ghost.mode === 'eaten') {
        // Just eyes returning to house
        drawGhostEyes(ctx, gx, gy, ghost.dir);
        return;
      }

      // Determine body color
      let bodyColor = ghost.color;
      if (ghost.mode === 'frightened') {
        bodyColor = ghost.frightenedFlash ? '#ffffff' : '#1e38ff';
      }

      // Ghost dome head and skirt
      ctx.fillStyle = bodyColor;

      ctx.beginPath();
      ctx.arc(gx, gy - 2, ghostRadius, Math.PI, 0, false);

      // Wavy bottom skirts
      const skirtY = gy + ghostRadius - 2;
      const skirtWidth = (ghostRadius * 2) / 3;
      const timeOffset = (Date.now() / 100) % 2 > 1 ? 2 : 0;

      ctx.lineTo(gx + ghostRadius, skirtY);
      ctx.lineTo(gx + ghostRadius - skirtWidth * 0.5, skirtY - 3 + timeOffset);
      ctx.lineTo(gx + ghostRadius - skirtWidth, skirtY);
      ctx.lineTo(gx - skirtWidth * 0.5, skirtY - 3 + timeOffset);
      ctx.lineTo(gx - ghostRadius + skirtWidth, skirtY);
      ctx.lineTo(gx - ghostRadius + skirtWidth * 0.5, skirtY - 3 + timeOffset);
      ctx.lineTo(gx - ghostRadius, skirtY);

      ctx.closePath();
      ctx.fill();

      // Draw eyes
      if (ghost.mode === 'frightened') {
        // Scared eyes + wavy mouth
        ctx.fillStyle = ghost.frightenedFlash ? '#ff0000' : '#ffeb3b';
        ctx.beginPath();
        ctx.arc(gx - 4, gy - 3, 2, 0, Math.PI * 2);
        ctx.arc(gx + 4, gy - 3, 2, 0, Math.PI * 2);
        ctx.fill();

        // Scared mouth
        ctx.strokeStyle = ghost.frightenedFlash ? '#ff0000' : '#ffeb3b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(gx - 6, gy + 3);
        ctx.lineTo(gx - 3, gy + 1);
        ctx.lineTo(gx, gy + 3);
        ctx.lineTo(gx + 3, gy + 1);
        ctx.lineTo(gx + 6, gy + 3);
        ctx.stroke();
      } else {
        drawGhostEyes(ctx, gx, gy, ghost.dir);
      }
    });

    // Helper to draw eyes facing movement direction
    function drawGhostEyes(
      cCtx: CanvasRenderingContext2D,
      x: number,
      y: number,
      dir: Direction
    ) {
      let eyeDx = 0;
      let eyeDy = 0;
      switch (dir) {
        case 'LEFT': eyeDx = -2; break;
        case 'RIGHT': eyeDx = 2; break;
        case 'UP': eyeDy = -2; break;
        case 'DOWN': eyeDy = 2; break;
      }

      // White eye balls
      cCtx.fillStyle = '#ffffff';
      cCtx.beginPath();
      cCtx.arc(x - 4.5, y - 3, 3.5, 0, Math.PI * 2);
      cCtx.arc(x + 4.5, y - 3, 3.5, 0, Math.PI * 2);
      cCtx.fill();

      // Blue pupils
      cCtx.fillStyle = '#0f172a';
      cCtx.beginPath();
      cCtx.arc(x - 4.5 + eyeDx, y - 3 + eyeDy, 1.8, 0, Math.PI * 2);
      cCtx.arc(x + 4.5 + eyeDx, y - 3 + eyeDy, 1.8, 0, Math.PI * 2);
      cCtx.fill();
    }

    // 6. DRAW SCORE POPUPS
    scorePopups.forEach(popup => {
      const px = popup.x * TILE_SIZE;
      const py = popup.y * TILE_SIZE;
      ctx.fillStyle = `rgba(0, 255, 204, ${popup.opacity})`;
      ctx.font = 'bold 12px "Press Start 2P", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(popup.text, px, py);
    });

    // 7. OVERLAYS (READY!, PAUSED, GAME OVER, LEVEL CLEARED)
    if (gameState === 'READY') {
      ctx.fillStyle = '#ffea00';
      ctx.font = 'bold 18px monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PRONTO!', width / 2, height / 2 + 18);
    } else if (gameState === 'PAUSED') {
      ctx.fillStyle = 'rgba(5, 5, 12, 0.75)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 20px monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PAUSADO', width / 2, height / 2);
    } else if (gameState === 'GAME_OVER') {
      ctx.fillStyle = 'rgba(5, 5, 12, 0.85)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#ff2b2b';
      ctx.font = 'bold 22px monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('FIM DE JOGO', width / 2, height / 2 - 10);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace, sans-serif';
      ctx.fillText('Pressione ESPAÇO ou toque para reiniciar', width / 2, height / 2 + 25);
    } else if (gameState === 'LEVEL_CLEARED' || gameState === 'VICTORY') {
      ctx.fillStyle = 'rgba(5, 5, 20, 0.9)';
      ctx.fillRect(0, 0, width, height);

      // Gold glowing border around victory box
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.strokeRect(30, height / 2 - 80, width - 60, 160);

      // Glowing VICTORY header
      ctx.save();
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 24px monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★ VITÓRIA! ★', width / 2, height / 2 - 45);
      ctx.restore();

      // Subtitle phase
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`FASE ${level} CONCLUÍDA!`, width / 2, height / 2 - 8);

      // Score display
      ctx.fillStyle = '#f8fafc';
      ctx.font = '13px monospace, sans-serif';
      ctx.fillText(`PONTUAÇÃO: ${score}`, width / 2, height / 2 + 22);

      // The game ends after the maze is cleared.
      ctx.fillStyle = '#4ade80';
      ctx.font = '11px monospace, sans-serif';
      ctx.fillText('Toque em jogar novamente para reiniciar', width / 2, height / 2 + 52);
    } else if (gameState === 'IDLE') {
      ctx.fillStyle = 'rgba(5, 5, 12, 0.85)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#ffea00';
      ctx.font = 'bold 22px monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PAC-MAN', width / 2, height / 2 - 30);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '13px monospace, sans-serif';
      ctx.fillText('PRESSIONE INICIAR', width / 2, height / 2 + 20);
    }

    ctx.restore();
  }, [tiles, dotsMap, powerPelletsMap, pacman, ghosts, fruit, scorePopups, gameState, level, score]);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center select-none overflow-hidden rounded-xl border-2 border-indigo-900/60 bg-slate-950 p-1 sm:p-2 shadow-2xl shadow-indigo-950/50 w-full max-w-[504px] aspect-[28/36] touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        style={{
          imageRendering: 'pixelated',
        }}
        className="block cursor-pointer rounded w-full h-full object-contain touch-none"
      />

      {/* Retro CRT Scanline Effect Overlay */}
      {crtEffect && (
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.5),
              rgba(0, 0, 0, 0.5) 1px,
              transparent 1px,
              transparent 3px
            )`,
          }}
        />
      )}
    </div>
  );
};
