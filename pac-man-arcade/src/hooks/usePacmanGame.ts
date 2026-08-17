import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CellType,
  Direction,
  FruitItem,
  GameState,
  GhostMode,
  GhostState,
  PacmanState,
  ScorePopup,
} from '../types';
import { soundEngine } from '../utils/audio';
import {
  chooseNextDirection,
  createInitialGhosts,
  getGhostTarget,
  GHOST_DOOR_POS,
  isWall,
} from '../utils/ghostAI';
import { getHighScores } from '../utils/highScores';
import { getFruitForLevel, MAZE_COLS, parseMaze } from '../utils/mazeData';

const BASE_PACMAN_SPEED = 0.088;
const FRIGHTENED_DURATION = 360; // ~6 seconds at 60fps

export function usePacmanGame() {
  const mazeInfoRef = useRef(parseMaze());

  const [tiles, setTiles] = useState<CellType[][]>(mazeInfoRef.current.tiles);
  const [dotsMap, setDotsMap] = useState<boolean[][]>(mazeInfoRef.current.dotsMap);
  const [powerPelletsMap, setPowerPelletsMap] = useState<boolean[][]>(mazeInfoRef.current.powerPelletsMap);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const scores = getHighScores();
    return scores.length > 0 ? scores[0].score : 10000;
  });
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [dotsEaten, setDotsEaten] = useState(0);
  const [totalDots, setTotalDots] = useState(mazeInfoRef.current.totalDots);

  const [gameState, setGameStateState] = useState<GameState>('IDLE');

  const initialPacman: PacmanState = {
    x: mazeInfoRef.current.pacmanSpawn.col,
    y: mazeInfoRef.current.pacmanSpawn.row,
    dir: 'NONE',
    nextDir: 'NONE',
    speed: BASE_PACMAN_SPEED,
    mouthAngle: 0.2,
    mouthOpening: true,
    isDead: false,
    deathFrame: 0,
  };

  const [pacman, setPacman] = useState<PacmanState>(initialPacman);
  const [ghosts, setGhosts] = useState<GhostState[]>(createInitialGhosts());
  const [ghostCombo, setGhostCombo] = useState(0);
  const [fruit, setFruit] = useState<FruitItem | null>(null);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);

  // Persistent Refs for 60FPS Game Loop
  const pacmanRef = useRef<PacmanState>(initialPacman);
  const ghostsRef = useRef<GhostState[]>(createInitialGhosts());
  const tilesRef = useRef<CellType[][]>(mazeInfoRef.current.tiles);
  const dotsMapRef = useRef<boolean[][]>(mazeInfoRef.current.dotsMap);
  const powerPelletsMapRef = useRef<boolean[][]>(mazeInfoRef.current.powerPelletsMap);
  const gameStateRef = useRef<GameState>('IDLE');
  const scoreRef = useRef(0);
  const highScoreRef = useRef(highScore);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const fruitRef = useRef<FruitItem | null>(null);
  const scorePopupsRef = useRef<ScorePopup[]>([]);
  const dotsEatenRef = useRef(0);
  const totalDotsRef = useRef(mazeInfoRef.current.totalDots);

  const frightenedTimerRef = useRef(0);
  const globalFrameRef = useRef(0);
  const ghostComboRef = useRef(0);
  const waveTimerRef = useRef(0);
  const waveIndexRef = useRef(0);
  const globalGhostModeRef = useRef<GhostMode>('scatter');

  const WAVE_TIMES = [
    { mode: 'scatter' as GhostMode, duration: 420 },  // 7s
    { mode: 'chase' as GhostMode, duration: 1200 },   // 20s
    { mode: 'scatter' as GhostMode, duration: 420 },  // 7s
    { mode: 'chase' as GhostMode, duration: 1200 },   // 20s
    { mode: 'scatter' as GhostMode, duration: 300 },  // 5s
    { mode: 'chase' as GhostMode, duration: 1200 },   // 20s
    { mode: 'scatter' as GhostMode, duration: 300 },  // 5s
    { mode: 'chase' as GhostMode, duration: Infinity },
  ];

  const isFruitSpawnedRef = useRef<{ first: boolean; second: boolean }>({
    first: false,
    second: false,
  });

  const setGameState = useCallback((state: GameState) => {
    gameStateRef.current = state;
    setGameStateState(state);
  }, []);

  // Helper opposite direction
  const getOppositeDir = (dir: Direction): Direction => {
    switch (dir) {
      case 'UP': return 'DOWN';
      case 'DOWN': return 'UP';
      case 'LEFT': return 'RIGHT';
      case 'RIGHT': return 'LEFT';
      default: return 'NONE';
    }
  };

  // Helper direction offset
  const getDirOffset = (dir: Direction): { dx: number; dy: number } => {
    switch (dir) {
      case 'UP': return { dx: 0, dy: -1 };
      case 'DOWN': return { dx: 0, dy: 1 };
      case 'LEFT': return { dx: -1, dy: 0 };
      case 'RIGHT': return { dx: 1, dy: 0 };
      default: return { dx: 0, dy: 0 };
    }
  };

  // Reset Level Map & Characters
  const resetLevel = useCallback((nextLevel: number, keepScore = true) => {
    const newMaze = parseMaze();
    mazeInfoRef.current = newMaze;

    tilesRef.current = newMaze.tiles;
    dotsMapRef.current = newMaze.dotsMap;
    powerPelletsMapRef.current = newMaze.powerPelletsMap;
    dotsEatenRef.current = 0;
    totalDotsRef.current = newMaze.totalDots;

    setTiles(newMaze.tiles);
    setDotsMap(newMaze.dotsMap);
    setPowerPelletsMap(newMaze.powerPelletsMap);
    setDotsEaten(0);
    setTotalDots(newMaze.totalDots);

    if (!keepScore) {
      scoreRef.current = 0;
      livesRef.current = 3;
      setScore(0);
      setLives(3);
    }

    levelRef.current = nextLevel;
    setLevel(nextLevel);

    fruitRef.current = null;
    setFruit(null);

    ghostComboRef.current = 0;
    setGhostCombo(0);

    waveTimerRef.current = 0;
    waveIndexRef.current = 0;
    globalGhostModeRef.current = 'scatter';

    isFruitSpawnedRef.current = { first: false, second: false };

    const newPacman: PacmanState = {
      x: newMaze.pacmanSpawn.col,
      y: newMaze.pacmanSpawn.row,
      dir: 'NONE',
      nextDir: 'NONE',
      speed: BASE_PACMAN_SPEED + (nextLevel - 1) * 0.005,
      mouthAngle: 0.2,
      mouthOpening: true,
      isDead: false,
      deathFrame: 0,
    };

    const newGhosts = createInitialGhosts();

    pacmanRef.current = newPacman;
    ghostsRef.current = newGhosts;

    setPacman(newPacman);
    setGhosts(newGhosts);

    setGameState('READY');
  }, [setGameState]);

  // Start new game
  const startGame = useCallback(() => {
    resetLevel(1, false);
    soundEngine.playStartMelody();
    setTimeout(() => {
      setGameState('PLAYING');
    }, 2200);
  }, [resetLevel, setGameState]);

  // Handle immediate directional changes
  const changeDirection = useCallback((dir: Direction) => {
    pacmanRef.current.nextDir = dir;
    setPacman(prev => ({ ...prev, nextDir: dir }));
  }, []);

  // Add floating score popup text
  const addScorePopup = useCallback((x: number, y: number, text: string) => {
    const newPopup: ScorePopup = {
      id: Math.random().toString(),
      x,
      y,
      text,
      opacity: 1,
      timer: 45,
    };
    scorePopupsRef.current.push(newPopup);
    setScorePopups([...scorePopupsRef.current]);
  }, []);

  // Handle Eat Ghost
  const handleEatGhost = useCallback((ghostId: string, x: number, y: number) => {
    soundEngine.playEatGhost();

    const points = Math.pow(2, ghostComboRef.current + 1) * 100; // 200, 400, 800, 1600
    scoreRef.current += points;
    if (scoreRef.current > highScoreRef.current) {
      highScoreRef.current = scoreRef.current;
      setHighScore(scoreRef.current);
    }
    setScore(scoreRef.current);

    addScorePopup(x, y, points.toString());
    ghostComboRef.current += 1;
    setGhostCombo(ghostComboRef.current);

    ghostsRef.current = ghostsRef.current.map(g => {
      if (g.id === ghostId) {
        return {
          ...g,
          mode: 'eaten',
          speed: 0.15,
        };
      }
      return g;
    });
    setGhosts([...ghostsRef.current]);
  }, [addScorePopup]);

  // Handle Pacman Death
  const handlePacmanDeath = useCallback(() => {
    setGameState('PACMAN_DEATH');
    soundEngine.playDeathSound();

    let deathFrames = 0;
    const interval = setInterval(() => {
      deathFrames += 2;
      pacmanRef.current.deathFrame = deathFrames;
      setPacman(p => ({ ...p, deathFrame: deathFrames }));

      if (deathFrames >= 30) {
        clearInterval(interval);
        livesRef.current -= 1;
        setLives(livesRef.current);

        if (livesRef.current <= 0) {
          setGameState('GAME_OVER');
        } else {
          const respawnPacman: PacmanState = {
            ...pacmanRef.current,
            x: mazeInfoRef.current.pacmanSpawn.col,
            y: mazeInfoRef.current.pacmanSpawn.row,
            dir: 'NONE',
            nextDir: 'NONE',
            isDead: false,
            deathFrame: 0,
          };
          const respawnGhosts = createInitialGhosts();

          waveTimerRef.current = 0;
          waveIndexRef.current = 0;
          globalGhostModeRef.current = 'scatter';

          pacmanRef.current = respawnPacman;
          ghostsRef.current = respawnGhosts;

          setPacman(respawnPacman);
          setGhosts(respawnGhosts);

          setGameState('READY');
          setTimeout(() => setGameState('PLAYING'), 1500);
        }
      }
    }, 40);
  }, [setGameState]);

  // CONTINUOUS UNINTERRUPTED GAME LOOP
  useEffect(() => {
    let animId: number;

    const gameLoop = () => {
      if (gameStateRef.current === 'PLAYING') {
        globalFrameRef.current++;

        const p = pacmanRef.current;
        const speed = p.speed;

        // 1. TURNING LOGIC FOR PAC-MAN
        if (p.nextDir !== p.dir && p.nextDir !== 'NONE') {
          const isOpposite = p.nextDir === getOppositeDir(p.dir);
          const nextOffset = getDirOffset(p.nextDir);
          const gridX = Math.round(p.x);
          const gridY = Math.round(p.y);

          if (isOpposite || p.dir === 'NONE') {
            const checkCol = gridX + nextOffset.dx;
            const checkRow = gridY + nextOffset.dy;
            if (!isWall(tilesRef.current, checkCol, checkRow, false)) {
              p.dir = p.nextDir;
              if (p.dir === 'LEFT' || p.dir === 'RIGHT') p.y = gridY;
              if (p.dir === 'UP' || p.dir === 'DOWN') p.x = gridX;
            }
          } else {
            const dist = (p.nextDir === 'UP' || p.nextDir === 'DOWN')
              ? Math.abs(p.x - gridX)
              : Math.abs(p.y - gridY);

            if (dist <= 0.35) {
              const targetCol = gridX + nextOffset.dx;
              const targetRow = gridY + nextOffset.dy;

              if (!isWall(tilesRef.current, targetCol, targetRow, false)) {
                p.dir = p.nextDir;
                p.x = gridX;
                p.y = gridY;
              }
            }
          }
        }

        // 2. PAC-MAN MOVEMENT & STRICT WALL BOUNDARY CLAMPING
        if (p.dir !== 'NONE') {
          // Lock perpendicular coordinate to grid line center to prevent drifting/clipping
          if (p.dir === 'LEFT' || p.dir === 'RIGHT') {
            p.y = Math.round(p.y);
          } else if (p.dir === 'UP' || p.dir === 'DOWN') {
            p.x = Math.round(p.x);
          }

          const currCol = Math.round(p.x);
          const currRow = Math.round(p.y);
          const offset = getDirOffset(p.dir);
          const targetCol = currCol + offset.dx;
          const targetRow = currRow + offset.dy;
          const targetIsWall = isWall(tilesRef.current, targetCol, targetRow, false);

          let moved = false;
          if (p.dir === 'RIGHT') {
            if (targetIsWall && p.x + speed >= currCol) {
              p.x = currCol;
            } else {
              p.x += speed;
              moved = true;
            }
          } else if (p.dir === 'LEFT') {
            if (targetIsWall && p.x - speed <= currCol) {
              p.x = currCol;
            } else {
              p.x -= speed;
              moved = true;
            }
          } else if (p.dir === 'DOWN') {
            if (targetIsWall && p.y + speed >= currRow) {
              p.y = currRow;
            } else {
              p.y += speed;
              moved = true;
            }
          } else if (p.dir === 'UP') {
            if (targetIsWall && p.y - speed <= currRow) {
              p.y = currRow;
            } else {
              p.y -= speed;
              moved = true;
            }
          }

          if (moved) {
            if (p.mouthOpening) {
              p.mouthAngle += 0.08;
              if (p.mouthAngle >= 0.4) p.mouthOpening = false;
            } else {
              p.mouthAngle -= 0.08;
              if (p.mouthAngle <= 0.05) p.mouthOpening = true;
            }
          }
        }

        // Tunnel Wrapping
        if (p.x < -0.5) p.x = MAZE_COLS - 0.5;
        if (p.x > MAZE_COLS - 0.5) p.x = -0.5;

        // 3. EAT DOTS & POWER PELLETS
        const tileR = Math.round(p.y);
        const tileC = Math.round(p.x);

        if (dotsMapRef.current[tileR]?.[tileC]) {
          dotsMapRef.current[tileR][tileC] = false;
          soundEngine.playWaka();

          scoreRef.current += 10;
          if (scoreRef.current > highScoreRef.current) {
            highScoreRef.current = scoreRef.current;
            setHighScore(scoreRef.current);
          }
          setScore(scoreRef.current);

          dotsEatenRef.current += 1;
          setDotsEaten(dotsEatenRef.current);
          setDotsMap([...dotsMapRef.current.map(r => [...r])]);

          // Fruit Spawning
          if (dotsEatenRef.current === 70 && !isFruitSpawnedRef.current.first) {
            isFruitSpawnedRef.current.first = true;
            const fInfo = getFruitForLevel(levelRef.current);
            fruitRef.current = {
              type: fInfo.name,
              points: fInfo.points,
              color: fInfo.color,
              symbol: fInfo.symbol,
              gridPos: { row: 17, col: 13.5 },
              active: true,
              timer: 600,
            };
            setFruit({ ...fruitRef.current });
          } else if (dotsEatenRef.current === 170 && !isFruitSpawnedRef.current.second) {
            isFruitSpawnedRef.current.second = true;
            const fInfo = getFruitForLevel(levelRef.current);
            fruitRef.current = {
              type: fInfo.name,
              points: fInfo.points,
              color: fInfo.color,
              symbol: fInfo.symbol,
              gridPos: { row: 17, col: 13.5 },
              active: true,
              timer: 600,
            };
            setFruit({ ...fruitRef.current });
          }

          // Level Cleared / Victory
          if (dotsEatenRef.current >= totalDotsRef.current) {
            setGameState('VICTORY');
            soundEngine.playVictoryFanfare();
          }
        }

        // Power Pellets
        if (powerPelletsMapRef.current[tileR]?.[tileC]) {
          powerPelletsMapRef.current[tileR][tileC] = false;
          soundEngine.playPowerPellet();

          scoreRef.current += 50;
          if (scoreRef.current > highScoreRef.current) {
            highScoreRef.current = scoreRef.current;
            setHighScore(scoreRef.current);
          }
          setScore(scoreRef.current);
          setPowerPelletsMap([...powerPelletsMapRef.current.map(r => [...r])]);

          frightenedTimerRef.current = FRIGHTENED_DURATION;
          ghostComboRef.current = 0;
          setGhostCombo(0);

          ghostsRef.current = ghostsRef.current.map(g => {
            if (g.mode === 'eaten' || g.mode === 'house') return g;
            return {
              ...g,
              mode: 'frightened',
              frightenedFlash: false,
              speed: 0.05,
              dir: getOppositeDir(g.dir),
            };
          });
        }

        // Eat Fruit
        if (fruitRef.current && fruitRef.current.active) {
          if (
            Math.abs(p.x - fruitRef.current.gridPos.col) < 0.8 &&
            Math.abs(p.y - fruitRef.current.gridPos.row) < 0.8
          ) {
            soundEngine.playEatFruit();
            scoreRef.current += fruitRef.current.points;
            if (scoreRef.current > highScoreRef.current) {
              highScoreRef.current = scoreRef.current;
              setHighScore(scoreRef.current);
            }
            setScore(scoreRef.current);
            addScorePopup(
              fruitRef.current.gridPos.col,
              fruitRef.current.gridPos.row,
              fruitRef.current.points.toString()
            );
            fruitRef.current = null;
            setFruit(null);
          } else {
            fruitRef.current.timer -= 1;
            if (fruitRef.current.timer <= 0) {
              fruitRef.current = null;
              setFruit(null);
            }
          }
        }

        // 4. WAVE & FRIGHTENED TIMERS
        if (frightenedTimerRef.current > 0) {
          frightenedTimerRef.current--;
          const timeLeft = frightenedTimerRef.current;

          ghostsRef.current = ghostsRef.current.map(g => {
            if (g.mode === 'frightened') {
              const isFlashing = timeLeft < 120 && Math.floor(timeLeft / 12) % 2 === 0;
              return { ...g, frightenedFlash: isFlashing };
            }
            return g;
          });

          if (timeLeft <= 0) {
            ghostsRef.current = ghostsRef.current.map(g => {
              if (g.mode === 'frightened') {
                return {
                  ...g,
                  mode: globalGhostModeRef.current,
                  frightenedFlash: false,
                  lastTileKey: '',
                };
              }
              return g;
            });
          }
        } else {
          // Scatter / Chase wave cycle
          const currentWave = WAVE_TIMES[waveIndexRef.current] || WAVE_TIMES[WAVE_TIMES.length - 1];
          if (currentWave.duration !== Infinity) {
            waveTimerRef.current++;
            if (waveTimerRef.current >= currentWave.duration) {
              waveIndexRef.current++;
              waveTimerRef.current = 0;
              const nextWave = WAVE_TIMES[waveIndexRef.current] || WAVE_TIMES[WAVE_TIMES.length - 1];
              globalGhostModeRef.current = nextWave.mode;

              // When wave changes, active scatter/chase ghosts reverse direction
              ghostsRef.current = ghostsRef.current.map(g => {
                if (g.mode === 'chase' || g.mode === 'scatter') {
                  return {
                    ...g,
                    mode: nextWave.mode,
                    dir: getOppositeDir(g.dir),
                    lastTileKey: '',
                  };
                }
                return g;
              });
            }
          }
        }

        // 5. GHOSTS AI & PHYSICS
        const blinky = ghostsRef.current.find(g => g.id === 'blinky');
        const blinkyPos = blinky ? { x: blinky.x, y: blinky.y } : { x: 13.5, y: 11 };

        ghostsRef.current = ghostsRef.current.map(ghost => {
          let { x, y, dir, mode, houseTimer, lastTileKey = '' } = ghost;

          // A. HOUSE MODE
          if (mode === 'house') {
            const isFrightenedActive = frightenedTimerRef.current > 0;
            if (houseTimer > 0 || isFrightenedActive) {
              if (houseTimer > 0) houseTimer--;
              y = 14 + Math.sin(globalFrameRef.current / 8) * 0.25;
              return { ...ghost, y, houseTimer };
            } else {
              if (Math.abs(x - GHOST_DOOR_POS.x) > 0.05) {
                x += x < GHOST_DOOR_POS.x ? 0.06 : -0.06;
              } else if (y > GHOST_DOOR_POS.y) {
                x = GHOST_DOOR_POS.x;
                y -= 0.06;
              } else {
                x = GHOST_DOOR_POS.x;
                y = GHOST_DOOR_POS.y;
                mode = globalGhostModeRef.current;
                dir = 'LEFT';
                lastTileKey = '13,11';
              }
              return { ...ghost, x, y, dir, mode, houseTimer, lastTileKey };
            }
          }

          // B. EATEN MODE (Return to house)
          if (mode === 'eaten') {
            const eatenSpeed = 0.16;

            const ghostHomes: Record<string, number> = {
              blinky: 13.5,
              pinky: 13.5,
              inky: 11.5,
              clyde: 15.5,
            };
            const homeX = ghostHomes[ghost.id] ?? 13.5;

            // When eyes reach ghost door (13.5, 11), enter door smoothly
            if (y >= 10.8 && y <= 14.1 && Math.abs(x - 13.5) < 0.8) {
              dir = 'DOWN';
              y += 0.12;
              if (Math.abs(x - homeX) > 0.05) {
                x += x < homeX ? 0.08 : -0.08;
              } else {
                x = homeX;
              }

              // Fully inside house -> regenerate ghost body and stay in house mode
              if (y >= 13.8) {
                x = homeX;
                y = 14;
                mode = 'house';
                houseTimer = 20;
                dir = 'UP';
                return { ...ghost, x, y, dir, mode, houseTimer, speed: 0.080, lastTileKey: '' };
              }
              return { ...ghost, x, y, dir, mode, lastTileKey };
            }

            const currCol = Math.round(x);
            const currRow = Math.round(y);
            const tileKey = `${currCol},${currRow}`;

            if (tileKey !== lastTileKey) {
              lastTileKey = tileKey;
              dir = chooseNextDirection(tilesRef.current, { ...ghost, x: currCol, y: currRow, dir }, GHOST_DOOR_POS);
              if (dir === 'LEFT' || dir === 'RIGHT') y = currRow;
              if (dir === 'UP' || dir === 'DOWN') x = currCol;
            }

            const offset = getDirOffset(dir);
            x += offset.dx * eatenSpeed;
            y += offset.dy * eatenSpeed;
            return { ...ghost, x, y, dir, mode, speed: eatenSpeed, lastTileKey };
          }

          // C. CHASE / SCATTER / FRIGHTENED MODES
          let speed = 0.080;
          if (mode === 'frightened') {
            speed = 0.050;
          } else if (ghost.id === 'blinky') {
            speed = 0.082;
          } else if (ghost.id === 'pinky') {
            speed = 0.080;
          } else if (ghost.id === 'inky') {
            speed = 0.078;
          } else {
            speed = 0.075;
          }

          // Lock perpendicular coordinate to grid line center to prevent drifting
          if (dir === 'LEFT' || dir === 'RIGHT') {
            y = Math.round(y);
          } else if (dir === 'UP' || dir === 'DOWN') {
            x = Math.round(x);
          }

          const currCol = Math.round(x);
          const currRow = Math.round(y);
          const distToCenter = Math.hypot(x - currCol, y - currRow);
          const tileKey = `${currCol},${currRow}`;

          // Direction decision at tile center / new tile
          if (tileKey !== lastTileKey && distToCenter <= speed * 1.5) {
            lastTileKey = tileKey;
            const targetPos = getGhostTarget(
              ghost,
              { x: pacmanRef.current.x, y: pacmanRef.current.y },
              pacmanRef.current.dir,
              blinkyPos
            );

            const nextDir = chooseNextDirection(tilesRef.current, { ...ghost, x: currCol, y: currRow, dir }, targetPos);
            if (nextDir !== dir) {
              dir = nextDir;
              x = currCol;
              y = currRow;
            }
          }

          // Movement along current direction
          const offset = getDirOffset(dir);
          const targetCol = currCol + offset.dx;
          const targetRow = currRow + offset.dy;
          const wallAhead = isWall(tilesRef.current, targetCol, targetRow, true, mode);

          if (dir === 'RIGHT') {
            if (wallAhead && x + speed >= currCol) {
              x = currCol;
            } else {
              x += speed;
            }
          } else if (dir === 'LEFT') {
            if (wallAhead && x - speed <= currCol) {
              x = currCol;
            } else {
              x -= speed;
            }
          } else if (dir === 'DOWN') {
            if (wallAhead && y + speed >= currRow) {
              y = currRow;
            } else {
              y += speed;
            }
          } else if (dir === 'UP') {
            if (wallAhead && y - speed <= currRow) {
              y = currRow;
            } else {
              y -= speed;
            }
          }

          // Tunnel Wrapping
          if (x < -0.5) {
            x = MAZE_COLS - 0.5;
            lastTileKey = '';
          }
          if (x > MAZE_COLS - 0.5) {
            x = -0.5;
            lastTileKey = '';
          }

          return { ...ghost, x, y, dir, mode, speed, lastTileKey };
        });

        // 6. PAC-MAN <-> GHOST COLLISIONS
        ghostsRef.current.forEach(ghost => {
          if (ghost.mode === 'house' || ghost.mode === 'eaten') return;

          const dist = Math.hypot(p.x - ghost.x, p.y - ghost.y);
          if (dist < 0.75) {
            if (ghost.mode === 'frightened') {
              handleEatGhost(ghost.id, ghost.x, ghost.y);
            } else if (ghost.mode === 'chase' || ghost.mode === 'scatter') {
              handlePacmanDeath();
            }
          }
        });

        // 7. SCORE POPUPS DECAY
        scorePopupsRef.current = scorePopupsRef.current
          .map(popup => ({
            ...popup,
            y: popup.y - 0.02,
            opacity: popup.timer / 45,
            timer: popup.timer - 1,
          }))
          .filter(popup => popup.timer > 0);

        // SYNC TO REACT COMPONENT STATE FOR SMOOTH CANVAS REDRAW
        setPacman({ ...pacmanRef.current });
        setGhosts([...ghostsRef.current]);
        setScorePopups([...scorePopupsRef.current]);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [handleEatGhost, handlePacmanDeath, addScorePopup]);

  return {
    tiles,
    dotsMap,
    powerPelletsMap,
    score,
    highScore,
    lives,
    level,
    dotsEaten,
    totalDots,
    gameState,
    setGameState,
    pacman,
    ghosts,
    fruit,
    scorePopups,
    startGame,
    changeDirection,
  };
}
