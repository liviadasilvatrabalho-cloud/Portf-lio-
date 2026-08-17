export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';

export type ControllerMode = 'handheld' | 'arcade' | 'overlay' | 'split';

export type ControlInputType = 'dpad' | 'joystick' | 'buttons';

export interface Position {
  x: number;
  y: number;
}

export interface GridPosition {
  tileX: number;
  tileY: number;
}

export type GhostType = 'blinky' | 'pinky' | 'inky' | 'clyde';

export type GhostMode = 'chase' | 'scatter' | 'frightened' | 'eaten';

export interface Ghost {
  id: GhostType;
  name: string;
  color: string;
  frightenedColor: string;
  x: number;
  y: number;
  dir: Direction;
  nextDir: Direction;
  speed: number;
  mode: GhostMode;
  target: Position;
  homeTile: GridPosition;
  scatterTile: GridPosition;
  spawnTime: number;
}

export interface PacmanState {
  x: number;
  y: number;
  dir: Direction;
  nextDir: Direction;
  mouthAngle: number;
  mouthSpeed: number;
  boostActive: boolean;
  boostCooldown: number;
  freezeActive: boolean;
  freezeCharge: number; // 0 to 100
}

export interface HighScore {
  name: string;
  score: number;
  date: string;
  level: number;
}

export interface KeyBindings {
  up: string;
  down: string;
  left: string;
  right: string;
  boost: string;
  freeze: string;
  pause: string;
}

export interface GameStats {
  dotsEaten: number;
  ghostsEaten: number;
  powerPelletsEaten: number;
  fruitsEaten: number;
  highScore: number;
  gamesPlayed: number;
}

export type FruitType = 'cherry' | 'strawberry' | 'orange' | 'apple' | 'melon';

export interface FruitItem {
  type: FruitType;
  points: number;
  symbol: string;
  color: string;
  x: number;
  y: number;
  active: boolean;
  timer: number;
}
