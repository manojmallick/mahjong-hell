import { describe, it, expect } from 'vitest';
import {
  createStandardMahjongDeck,
  sortTiles,
  evaluatePlayedHand,
  INITIAL_YAKU_LEVELS,
  shuffleDeck,
} from './mahjong';
import type { Tile, Suit } from '../types/game';

// Helper: create a minimal tile
function tile(suit: Suit, value: number | string, id = String(Math.random())): Tile {
  return {
    id,
    suit,
    value: value as Tile['value'],
    displayValue: String(value),
    kanji: '',
    isHonor: suit === 'wind' || suit === 'dragon',
    isTerminal: typeof value === 'number' ? (value === 1 || value === 9) : true,
    enhancement: 'none',
    baseChips: typeof value === 'number' ? value * 2 : 15,
    bonusMult: 0,
  };
}

describe('createStandardMahjongDeck', () => {
  it('creates a full 136-tile deck', () => {
    const deck = createStandardMahjongDeck();
    expect(deck).toHaveLength(136);
  });

  it('contains exactly 4 copies of each numbered tile', () => {
    const deck = createStandardMahjongDeck();
    const man1 = deck.filter((t) => t.suit === 'man' && t.value === 1);
    expect(man1).toHaveLength(4);
  });

  it('contains 16 wind tiles', () => {
    const deck = createStandardMahjongDeck();
    const winds = deck.filter((t) => t.suit === 'wind');
    expect(winds).toHaveLength(16);
  });

  it('contains 12 dragon tiles', () => {
    const deck = createStandardMahjongDeck();
    const dragons = deck.filter((t) => t.suit === 'dragon');
    expect(dragons).toHaveLength(12);
  });

  it('marks honor tiles correctly', () => {
    const deck = createStandardMahjongDeck();
    deck.filter((t) => t.suit === 'wind' || t.suit === 'dragon').forEach((t) => {
      expect(t.isHonor).toBe(true);
    });
  });

  it('marks terminal tiles (1 and 9) correctly', () => {
    const deck = createStandardMahjongDeck();
    deck.filter((t) => typeof t.value === 'number').forEach((t) => {
      if (t.value === 1 || t.value === 9) {
        expect(t.isTerminal).toBe(true);
      } else {
        expect(t.isTerminal).toBe(false);
      }
    });
  });
});

describe('shuffleDeck', () => {
  it('preserves length', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffleDeck(arr)).toHaveLength(arr.length);
  });

  it('does not mutate the original array', () => {
    const arr = [1, 2, 3, 4, 5];
    shuffleDeck(arr);
    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('sortTiles', () => {
  it('sorts man < pin < sou < wind < dragon', () => {
    const tiles = [
      tile('dragon', 'red'),
      tile('wind', 'E'),
      tile('sou', 5),
      tile('pin', 3),
      tile('man', 1),
    ];
    const sorted = sortTiles(tiles);
    expect(sorted[0].suit).toBe('man');
    expect(sorted[4].suit).toBe('dragon');
  });

  it('sorts numerically within a suit', () => {
    const tiles = [tile('man', 9), tile('man', 1), tile('man', 5)];
    const sorted = sortTiles(tiles);
    expect(sorted.map((t) => t.value)).toEqual([1, 5, 9]);
  });
});

describe('evaluatePlayedHand', () => {
  it('returns high_hand for empty tile set', () => {
    const result = evaluatePlayedHand([]);
    expect(result.yakuTypes).toContain('high_hand');
  });

  it('detects pair_meld from two identical tiles', () => {
    const hand = [tile('man', 2, 'a'), tile('man', 2, 'b')];
    const result = evaluatePlayedHand(hand);
    expect(result.yakuTypes).toContain('pair_meld');
  });

  it('detects triplet_meld from three identical tiles (terminal — not tanyao)', () => {
    // Use terminal tile (pin 9) so tanyao doesn't take priority
    const hand = [tile('pin', 9, 'a'), tile('pin', 9, 'b'), tile('pin', 9, 'c')];
    const result = evaluatePlayedHand(hand);
    expect(result.yakuTypes).toContain('triplet_meld');
  });

  it('detects tanyao (all simples — no terminals/honors)', () => {
    const hand = [
      tile('man', 2, 'a'), tile('man', 3, 'b'), tile('man', 4, 'c'),
    ];
    const result = evaluatePlayedHand(hand);
    expect(result.yakuTypes).toContain('tanyao');
  });

  it('detects sequence_meld from consecutive tiles (terminal — not tanyao)', () => {
    // Use 7-8-9 so value 9 is terminal, preventing tanyao
    const hand = [tile('sou', 7, 'a'), tile('sou', 8, 'b'), tile('sou', 9, 'c')];
    const result = evaluatePlayedHand(hand);
    expect(result.yakuTypes).toContain('sequence_meld');
  });

  it('detects yakuhai when honor triplet is present', () => {
    const hand = [
      tile('dragon', 'red', 'a'), tile('dragon', 'red', 'b'), tile('dragon', 'red', 'c'),
    ];
    const result = evaluatePlayedHand(hand);
    expect(result.yakuTypes).toContain('yakuhai');
  });

  it('level 1 chips and mult match INITIAL_YAKU_LEVELS', () => {
    const hand = [tile('man', 2, 'a'), tile('man', 2, 'b')];
    const result = evaluatePlayedHand(hand, INITIAL_YAKU_LEVELS);
    const expected = INITIAL_YAKU_LEVELS.pair_meld;
    expect(result.baseChips).toBe(expected.baseChips);
    expect(result.baseMult).toBe(expected.baseMult);
  });

  it('higher levels increase chips and mult', () => {
    const upgradedLevels = {
      ...INITIAL_YAKU_LEVELS,
      pair_meld: { ...INITIAL_YAKU_LEVELS.pair_meld, level: 3 },
    };
    const hand = [tile('man', 2, 'a'), tile('man', 2, 'b')];
    const base = evaluatePlayedHand(hand, INITIAL_YAKU_LEVELS);
    const upgraded = evaluatePlayedHand(hand, upgradedLevels);
    expect(upgraded.baseChips).toBeGreaterThan(base.baseChips);
    expect(upgraded.baseMult).toBeGreaterThan(base.baseMult);
  });
});
