import type { Blind } from '../types/game';

const BOSS_DEBUFFS = [
  { name: 'Pin Eclipse', desc: 'Pin (Dots) tiles score 0 base chips' },
  { name: 'Toll of Discard', desc: 'Every discard costs $1' },
  { name: 'Silence of Honors', desc: 'Honor tiles grant no base chips' },
  { name: 'The Narrow Gate', desc: 'Must play at least 3 tiles per hand' },
  { name: 'Strict Master', desc: 'Base Mult reduced by 50%' }
];

export function getBlindForAnte(ante: number, roundInAnte: number): Blind {
  // Base scale multiplier per ante
  const baseScale = [
    300,    // Ante 1
    1500,   // Ante 2
    8000,   // Ante 3
    35000,  // Ante 4
    150000, // Ante 5
    600000, // Ante 6
    2500000,// Ante 7
    10000000// Ante 8
  ][Math.min(ante - 1, 7)];

  if (roundInAnte === 1) {
    return {
      type: 'small',
      name: `Ante ${ante} - Small Blind`,
      targetScore: baseScale,
      reward: 3 + ante
    };
  } else if (roundInAnte === 2) {
    return {
      type: 'big',
      name: `Ante ${ante} - Big Blind`,
      targetScore: Math.floor(baseScale * 1.5),
      reward: 4 + ante
    };
  } else {
    const boss = BOSS_DEBUFFS[(ante - 1) % BOSS_DEBUFFS.length];
    return {
      type: 'boss',
      name: `Ante ${ante} - ${boss.name}`,
      targetScore: baseScale * 2,
      reward: 6 + ante * 2,
      bossDebuff: boss.desc
    };
  }
}
