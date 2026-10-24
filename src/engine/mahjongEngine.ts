import type { Tile, Suit, TileValue, HandEvaluation, YakuType, Meld, YakuLevel } from '../types/game';

export interface ExtendedYakuLevel extends YakuLevel {
  isYakuman?: boolean;
}

export const EXPANDED_YAKU_LEVELS: Record<YakuType, ExtendedYakuLevel> = {
  high_hand: { name: 'High Tile', japanese: '単牌', level: 1, baseChips: 10, baseMult: 1, chipUpgradePerLevel: 10, multUpgradePerLevel: 1 },
  pair_meld: { name: 'One Pair', japanese: '対子', level: 1, baseChips: 20, baseMult: 2, chipUpgradePerLevel: 15, multUpgradePerLevel: 1 },
  sequence_meld: { name: 'Sequence (Chi)', japanese: '順子', level: 1, baseChips: 30, baseMult: 2, chipUpgradePerLevel: 20, multUpgradePerLevel: 2 },
  triplet_meld: { name: 'Triplet (Pon)', japanese: '刻子', level: 1, baseChips: 40, baseMult: 3, chipUpgradePerLevel: 25, multUpgradePerLevel: 2 },
  tanyao: { name: 'All Simples (Tanyao)', japanese: '断么九', level: 1, baseChips: 60, baseMult: 4, chipUpgradePerLevel: 30, multUpgradePerLevel: 3 },
  yakuhai: { name: 'Honor Triplet (Yakuhai)', japanese: '役牌', level: 1, baseChips: 70, baseMult: 5, chipUpgradePerLevel: 35, multUpgradePerLevel: 3 },
  pinfu: { name: 'All Sequences (Pinfu)', japanese: '平和', level: 1, baseChips: 80, baseMult: 6, chipUpgradePerLevel: 40, multUpgradePerLevel: 4 },
  toitoi: { name: 'All Triplets (Toitoi)', japanese: '対々和', level: 1, baseChips: 100, baseMult: 8, chipUpgradePerLevel: 50, multUpgradePerLevel: 5 },
  sananko: { name: '3 Triplets (Sananko)', japanese: '三暗刻', level: 1, baseChips: 120, baseMult: 9, chipUpgradePerLevel: 60, multUpgradePerLevel: 5 },
  honitsu: { name: 'Half Flush (Honitsu)', japanese: '混一色', level: 1, baseChips: 150, baseMult: 10, chipUpgradePerLevel: 70, multUpgradePerLevel: 6 },
  chitoitsu: { name: 'Seven Pairs (Chitoitsu)', japanese: '七対子', level: 1, baseChips: 180, baseMult: 12, chipUpgradePerLevel: 80, multUpgradePerLevel: 7 },
  chinitsu: { name: 'Full Flush (Chinitsu)', japanese: '清一色', level: 1, baseChips: 250, baseMult: 16, chipUpgradePerLevel: 100, multUpgradePerLevel: 8 },
  daisangen: { name: 'Big Three Dragons', japanese: '大三元', level: 1, baseChips: 400, baseMult: 25, chipUpgradePerLevel: 150, multUpgradePerLevel: 12, isYakuman: true },
  kokushi: { name: '13 Orphans (Kokushi)', japanese: '国士無双', level: 1, baseChips: 600, baseMult: 40, chipUpgradePerLevel: 200, multUpgradePerLevel: 20, isYakuman: true }
};

