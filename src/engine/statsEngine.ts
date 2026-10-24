import type { CareerStats } from '../types/game';

const STATS_KEY = 'mahjong_hell_career_stats_v1';

export const INITIAL_STATS: CareerStats = {
  bestAnte: 1,
  highestHandScore: 0,
  totalHandsPlayed: 0,
  totalDiscards: 0,
  runsWon: 0
};

export function loadCareerStats(): CareerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return INITIAL_STATS;
    return JSON.parse(raw) as CareerStats;
  } catch (e) {
    console.warn('Failed to load career stats:', e);
    return INITIAL_STATS;
  }
}

export function updateCareerStats(
  handScore?: number,
  anteReached?: number,
  isHandPlayed?: boolean,
  isDiscarded?: boolean,
  isRunWon?: boolean
): CareerStats {
  const current = loadCareerStats();
  const updated: CareerStats = {
    bestAnte: anteReached ? Math.max(current.bestAnte, anteReached) : current.bestAnte,
    highestHandScore: handScore ? Math.max(current.highestHandScore, handScore) : current.highestHandScore,
    totalHandsPlayed: isHandPlayed ? current.totalHandsPlayed + 1 : current.totalHandsPlayed,
    totalDiscards: isDiscarded ? current.totalDiscards + 1 : current.totalDiscards,
    runsWon: isRunWon ? current.runsWon + 1 : current.runsWon
  };

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save career stats:', e);
  }

  return updated;
}
