import { HighScore } from '../types';

const STORAGE_KEY = 'pacman_arcade_high_scores_v1';

const DEFAULT_SCORES: HighScore[] = [
  { id: '1', name: 'PAC', score: 10000, level: 5, date: '2026-07-01' },
  { id: '2', name: 'GHO', score: 7500, level: 4, date: '2026-07-10' },
  { id: '3', name: 'WAK', score: 5000, level: 3, date: '2026-07-15' },
  { id: '4', name: 'ARC', score: 3000, level: 2, date: '2026-07-20' },
  { id: '5', name: 'RET', score: 1500, level: 1, date: '2026-07-24' },
];

export function getHighScores(): HighScore[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SCORES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_SCORES;
  } catch {
    return DEFAULT_SCORES;
  }
}

export function saveHighScore(name: string, score: number, level: number): HighScore[] {
  const current = getHighScores();
  const cleanName = (name || 'AAA').substring(0, 3).toUpperCase();
  const newEntry: HighScore = {
    id: Date.now().toString(),
    name: cleanName,
    score,
    level,
    date: new Date().toISOString().split('T')[0],
  };

  const updated = [...current, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota fallback
  }

  return updated;
}

export function isNewHighScore(score: number): boolean {
  if (score <= 0) return false;
  const scores = getHighScores();
  if (scores.length < 10) return true;
  return score > scores[scores.length - 1].score;
}