export function createMahjongDeckWithDora(): Tile[] {
  const deck: Tile[] = [];
  let idCounter = 1;

  const suits: Suit[] = ['man', 'pin', 'sou'];
  const kanjiNums = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const suitKanji: Record<Suit, string> = { man: '万', pin: '筒', sou: '索', wind: '', dragon: '' };

  suits.forEach((suit) => {
    for (let num = 1; num <= 9; num++) {
      for (let copy = 0; copy < 4; copy++) {
        const isTerminal = num === 1 || num === 9;
        const isRedDora = num === 5 && copy === 0; // Red 5 Dora tile
        const kanji = suit === 'man' ? `${kanjiNums[num - 1]}万` : `${num}${suitKanji[suit]}`;

        deck.push({
          id: `tile-${idCounter++}`,
          suit,
          value: num,
          displayValue: `${num}`,
          kanji: isRedDora ? `赤${kanji}` : kanji,
          isHonor: false,
          isTerminal,
          enhancement: isRedDora ? 'holo' : 'none',
          baseChips: num * 2 + (isRedDora ? 10 : 0),
          bonusMult: isRedDora ? 5 : 0
        });
      }
    }
  });

  // Honor Tiles (Winds & Dragons)
  const winds: { val: TileValue; kanji: string }[] = [
    { val: 'E', kanji: '東' }, { val: 'S', kanji: '南' },
    { val: 'W', kanji: '西' }, { val: 'N', kanji: '北' }
  ];
  winds.forEach(({ val, kanji }) => {
    for (let copy = 0; copy < 4; copy++) {
      deck.push({
        id: `tile-${idCounter++}`,
        suit: 'wind',
        value: val,
        displayValue: val as string,
        kanji,
        isHonor: true,
        isTerminal: true,
        enhancement: 'none',
        baseChips: 15,
        bonusMult: 0
      });
    }
  });

  const dragons: { val: TileValue; kanji: string }[] = [
    { val: 'red', kanji: '中' }, { val: 'green', kanji: '發' }, { val: 'white', kanji: '白' }
  ];
  dragons.forEach(({ val, kanji }) => {
    for (let copy = 0; copy < 4; copy++) {
      deck.push({
        id: `tile-${idCounter++}`,
        suit: 'dragon',
        value: val,
        displayValue: val as string,
        kanji,
        isHonor: true,
        isTerminal: true,
        enhancement: 'none',
        baseChips: 20,
        bonusMult: 0
      });
    }
  });

  return shuffleDeck(deck);
}

export function shuffleDeck<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function sortTiles(tiles: Tile[]): Tile[] {
  const suitOrder: Record<Suit, number> = { man: 1, pin: 2, sou: 3, wind: 4, dragon: 5 };
  const windOrder: Record<string, number> = { E: 1, S: 2, W: 3, N: 4 };
  const dragonOrder: Record<string, number> = { red: 1, green: 2, white: 3 };

  return [...tiles].sort((a, b) => {
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    if (typeof a.value === 'number' && typeof b.value === 'number') {
      return a.value - b.value;
    }
    if (a.suit === 'wind' && b.suit === 'wind') {
      return (windOrder[a.value as string] || 0) - (windOrder[b.value as string] || 0);
    }
    if (a.suit === 'dragon' && b.suit === 'dragon') {
      return (dragonOrder[a.value as string] || 0) - (dragonOrder[b.value as string] || 0);
    }
    return 0;
  });
}

export function evaluatePlayedHand(
  tiles: Tile[],
  yakuLevels: Record<YakuType, YakuLevel> = EXPANDED_YAKU_LEVELS
): HandEvaluation {
  if (tiles.length === 0) {
    const level = yakuLevels.high_hand;
    return {
      yakuName: level.name,
      yakuJapanese: level.japanese,
      melds: [],
      validTiles: [],
      baseChips: level.baseChips,
      baseMult: level.baseMult,
      yakuTypes: ['high_hand']
    };
  }

  const sorted = sortTiles(tiles);
  const melds: Meld[] = findMelds(sorted);

  const isAllSimples = tiles.length >= 3 && tiles.every((t) => !t.isHonor && !t.isTerminal);
  const isFullFlush = tiles.length >= 5 && tiles.every((t) => t.suit === tiles[0].suit && !t.isHonor);
  const isHalfFlush = tiles.length >= 5 && tiles.some((t) => t.isHonor) && new Set(tiles.map((t) => t.isHonor ? 'honor' : t.suit)).size <= 2;
  const isSevenPairs = tiles.length === 14 && isChitoitsu(sorted);
  const isThirteenOrphans = tiles.length === 14 && isKokushi(sorted);
  const isBigThreeDragons = hasDaisangen(sorted);

  const tripletsCount = melds.filter((m) => m.type === 'triplet' || m.type === 'quad').length;
  const sequenceCount = melds.filter((m) => m.type === 'sequence').length;
  const isToitoi = melds.length >= 4 && tripletsCount >= 4;
  const isPinfu = melds.length >= 4 && sequenceCount >= 4;
  const isSananko = tripletsCount >= 3;
  const hasHonorTriplet = melds.some((m) => (m.type === 'triplet' || m.type === 'quad') && (m.suit === 'dragon' || m.suit === 'wind'));

  const detectedYaku: YakuType[] = [];

  if (isThirteenOrphans) detectedYaku.push('kokushi');
  else if (isBigThreeDragons) detectedYaku.push('daisangen');
  else if (isSevenPairs) detectedYaku.push('chitoitsu');
  else if (isFullFlush) detectedYaku.push('chinitsu');
  else if (isHalfFlush) detectedYaku.push('honitsu');
  else if (isSananko) detectedYaku.push('sananko');
  else if (isToitoi) detectedYaku.push('toitoi');
  else if (isPinfu) detectedYaku.push('pinfu');
  else if (isAllSimples) detectedYaku.push('tanyao');
  else if (hasHonorTriplet) detectedYaku.push('yakuhai');
  else if (tripletsCount > 0) detectedYaku.push('triplet_meld');
  else if (sequenceCount > 0) detectedYaku.push('sequence_meld');
  else if (melds.some((m) => m.type === 'pair')) detectedYaku.push('pair_meld');
  else detectedYaku.push('high_hand');

  const primaryYaku = detectedYaku[0];
  const levelData = yakuLevels[primaryYaku] || yakuLevels.high_hand;

  const chips = levelData.baseChips + (levelData.level - 1) * levelData.chipUpgradePerLevel;
  const mult = levelData.baseMult + (levelData.level - 1) * levelData.multUpgradePerLevel;

  return {
    yakuName: levelData.name,
    yakuJapanese: levelData.japanese,
    melds,
    validTiles: sorted,
    baseChips: chips,
    baseMult: mult,
    yakuTypes: detectedYaku
  };
}

