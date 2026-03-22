import { useState, useCallback, useEffect, useMemo } from "react";

export type Grid = boolean[][];

export interface LevelConfig {
  level: number;
  size: number;
  scrambleMoves: number;
  timeLimit: number; // in seconds
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert" | "Master" | "Legendary";
  color: string;
}

function createEmptyGrid(size: number): Grid {
  return Array.from({ length: size }, () => Array(size).fill(false));
}

function toggleCell(grid: Grid, row: number, col: number): Grid {
  const size = grid.length;
  const newGrid = grid.map((r) => [...r]);
  const deltas = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  for (const [dr, dc] of deltas) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      newGrid[nr][nc] = !newGrid[nr][nc];
    }
  }
  return newGrid;
}

function isSolved(grid: Grid): boolean {
  return grid.every((row) => row.every((cell) => !cell));
}

function getLevelTitle(level: number): string {
  if (level <= 3) return "Warm Up";
  if (level <= 6) return "Circuit Shift";
  if (level <= 9) return "Neon Maze";
  if (level <= 12) return "Grid Storm";
  if (level <= 15) return "Pulse Wave";
  if (level <= 18) return "Cyber Grid";
  if (level <= 21) return "Neural Net";
  if (level <= 24) return "Quantum Field";
  return "Blackout Core";
}

function getDifficulty(level: number): LevelConfig["difficulty"] {
  if (level <= 3) return "Easy";
  if (level <= 6) return "Medium";
  if (level <= 10) return "Hard";
  if (level <= 15) return "Expert";
  if (level <= 20) return "Master";
  return "Legendary";
}

function getDifficultyColor(difficulty: LevelConfig["difficulty"]): string {
  switch (difficulty) {
    case "Easy":
      return "text-emerald-400";
    case "Medium":
      return "text-blue-400";
    case "Hard":
      return "text-amber-400";
    case "Expert":
      return "text-orange-400";
    case "Master":
      return "text-rose-400";
    case "Legendary":
      return "text-purple-400";
  }
}

// Get time limit based on level difficulty (in seconds)
function getTimeLimit(level: number, size: number): number {
  // Base time decreases as levels increase, making it harder
  // But larger grids get more time
  const baseTimePerCell = {
    3: 8,   // 3x3: 8 seconds per cell = 72 seconds base
    4: 7,   // 4x4: 7 seconds per cell = 112 seconds base
    5: 6,   // 5x5: 6 seconds per cell = 150 seconds base
    6: 5,   // 6x6: 5 seconds per cell = 180 seconds base
    7: 5,   // 7x7: 5 seconds per cell = 245 seconds base
    8: 4,   // 8x8: 4 seconds per cell = 256 seconds base
  }[size] || 5;

  const totalCells = size * size;
  const baseTime = totalCells * baseTimePerCell;
  
  // Reduce time as levels progress within same size
  // Higher levels have less time, making them harder
  const levelPenalty = Math.floor(level * 1.5);
  
  // Minimum time ensures game is playable
  const minTime = size * 10; // At least 10 seconds per row
  
  return Math.max(minTime, baseTime - levelPenalty);
}

export function getLevelConfig(level: number): LevelConfig {
  const safeLevel = Math.max(1, level);

  // More gradual size progression for 25 levels
  let size: number;
  if (safeLevel <= 3) size = 3;
  else if (safeLevel <= 6) size = 4;
  else if (safeLevel <= 10) size = 5;
  else if (safeLevel <= 15) size = 6;
  else if (safeLevel <= 20) size = 7;
  else size = 8;

  // Scramble moves increase with level
  const baseScramble = size * 2;
  const levelBonus = Math.floor(safeLevel * 1.5);
  const scrambleMoves = baseScramble + levelBonus;

  const difficulty = getDifficulty(safeLevel);
  const timeLimit = getTimeLimit(safeLevel, size);

  return {
    level: safeLevel,
    size,
    scrambleMoves,
    timeLimit,
    title: getLevelTitle(safeLevel),
    description: `${size}×${size} grid • ${timeLimit}s time limit`,
    difficulty,
    color: getDifficultyColor(difficulty),
  };
}

export const MAX_LEVEL = 25;

/**
 * Generate a solvable puzzle by starting from a solved (all-off) state
 * and applying a random number of valid moves.
 */
function generatePuzzle(size: number, moves: number): Grid {
  let grid = createEmptyGrid(size);

  for (let i = 0; i < moves; i++) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    grid = toggleCell(grid, row, col);
  }

  // Re-roll if we accidentally generated a solved puzzle
  if (isSolved(grid)) {
    return generatePuzzle(size, moves);
  }

  return grid;
}

export function useLightsOut(initialLevel: number = 1) {
  const [level, setLevel] = useState(Math.max(1, initialLevel));
  const initialConfig = getLevelConfig(initialLevel);
  const [grid, setGrid] = useState<Grid>(() =>
    generatePuzzle(initialConfig.size, initialConfig.scrambleMoves)
  );
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [bestTimes, setBestTimes] = useState<Record<number, number>>({});
  const levelConfig = useMemo(() => getLevelConfig(level), [level]);

  const startLevel = useCallback((nextLevel: number) => {
    const config = getLevelConfig(nextLevel);
    setLevel(config.level);
    setGrid(generatePuzzle(config.size, config.scrambleMoves));
    setMoves(0);
    setSolved(false);
  }, []);

  const resetLevel = useCallback(() => {
    startLevel(level);
  }, [level, startLevel]);

  const nextLevel = useCallback(() => {
    startLevel(Math.min(level + 1, MAX_LEVEL));
  }, [level, startLevel]);

  const handleClick = useCallback(
    (row: number, col: number) => {
      if (solved) return;
      setGrid((prev) => {
        const next = toggleCell(prev, row, col);
        return next;
      });
      setMoves((m) => m + 1);
    },
    [solved]
  );

  const recordTime = useCallback(
    (time: number) => {
      setBestTimes((prev) => {
        const current = prev[level];
        if (current === undefined || time < current) {
          return { ...prev, [level]: time };
        }
        return prev;
      });
    },
    [level]
  );

  // Check win condition after every grid change
  useEffect(() => {
    if (moves > 0 && isSolved(grid)) {
      setSolved(true);
      setBestScores((prev) => {
        const current = prev[level];
        if (current === undefined || moves < current) {
          return { ...prev, [level]: moves };
        }
        return prev;
      });
    }
  }, [grid, level, moves]);

  return {
    level,
    size: levelConfig.size,
    levelConfig,
    grid,
    moves,
    solved,
    bestScores,
    bestTimes,
    handleClick,
    startLevel,
    resetLevel,
    nextLevel,
    recordTime,
  };
}
