import { GridPosition, Direction, Position } from '../types';

// Maze Tile Constants
export const TILE_EMPTY = 0;
export const TILE_WALL = 1;
export const TILE_DOT = 2;
export const TILE_PELLET = 3;
export const TILE_GHOST_GATE = 4;
export const TILE_GHOST_HOUSE = 5;
export const TILE_FRUIT = 6;

export const TILE_SIZE = 16; // Pixels per grid tile

// Classic 19x22 Arcade Style Maze Layout
// 1 = Wall, 2 = Dot, 3 = Power Pellet, 0 = Empty, 4 = Ghost Gate, 5 = Ghost House
export const MAZE_MAP: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,3,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,3,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1],
  [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
  [1,1,1,1,2,1,0,1,1,4,1,1,0,1,2,1,1,1,1],
  [0,0,0,0,2,0,0,1,5,5,5,1,0,0,2,0,0,0,0],
  [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
  [0,0,0,1,2,1,0,0,0,6,0,0,0,1,2,1,0,0,0],
  [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,3,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,3,1],
  [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

export const MAZE_COLS = MAZE_MAP[0].length; // 19
export const MAZE_ROWS = MAZE_MAP.length;    // 22

// Helper to convert pixel position to tile coordinate
export function posToTile(pos: Position): GridPosition {
  return {
    tileX: Math.floor(pos.x / TILE_SIZE),
    tileY: Math.floor(pos.y / TILE_SIZE),
  };
}

// Helper to convert tile coordinate to pixel position (center of tile)
export function tileToPos(tile: GridPosition): Position {
  return {
    x: tile.tileX * TILE_SIZE + TILE_SIZE / 2,
    y: tile.tileY * TILE_SIZE + TILE_SIZE / 2,
  };
}

// Get tile value at coordinates with side warp handling
export function getTileAt(tileX: number, tileY: number, map: number[][]): number {
  if (tileY < 0 || tileY >= MAZE_ROWS) return TILE_WALL;
  // Warp tunnel logic
  if (tileX < 0 || tileX >= MAZE_COLS) return TILE_EMPTY;
  return map[tileY][tileX];
}

// Check if tile is walkable for Pacman
export function canPacmanMoveTo(tileX: number, tileY: number, map: number[][]): boolean {
  const tile = getTileAt(tileX, tileY, map);
  return tile !== TILE_WALL && tile !== TILE_GHOST_GATE && tile !== TILE_GHOST_HOUSE;
}

// Check if tile is walkable for Ghosts
export function canGhostMoveTo(tileX: number, tileY: number, map: number[][], isEaten: boolean): boolean {
  const tile = getTileAt(tileX, tileY, map);
  if (tile === TILE_WALL) return false;
  if (tile === TILE_GHOST_GATE || tile === TILE_GHOST_HOUSE) {
    return isEaten; // Ghosts can enter ghost house only when eaten or spawning
  }
  return true;
}

// Get next tile coordinate given a direction
export function getNextTile(tile: GridPosition, dir: Direction): GridPosition {
  let { tileX, tileY } = tile;
  switch (dir) {
    case 'UP':
      tileY -= 1;
      break;
    case 'DOWN':
      tileY += 1;
      break;
    case 'LEFT':
      tileX -= 1;
      break;
    case 'RIGHT':
      tileX += 1;
      break;
  }
  // Wrap around warp tunnel
  if (tileX < 0) tileX = MAZE_COLS - 1;
  else if (tileX >= MAZE_COLS) tileX = 0;

  return { tileX, tileY };
}

// Get opposite direction
export function getOppositeDir(dir: Direction): Direction {
  switch (dir) {
    case 'UP': return 'DOWN';
    case 'DOWN': return 'UP';
    case 'LEFT': return 'RIGHT';
    case 'RIGHT': return 'LEFT';
    default: return 'NONE';
  }
}

// Calculate Euclidean distance between two positions
export function getDistance(p1: Position, p2: Position): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Count remaining dots & pellets in current maze map
export function countRemainingDots(map: number[][]): { dots: number; pellets: number } {
  let dots = 0;
  let pellets = 0;
  for (let r = 0; r < MAZE_ROWS; r++) {
    for (let c = 0; c < MAZE_COLS; c++) {
      if (map[r][c] === TILE_DOT) dots++;
      if (map[r][c] === TILE_PELLET) pellets++;
    }
  }
  return { dots, pellets };
}
