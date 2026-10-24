import type { RunState } from '../types/game';

const SAVE_KEY = 'mahjong_hell_save_v1';

export function saveRunState(state: RunState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, serialized);
  } catch (e) {
    console.warn('Failed to save Mahjong Hell state to localStorage:', e);
  }
}

export function loadRunState(): RunState | null {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return null;
    return JSON.parse(data) as RunState;
  } catch (e) {
    console.warn('Failed to load Mahjong Hell state:', e);
    return null;
  }
}

export function clearRunState(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    console.warn('Failed to clear state:', e);
  }
}

export function generateRunSeed(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let seed = '';
  for (let i = 0; i < 8; i++) {
    seed += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return seed;
}
