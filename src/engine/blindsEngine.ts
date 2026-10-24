import type { Blind } from '../types/game';

export interface ExtendedBlind extends Blind {
  icon?: string;
}

const EXPANDED_BOSS_DEBUFFS = [
  { name: 'Pin Eclipse', desc: 'Pin (Dots) tiles score 0 base chips', icon: 'SunDim' },
  { name: 'Toll of Discard', desc: 'Every discard costs $1', icon: 'Coins' },
  { name: 'Silence of Honors', desc: 'Honor tiles grant no base chips', icon: 'VolumeX' },
  { name: 'The Narrow Gate', desc: 'Must play at least 3 tiles per hand', icon: 'Lock' },
  { name: 'Strict Master', desc: 'Base Mult reduced by 50%', icon: 'Percent' },
  { name: 'Obsidian Seal', desc: 'Man (Characters) tiles score 0 base chips', icon: 'ShieldAlert' },
  { name: 'Bamboo Forest Trap', desc: 'Sou (Bamboos) tiles grant no bonus mult', icon: 'TreePine' },
  { name: 'The Iron Shield', desc: 'Target score increased by 50%', icon: 'Shield' },
  { name: 'Famine', desc: 'Start round with 2 fewer cards in hand', icon: 'MinusCircle' },
  { name: 'Hellfire Storm', desc: 'Playing non-Yaku hands reduces money by $2', icon: 'Flame' }
];

export function getBlindForAnte(ante: number, roundInAnte: number): ExtendedBlind {
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
    const boss = EXPANDED_BOSS_DEBUFFS[(ante - 1) % EXPANDED_BOSS_DEBUFFS.length];
    return {
      type: 'boss',
      name: `Ante ${ante} - ${boss.name}`,
      targetScore: baseScale * 2,
      reward: 6 + ante * 2,
      bossDebuff: boss.desc,
      icon: boss.icon
    };
  }
}
