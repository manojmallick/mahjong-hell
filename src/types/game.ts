import type { Language } from '../engine/i18n';

export type Suit = 'man' | 'pin' | 'sou' | 'wind' | 'dragon';

export type WindValue = 'E' | 'S' | 'W' | 'N';
export type DragonValue = 'red' | 'green' | 'white';

export type TileValue = number | WindValue | DragonValue;

export type TileEnhancement = 'none' | 'foil' | 'holo' | 'gold' | 'glass' | 'steel';

export interface Tile {
  id: string;
  suit: Suit;
  value: TileValue;
  displayValue: string;
  kanji: string;
  isHonor: boolean;
  isTerminal: boolean;
  enhancement: TileEnhancement;
  baseChips: number;
  bonusMult: number;
}

export type MeldType = 'sequence' | 'triplet' | 'quad' | 'pair' | 'single';

export interface Meld {
  type: MeldType;
  tiles: Tile[];
  suit?: Suit;
  value?: TileValue;
  baseChips: number;
  baseMult: number;
}

export type YakuType = 
  | 'tanyao'        // All Simples (No 1,9 or Honors)
  | 'yakuhai'       // Dragon or Seat Wind Triplets
  | 'pinfu'         // All Sequences
  | 'toitoi'        // All Triplets
  | 'honitsu'       // Half Flush (1 suit + Honors)
  | 'chinitsu'      // Full Flush (1 suit only)
  | 'chitoitsu'     // Seven Pairs
  | 'sananko'       // 3 Concealed Triplets
  | 'daisangen'     // Big Three Dragons
  | 'kokushi'       // 13 Orphans
  | 'high_hand'     // Basic played hand
  | 'pair_meld'     // Pair played
  | 'sequence_meld' // Single sequence
  | 'triplet_meld'; // Single triplet

export interface YakuLevel {
  name: string;
  japanese: string;
  level: number;
  baseChips: number;
  baseMult: number;
  chipUpgradePerLevel: number;
  multUpgradePerLevel: number;
}

export interface HandEvaluation {
  yakuName: string;
  yakuJapanese: string;
  melds: Meld[];
  validTiles: Tile[];
  baseChips: number;
  baseMult: number;
  yakuTypes: YakuType[];
}

export type RelicRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface Relic {
  id: string;
  name: string;
  japanese: string;
  rarity: RelicRarity;
  cost: number;
  description: string;
  icon: string;
  onTileScore?: (tile: Tile, handEval: HandEvaluation) => { chips?: number; mult?: number; dollars?: number };
  onHandPlayed?: (handEval: HandEvaluation, runState: RunState) => { chips?: number; mult?: number; xMult?: number; dollars?: number };
  onDiscard?: (discardedTiles: Tile[]) => { chips?: number; mult?: number; dollars?: number };
  onRoundStart?: (runState: RunState) => Partial<RunState>;
}

export interface ScrollItem {
  id: string;
  name: string;
  type: 'upgrade_yaku' | 'enhance_tile' | 'gain_cash' | 'utility';
  cost: number;
  description: string;
  targetYaku?: YakuType;
  enhancement?: TileEnhancement;
}

export interface Voucher {
  id: string;
  name: string;
  japanese: string;
  cost: number;
  description: string;
  icon: string;
  tier: 1 | 2;
  requiresVoucherId?: string;
}

export interface Blind {
  type: 'small' | 'big' | 'boss';
  name: string;
  targetScore: number;
  reward: number;
  bossDebuff?: string;
}

export interface CareerStats {
  bestAnte: number;
  highestHandScore: number;
  totalHandsPlayed: number;
  totalDiscards: number;
  runsWon: number;
}

export interface RunState {
  ante: number;
  roundInAnte: number;
  currentBlind: Blind;
  score: number;
  handsLeft: number;
  discardsLeft: number;
  maxHands: number;
  maxDiscards: number;
  money: number;
  relics: Relic[];
  maxRelics: number;
  heldScrolls: ScrollItem[];
  maxHeldScrolls: number;
  purchasedVouchers: string[];
  deck: Tile[];
  hand: Tile[];
  doraIndicator: Tile | null;
  selectedTileIds: string[];
  playedHandsHistory: HandEvaluation[];
  yakuLevels: Record<YakuType, YakuLevel>;
  inShop: boolean;
  gameStatus: 'playing' | 'round_won' | 'game_over' | 'victory';
  activeBossDebuff?: string;
  soundEnabled: boolean;
  language: Language;
  stats: CareerStats;
}
