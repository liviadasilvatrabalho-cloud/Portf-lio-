import React, { useEffect, useRef } from 'react';
import { Direction, FruitItem, Ghost, PacmanState } from '../types';
import {
  MAZE_COLS,
  MAZE_ROWS,
  TILE_DOT,
  TILE_GHOST_GATE,
  TILE_PELLET,
  TILE_SIZE,
  TILE_WALL,
} from '../utils/maze';

interface PacmanCanvasProps {
  maze: number[][];
  pacman: PacmanState;
  ghosts: Ghost[];
  fruit: FruitItem | null;
  score: number;
  lives: number;
  level: number;
  gameOver: boolean;
  gameWon: boolean;
  paused: boolean;
  readyCountdown: number;
  floatingTexts: { id: string; text: string; x: number; y: number; opacity: number; color: string }[];
}

export const PacmanCanvas: React.FC<PacmanCanvasProps> = ({
  maze,
  pacman,
  ghosts,
  fruit,
  score,
  lives,
  level,
  gameOver,
  gameWon,
  paused,
  readyCountdown,
  floatingTexts,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvasWidth = MAZE_COLS * TILE_SIZE; // 19 * 16 = 304
  const canvasHeight = MAZE_ROWS * TILE_SIZE; // 22 * 16 = 352

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 1. Draw Maze Walls and Dots
    for (let r = 0; r < MAZE_ROWS; r++) {
      for (let c = 0; c < MAZE_COLS; c++) {
        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;
        const tile = maze[r]?.[c] ?? TILE_WALL;

        if (tile === TILE_WALL) {
          ctx.fillStyle = '#1e3a8a'; // Deep blue wall base
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

          ctx.strokeStyle = '#3b82f6'; // Bright blue neon line border
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        } else if (tile === TILE_GHOST_GATE) {
          ctx.fillStyle = '#f472b6'; // Pink ghost house gate
          ctx.fillRect(x, y + TILE_SIZE / 2 - 2, TILE_SIZE, 4);
        } else if (tile === TILE_DOT) {
          ctx.fillStyle = '#ffedd5'; // Soft cream dot
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (tile === TILE_PELLET) {
          ctx.fillStyle = '#fbbf24'; // Golden power pellet with pulsing glow
          const time = Date.now() / 200;
          const radius = 5 + Math.sin(time) * 1.5;
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 2. Draw Fruit if Active
    if (fruit && fruit.active) {
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(fruit.symbol, fruit.x, fruit.y);
    }

    // 3. Draw Pac-Man
    ctx.save();
    ctx.translate(pacman.x, pacman.y);

    // Speed boost aura
    if (pacman.boostActive) {
      ctx.beginPath();
      ctx.arc(0, 0, TILE_SIZE / 2 + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.fill();
    }

    // Freeze skill aura
    if (pacman.freezeActive) {
      ctx.beginPath();
      ctx.arc(0, 0, TILE_SIZE / 2 + 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.fill();
    }

    // Rotation angle based on direction
    let rotation = 0;
    if (pacman.dir === 'RIGHT') rotation = 0;
    if (pacman.dir === 'DOWN') rotation = Math.PI / 2;
    if (pacman.dir === 'LEFT') rotation = Math.PI;
    if (pacman.dir === 'UP') rotation = -Math.PI / 2;

    ctx.rotate(rotation);

    // Mouth animation
    const mouth = pacman.mouthAngle;
    const startAngle = mouth;
    const endAngle = Math.PI * 2 - mouth;

    ctx.fillStyle = '#facc15'; // Classic Pacman Yellow
    ctx.beginPath();
    ctx.arc(0, 0, TILE_SIZE / 2 - 1, startAngle, endAngle);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // 4. Draw Ghosts
    ghosts.forEach((ghost) => {
      ctx.save();
      ctx.translate(ghost.x, ghost.y);

      if (ghost.mode === 'eaten') {
        // Draw Eyes only
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-3, -2, 3, 0, Math.PI * 2);
        ctx.arc(3, -2, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(-3, -2, 1.5, 0, Math.PI * 2);
        ctx.arc(3, -2, 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Ghost Body Color
        let bodyColor = ghost.color;
        if (ghost.mode === 'frightened') {
          bodyColor = ghost.frightenedColor;
        }

        // Draw Ghost Head Dome & Skirt
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(0, -2, TILE_SIZE / 2 - 1, Math.PI, 0, false);
        ctx.lineTo(TILE_SIZE / 2 - 1, TILE_SIZE / 2 - 2);

        // Wavy skirt
        const width = TILE_SIZE - 2;
        const skirtWidth = width / 3;
        for (let i = 0; i < 3; i++) {
          const waveX = TILE_SIZE / 2 - 1 - (i + 1) * skirtWidth;
          const waveY = i % 2 === 0 ? TILE_SIZE / 2 + 1 : TILE_SIZE / 2 - 2;
          ctx.lineTo(waveX, waveY);
        }

        ctx.lineTo(-TILE_SIZE / 2 + 1, -2);
        ctx.closePath();
        ctx.fill();

        // Ghost Eyes
        if (ghost.mode === 'frightened') {
          // Scared eyes/mouth
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(-4, -2, 2, 2);
          ctx.fillRect(2, -2, 2, 2);

          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-5, 3);
          ctx.lineTo(-3, 1);
          ctx.lineTo(-1, 3);
          ctx.lineTo(1, 1);
          ctx.lineTo(3, 3);
          ctx.lineTo(5, 1);
          ctx.stroke();
        } else {
          // Normal Eyes facing direction
          let eyeOffsetX = 0;
          let eyeOffsetY = 0;
          if (ghost.dir === 'LEFT') eyeOffsetX = -2;
          if (ghost.dir === 'RIGHT') eyeOffsetX = 2;
          if (ghost.dir === 'UP') eyeOffsetY = -2;
          if (ghost.dir === 'DOWN') eyeOffsetY = 2;

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-3 + eyeOffsetX, -2 + eyeOffsetY, 3, 0, Math.PI * 2);
          ctx.arc(3 + eyeOffsetX, -2 + eyeOffsetY, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(-3 + eyeOffsetX * 1.5, -2 + eyeOffsetY * 1.5, 1.5, 0, Math.PI * 2);
          ctx.arc(3 + eyeOffsetX * 1.5, -2 + eyeOffsetY * 1.5, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    });

    // 5. Draw Floating Combo / Score Texts
    floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = Math.max(0, ft.opacity);
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    // 6. Ready / Paused / Game Over Overlays
    if (readyCountdown > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = '#facc15';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PRONTO!', canvasWidth / 2, canvasHeight / 2 - 10);

      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`START EM ${readyCountdown}`, canvasWidth / 2, canvasHeight / 2 + 25);
    } else if (paused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PAUSADO', canvasWidth / 2, canvasHeight / 2);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Pressione START ou P para continuar', canvasWidth / 2, canvasHeight / 2 + 30);
    } else if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.font = 'bold 26px monospace';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GAME OVER', canvasWidth / 2, canvasHeight / 2 - 20);

      ctx.font = '14px monospace';
      ctx.fillStyle = '#fde047';
      ctx.fillText(`PONTOS: ${score}`, canvasWidth / 2, canvasHeight / 2 + 15);

      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Pressione A ou RESTART para jogar', canvasWidth / 2, canvasHeight / 2 + 45);
    } else if (gameWon) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = '#22c55e';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('NÍVEL CONCLUÍDO!', canvasWidth / 2, canvasHeight / 2 - 20);

      ctx.font = '14px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Avançando para Nível ${level + 1}...`, canvasWidth / 2, canvasHeight / 2 + 15);
    }
  }, [maze, pacman, ghosts, fruit, score, lives, level, gameOver, gameWon, paused, readyCountdown, floatingTexts]);

  return (
    <div className="relative flex justify-center items-center bg-slate-950 p-2 sm:p-3 rounded-2xl shadow-2xl border-4 border-indigo-900/60 max-w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="block rounded-lg shadow-inner max-w-full h-auto cursor-pointer touch-none"
        style={{ aspectRatio: `${canvasWidth}/${canvasHeight}` }}
      />
    </div>
  );
};