function findMelds(tiles: Tile[]): Meld[] {
  const melds: Meld[] = [];
  const copies: Record<string, Tile[]> = {};

  tiles.forEach((t) => {
    const key = `${t.suit}_${t.value}`;
    if (!copies[key]) copies[key] = [];
    copies[key].push(t);
  });

  Object.values(copies).forEach((group) => {
    if (group.length >= 4) {
      melds.push({ type: 'quad', tiles: group.slice(0, 4), suit: group[0].suit, value: group[0].value, baseChips: 40, baseMult: 3 });
    } else if (group.length === 3) {
      melds.push({ type: 'triplet', tiles: group, suit: group[0].suit, value: group[0].value, baseChips: 30, baseMult: 2 });
    } else if (group.length === 2) {
      melds.push({ type: 'pair', tiles: group, suit: group[0].suit, value: group[0].value, baseChips: 15, baseMult: 1 });
    }
  });

  const suits: Suit[] = ['man', 'pin', 'sou'];
  suits.forEach((suit) => {
    const suitTiles = tiles.filter((t) => t.suit === suit && typeof t.value === 'number');
    const uniqueValues = Array.from(new Set(suitTiles.map((t) => t.value as number))).sort((a, b) => a - b);

    for (let i = 0; i <= uniqueValues.length - 3; i++) {
      const v1 = uniqueValues[i];
      const v2 = uniqueValues[i + 1];
      const v3 = uniqueValues[i + 2];

      if (v2 === v1 + 1 && v3 === v1 + 2) {
        const t1 = suitTiles.find((t) => t.value === v1)!;
        const t2 = suitTiles.find((t) => t.value === v2)!;
        const t3 = suitTiles.find((t) => t.value === v3)!;

        melds.push({
          type: 'sequence',
          tiles: [t1, t2, t3],
          suit,
          baseChips: 25,
          baseMult: 2
        });
      }
    }
  });

  return melds;
}

function isChitoitsu(tiles: Tile[]): boolean {
  if (tiles.length !== 14) return false;
  const groups: Record<string, number> = {};
  tiles.forEach((t) => {
    const k = `${t.suit}_${t.value}`;
    groups[k] = (groups[k] || 0) + 1;
  });
  return Object.values(groups).length === 7 && Object.values(groups).every((c) => c === 2);
}

function isKokushi(tiles: Tile[]): boolean {
  if (tiles.length !== 14) return false;
  const required = [
    'man_1', 'man_9', 'pin_1', 'pin_9', 'sou_1', 'sou_9',
    'wind_E', 'wind_S', 'wind_W', 'wind_N',
    'dragon_red', 'dragon_green', 'dragon_white'
  ];
  const keys = tiles.map((t) => `${t.suit}_${t.value}`);
  return required.every((req) => keys.includes(req));
}

function hasDaisangen(tiles: Tile[]): boolean {
  const dragons = ['red', 'green', 'white'];
  return dragons.every((d) => {
    const match = tiles.filter((t) => t.suit === 'dragon' && t.value === d);
    return match.length >= 3;
  });
}
