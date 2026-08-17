export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';

export type CellType =
  | 'WALL'
  | 'DOT'
  | 'POWER_PELLET'
  | 'EMPTY'
  | 'GHOST_HOUSE'
  | 'GHOST_DOOR'
  | 'TUNNEL';

export type GhostType = 'blinky' | 'pinky' | 'inky' | 'clyde';

export type GhostMode = 'chase' | 'scatter' | 'frightened' | 'eaten' | 'house';

export type GameState =
  | 'IDLE'
  | 'READY'
  | 'PLAYING'
  | 'PAUSED'
  | 'PACMAN_DEATH'
  | 'LEVEL_CLEARED'
  | 'VICTORY'
  | 'GAME_OVER';

export interface Position {
  x: number;
  y: number;
}

export interface GridPos {
  row: number;
  col: number;
}

export interface PacmanState {
  x: number;
  y: number;
  dir: Direction;
  nextDir: Direction;
  speed: number;
  mouthAngle: number;
  mouthOpening: boolean;
  isDead: boolean;
  deathFrame: number;
}

export interface GhostState {
  id: GhostType;
  name: string;
  color: string;
  x: number;
  y: number;
  dir: Direction;
  nextDir: Direction;
  mode: GhostMode;
  speed: number;
  scatterTarget: Position;
  houseTimer: number; // delay before leaving ghost house
  frightenedFlash: boolean;
  lastTileKey?: string;
}

export interface FruitItem {
  type: string;
  points: number;
  color: string;
  symbol: string;
  gridPos: GridPos;
  active: boolean;
  timer: number;
}

export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  text: string;
  opacity: number;
  timer: number;
}

export interface HighScore {
  id: string;
  name: string;
  score: number;
  level: number;
  date: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  crtEffect: boolean;
  speedMultiplier: number;
  touchControlsVisible: boolean;
}

export type ControllerTheme = 'classic' | 'cyberpunk' | 'gameboy' | 'red_ghost' | 'midnight';

export type ControllerLayout = 'dpad' | 'joystick' | 'swipe';

export type RemoteInputAction =
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT'
  | 'START'
  | 'PAUSE'
  | 'RESET'
  | 'TURBO_ON'
  | 'TURBO_OFF';

export interface ControllerConfig {
  theme: ControllerTheme;
  layout: ControllerLayout;
  vibration: boolean;
  sound: boolean;
}

export interface RemoteGameStatePayload {
  score: number;
  highScore: number;
  lives: number;
  level: number;
  gameState: GameState;
  pacmanDir: Direction;
}

