import { CellType, GridPos } from '../types';

export const MAZE_COLS = 28;
export const MAZE_ROWS = 31;

// Classic Pac-Man map representation (28 cols x 31 rows)
// Legend:
// W = Wall
// . = Dot
// O = Power Pellet
// _ = Empty tile
// G = Ghost House inside
// D = Ghost Door
// T = Tunnel
const MAZE_LAYOUT_RAW: string[] = [
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "W............WW............W",
  "W.WWWW.WWWWW.WW.WWWWW.WWWW.W",
  "WOWWWW.WWWWW.WW.WWWWW.WWWWOW",
  "W.WWWW.WWWWW.WW.WWWWW.WWWW.W",
  "W..........................W",
  "W.WWWW.WW.WWWWWWWW.WW.WWWW.W",
  "W.WWWW.WW.WWWWWWWW.WW.WWWW.W",
  "W......WW....WW....WW......W",
  "WWWWWW.WWWWW_WW_WWWWW.WWWWWW",
  "_____W.WWWWW_WW_WWWWW.W_____",
  "_____W.WW____GG____WW.W_____",
  "_____W.WW_WWWDDUWW_WW.W_____",
  "WWWWWW.WW_WGGGGGGW_WW.WWWWWW",
  "T______...WGGGGGGW...______T",
  "WWWWWW.WW_WGGGGGGW_WW.WWWWWW",
  "_____W.WW_WWWWWWWW_WW.W_____",
  "_____W.WW__________WW.W_____",
  "_____W.WW_WWWWWWWW_WW.W_____",
  "WWWWWW.WW_WWWWWWWW_WW.WWWWWW",
  "W............WW............W",
  "W.WWWW.WWWWW.WW.WWWWW.WWWW.W",
  "W.WWWW.WWWWW.WW.WWWWW.WWWW.W",
  "WO..WW.......P........WW..OW",
  "WWW.WW.WW.WWWWWWWW.WW.WW.WWW",
  "WWW.WW.WW.WWWWWWWW.WW.WW.WWW",
  "W......WW....WW....WW......W",
  "W.WWWWWWWWWW.WW.WWWWWWWWWW.W",
  "W.WWWWWWWWWW.WW.WWWWWWWWWW.W",
  "W..........................W",
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];

export interface MazeTile {
  type: CellType;
  hasDot: boolean;
  hasPowerPellet: boolean;
}

export function parseMaze(): {
  tiles: CellType[][];
  dotsMap: boolean[][];
  powerPelletsMap: boolean[][];
  pacmanSpawn: GridPos;
  ghostSpawns: Record<string, GridPos>;
  totalDots: number;
} {
  const tiles: CellType[][] = [];
  const dotsMap: boolean[][] = [];
  const powerPelletsMap: boolean[][] = [];
  let totalDots = 0;

  let pacmanSpawn: GridPos = { row: 23, col: 13.5 };
  const ghostSpawns: Record<string, GridPos> = {
    blinky: { row: 11, col: 13.5 }, // Outside ghost house
    pinky: { row: 14, col: 13.5 },  // Inside ghost house
    inky: { row: 14, col: 11.5 },   // Inside ghost house left
    clyde: { row: 14, col: 15.5 },  // Inside ghost house right
  };

  for (let r = 0; r < MAZE_ROWS; r++) {
    const rowStr = MAZE_LAYOUT_RAW[r];
    tiles[r] = [];
    dotsMap[r] = [];
    powerPelletsMap[r] = [];

    for (let c = 0; c < MAZE_COLS; c++) {
      const char = rowStr[c];
      let type: CellType = 'EMPTY';
      let hasDot = false;
      let hasPellet = false;

      switch (char) {
        case 'W':
          type = 'WALL';
          break;
        case '.':
          type = 'EMPTY';
          hasDot = true;
          totalDots++;
          break;
        case 'O':
          type = 'EMPTY';
          hasPellet = true;
          totalDots++;
          break;
        case 'G':
          type = 'GHOST_HOUSE';
          break;
        case 'D':
          type = 'GHOST_DOOR';
          break;
        case 'T':
          type = 'TUNNEL';
          break;
        case 'P':
          type = 'EMPTY';
          pacmanSpawn = { row: r, col: c };
          break;
        case 'U':
          type = 'GHOST_DOOR';
          break;
        case '_':
        default:
          type = 'EMPTY';
          break;
      }

      tiles[r][c] = type;
      dotsMap[r][c] = hasDot;
      powerPelletsMap[r][c] = hasPellet;
    }
  }

  return {
    tiles,
    dotsMap,
    powerPelletsMap,
    pacmanSpawn,
    ghostSpawns,
    totalDots,
  };
}

export const FRUIT_ITEMS = [
  { name: 'Cherry', points: 100, color: '#ff2d55', symbol: '🍒' },
  { name: 'Strawberry', points: 300, color: '#ff3b30', symbol: '🍓' },
  { name: 'Orange', points: 500, color: '#ff9500', symbol: '🍊' },
  { name: 'Apple', points: 700, color: '#34c759', symbol: '🍎' },
  { name: 'Melon', points: 1000, color: '#30b0c7', symbol: '🍈' },
  { name: 'Galaxian', points: 2000, color: '#af52de', symbol: '🚀' },
  { name: 'Bell', points: 3000, color: '#ffcc00', symbol: '🔔' },
  { name: 'Key', points: 5000, color: '#5856d6', symbol: '🔑' },
];

export function getFruitForLevel(level: number) {
  const index = Math.min(level - 1, FRUIT_ITEMS.length - 1);
  return FRUIT_ITEMS[index];
}
