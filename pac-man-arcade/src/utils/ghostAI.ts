import { CellType, Direction, GhostMode, GhostState, GhostType, Position } from '../types';
import { MAZE_COLS, MAZE_ROWS } from './mazeData';

const SCATTER_TARGETS: Record<GhostType, Position> = {
  blinky: { x: 25, y: -2 }, // Top-Right corner
  pinky: { x: 2, y: -2 },   // Top-Left corner
  inky: { x: 27, y: 32 },   // Bottom-Right corner
  clyde: { x: 0, y: 32 },   // Bottom-Left corner
};

export const GHOST_DOOR_POS: Position = { x: 13.5, y: 11 };
export const GHOST_HOUSE_CENTER: Position = { x: 13.5, y: 14 };

const OPPOSITE_DIR: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
  NONE: 'NONE',
};

const DIR_OFFSETS: Record<Direction, { dx: number; dy: number }> = {
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
  NONE: { dx: 0, dy: 0 },
};

export function getGhostTarget(
  ghost: GhostState,
  pacmanPos: Position,
  pacmanDir: Direction,
  blinkyPos: Position
): Position {
  if (ghost.mode === 'eaten') {
    return GHOST_DOOR_POS;
  }

  if (ghost.mode === 'scatter') {
    return ghost.scatterTarget;
  }

  if (ghost.mode === 'frightened') {
    // Target is random during frightened mode
    return { x: Math.floor(Math.random() * MAZE_COLS), y: Math.floor(Math.random() * MAZE_ROWS) };
  }

  // CHASE MODE
  switch (ghost.id) {
    case 'blinky':
      return { x: pacmanPos.x, y: pacmanPos.y };

    case 'pinky': {
      const offset = DIR_OFFSETS[pacmanDir];
      return {
        x: pacmanPos.x + offset.dx * 4,
        y: pacmanPos.y + offset.dy * 4,
      };
    }

    case 'inky': {
      const offset = DIR_OFFSETS[pacmanDir];
      const pivotX = pacmanPos.x + offset.dx * 2;
      const pivotY = pacmanPos.y + offset.dy * 2;
      const vectorX = pivotX - blinkyPos.x;
      const vectorY = pivotY - blinkyPos.y;
      return {
        x: blinkyPos.x + vectorX * 2,
        y: blinkyPos.y + vectorY * 2,
      };
    }

    case 'clyde': {
      const dx = pacmanPos.x - ghost.x;
      const dy = pacmanPos.y - ghost.y;
      const distSq = dx * dx + dy * dy;
      if (distSq >= 64) { // > 8 tiles distance
        return { x: pacmanPos.x, y: pacmanPos.y };
      } else {
        return ghost.scatterTarget;
      }
    }
  }
}

export function isWall(tiles: CellType[][], x: number, y: number, isGhost = false, ghostMode?: GhostMode): boolean {
  // Tunnel wrapping
  if (x < 0 || x >= MAZE_COLS) {
    return false;
  }

  const row = Math.floor(y);
  const col = Math.floor(x);

  if (row < 0 || row >= MAZE_ROWS) return true;

  const tile = tiles[row][col];
  if (tile === 'WALL') return true;

  if (tile === 'GHOST_DOOR' || tile === 'GHOST_HOUSE') {
    if (isGhost) {
      // Eaten ghosts or ghosts exiting house can pass door & house
      return !(ghostMode === 'eaten' || ghostMode === 'house');
    }
    return true; // Pacman cannot enter ghost door or house
  }

  return false;
}

export function getValidDirections(
  tiles: CellType[][],
  currentPos: Position,
  currentDir: Direction,
  isGhost = true,
  ghostMode?: GhostMode
): Direction[] {
  const validDirs: Direction[] = [];
  const directions: Direction[] = ['UP', 'LEFT', 'DOWN', 'RIGHT'];

  const gridX = Math.round(currentPos.x);
  const gridY = Math.round(currentPos.y);

  directions.forEach(dir => {
    // Ghosts generally cannot turn 180 degrees except mode switch
    if (isGhost && currentDir !== 'NONE' && dir === OPPOSITE_DIR[currentDir] && ghostMode !== 'frightened') {
      return;
    }

    const offset = DIR_OFFSETS[dir];
    const testX = gridX + offset.dx;
    const testY = gridY + offset.dy;

    if (!isWall(tiles, testX, testY, isGhost, ghostMode)) {
      validDirs.push(dir);
    }
  });

  return validDirs;
}

export function chooseNextDirection(
  tiles: CellType[][],
  ghost: GhostState,
  target: Position
): Direction {
  const currentDir = ghost.dir;
  const gridPos = { x: Math.round(ghost.x), y: Math.round(ghost.y) };
  const validDirs = getValidDirections(tiles, gridPos, currentDir, true, ghost.mode);

  if (validDirs.length === 0) {
    // Fallback: allow 180 turn if completely trapped
    const fallbackDirs = getValidDirections(tiles, gridPos, 'NONE', true, ghost.mode);
    if (fallbackDirs.length > 0) return fallbackDirs[0];
    return currentDir;
  }
  if (validDirs.length === 1) return validDirs[0];

  // If frightened, choose random valid direction
  if (ghost.mode === 'frightened') {
    const randomIndex = Math.floor(Math.random() * validDirs.length);
    return validDirs[randomIndex];
  }

  // Find direction that minimizes straight distance to target
  let bestDir = validDirs[0];
  let shortestDistSq = Infinity;

  validDirs.forEach(dir => {
    const offset = DIR_OFFSETS[dir];
    const nextX = gridPos.x + offset.dx;
    const nextY = gridPos.y + offset.dy;

    const dx = nextX - target.x;
    const dy = nextY - target.y;
    const distSq = dx * dx + dy * dy;

    if (distSq < shortestDistSq) {
      shortestDistSq = distSq;
      bestDir = dir;
    }
  });

  return bestDir;
}

export function createInitialGhosts(): GhostState[] {
  return [
    {
      id: 'blinky',
      name: 'Blinky',
      color: '#ff0000',
      x: 13.5,
      y: 11,
      dir: 'LEFT',
      nextDir: 'LEFT',
      mode: 'scatter',
      speed: 0.082,
      scatterTarget: SCATTER_TARGETS.blinky,
      houseTimer: 0,
      frightenedFlash: false,
      lastTileKey: '13,11',
    },
    {
      id: 'pinky',
      name: 'Pinky',
      color: '#ffb8ff',
      x: 13.5,
      y: 14,
      dir: 'UP',
      nextDir: 'UP',
      mode: 'house',
      speed: 0.080,
      scatterTarget: SCATTER_TARGETS.pinky,
      houseTimer: 60, // frames before exit
      frightenedFlash: false,
      lastTileKey: '',
    },
    {
      id: 'inky',
      name: 'Inky',
      color: '#00ffff',
      x: 11.5,
      y: 14,
      dir: 'UP',
      nextDir: 'UP',
      mode: 'house',
      speed: 0.078,
      scatterTarget: SCATTER_TARGETS.inky,
      houseTimer: 180,
      frightenedFlash: false,
      lastTileKey: '',
    },
    {
      id: 'clyde',
      name: 'Clyde',
      color: '#ffb851',
      x: 15.5,
      y: 14,
      dir: 'UP',
      nextDir: 'UP',
      mode: 'house',
      speed: 0.075,
      scatterTarget: SCATTER_TARGETS.clyde,
      houseTimer: 300,
      frightenedFlash: false,
      lastTileKey: '',
    },
  ];
}
