import type { Relic, ScrollItem } from '../types/game';

export interface Voucher {
  id: string;
  name: string;
  japanese: string;
  cost: number;
  description: string;
  icon: string;
  purchased?: boolean;
}

export const EXTENDED_RELICS: Relic[] = [
  {
    id: 'crimson_dragon',
    name: 'Crimson Dragon',
    japanese: '赤龍の符',
    rarity: 'common',
    cost: 5,
    description: '+15 Mult if hand contains a Red Dragon tile',
    icon: 'Flame',
    onHandPlayed: (handEval) => {
      const hasRed = handEval.validTiles.some((t) => t.suit === 'dragon' && t.value === 'red');
      return hasRed ? { mult: 15 } : {};
    }
  },
  {
    id: 'tanyao_master',
    name: 'Tanyao Master',
    japanese: '断么の鬼',
    rarity: 'common',
    cost: 4,
    description: '+60 Chips if played hand is All Simples (Tanyao)',
    icon: 'Sparkles',
    onHandPlayed: (handEval) => {
      return handEval.yakuTypes.includes('tanyao') ? { chips: 60 } : {};
    }
  },
  {
    id: 'yakuza_ledger',
    name: 'Yakuza Ledger',
    japanese: '極道の勘定',
    rarity: 'uncommon',
    cost: 6,
    description: 'Gain +$3 whenever you discard 3 or more tiles',
    icon: 'Coins',
    onDiscard: (tiles) => {
      return tiles.length >= 3 ? { dollars: 3 } : {};
    }
  },
  {
    id: 'white_jade',
    name: 'White Jade Pendant',
    japanese: '白玉の佩',
    rarity: 'uncommon',
    cost: 7,
    description: 'White Dragon tiles give x1.5 Mult when scored',
    icon: 'Shield',
    onTileScore: (tile) => {
      return tile.suit === 'dragon' && tile.value === 'white' ? { mult: 10 } : {};
    }
  },
  {
    id: 'demon_wind',
    name: 'Demon Wind',
    japanese: '魔風の笛',
    rarity: 'common',
    cost: 5,
    description: 'Honor tiles (Winds/Dragons) give +25 Chips each',
    icon: 'Wind',
    onTileScore: (tile) => {
      return tile.isHonor ? { chips: 25 } : {};
    }
  },
  {
    id: 'hellfire_forge',
    name: 'Hellfire Forge',
    japanese: '業火の鍛治場',
    rarity: 'rare',
    cost: 8,
    description: '+5 Mult for every enhanced tile played in hand',
    icon: 'Zap',
    onHandPlayed: (handEval) => {
      const count = handEval.validTiles.filter((t) => t.enhancement !== 'none').length;
      return { mult: count * 5 };
    }
  },
  {
    id: 'green_hatsu',
    name: 'Hatsu Fortune',
    japanese: '發の幸運',
    rarity: 'common',
    cost: 5,
    description: 'Green Dragon tiles earn +$3 when played',
    icon: 'Gem',
    onTileScore: (tile) => {
      return tile.suit === 'dragon' && tile.value === 'green' ? { dollars: 3 } : {};
    }
  },
  {
    id: 'blood_pact',
    name: 'Blood Pact',
    japanese: '血の契約',
    rarity: 'rare',
    cost: 7,
    description: '+35 Mult on every played hand, but lose $2 per hand played',
    icon: 'Skull',
    onHandPlayed: () => {
      return { mult: 35, dollars: -2 };
    }
  },
  {
    id: 'full_flush_flame',
    name: 'Full Flush Flame',
    japanese: '清一色の焔',
    rarity: 'rare',
    cost: 9,
    description: 'Full Flush hands score x2.0 Mult',
    icon: 'Swords',
    onHandPlayed: (handEval) => {
      return handEval.yakuTypes.includes('chinitsu') ? { xMult: 2.0 } : {};
    }
  },
  {
    id: 'maneki_neko',
    name: 'Golden Maneki-Neko',
    japanese: '金招き猫',
    rarity: 'uncommon',
    cost: 6,
    description: 'Gain +$4 bonus cash at the end of every round',
    icon: 'Coins',
    onRoundStart: (state) => {
      return { money: state.money + 4 };
    }
  },
  {
    id: 'terminal_anchor',
    name: 'Abyssal Anchor',
    japanese: '深淵の錨',
    rarity: 'common',
    cost: 4,
    description: '1 and 9 Terminal tiles give +30 Chips each',
    icon: 'Anchor',
    onTileScore: (tile) => {
      return tile.isTerminal ? { chips: 30 } : {};
    }
  },
  {
    id: 'seven_pairs_mark',
    name: 'Seven Pairs Mark',
    japanese: '七対子の刻印',
    rarity: 'uncommon',
    cost: 7,
    description: 'Seven Pairs hands grant +100 Chips and +15 Mult',
    icon: 'Boxes',
    onHandPlayed: (handEval) => {
      return handEval.yakuTypes.includes('chitoitsu') ? { chips: 100, mult: 15 } : {};
    }
  },
  {
    id: 'great_spirit',
    name: 'Great Spirit Seal',
    japanese: '大精霊の印章',
    rarity: 'legendary',
    cost: 15,
    description: 'All Yakuman & Limit hands score x3.0 Mult',
    icon: 'Flame',
    onHandPlayed: (handEval) => {
      const isYakuman = handEval.yakuTypes.includes('daisangen') || handEval.yakuTypes.includes('kokushi');
      return isYakuman ? { xMult: 3.0 } : {};
    }
  }
];

export const VOUCHERS: Voucher[] = [
  {
    id: 'voucher_hands',
    name: 'Golden Grab',
    japanese: '黄金の手筒',
    cost: 10,
    description: 'Permanently +1 Hand per round',
    icon: 'Layers'
  },
  {
    id: 'voucher_discards',
    name: 'Shadow Purge',
    japanese: '影の浄化',
    cost: 10,
    description: 'Permanently +1 Discard per round',
    icon: 'RefreshCw'
  },
  {
    id: 'voucher_discount',
    name: 'Bazaar Guild Pass',
    japanese: '闇市の通行手形',
    cost: 12,
    description: 'All shop items cost 25% less',
    icon: 'Coins'
  }
];

export const EXTENDED_SCROLLS: ScrollItem[] = [
  {
    id: 'scroll_tanyao',
    name: 'Scroll of Tanyao',
    type: 'upgrade_yaku',
    cost: 4,
    description: 'Upgrade level of All Simples (+30 Chips, +3 Mult)',
    targetYaku: 'tanyao'
  },
  {
    id: 'scroll_triplet',
    name: 'Scroll of Triplets',
    type: 'upgrade_yaku',
    cost: 4,
    description: 'Upgrade level of Triplet (Pon) hands',
    targetYaku: 'triplet_meld'
  },
  {
    id: 'scroll_flush',
    name: 'Scroll of Flush',
    type: 'upgrade_yaku',
    cost: 5,
    description: 'Upgrade level of Half & Full Flush hands',
    targetYaku: 'honitsu'
  },
  {
    id: 'tome_foil',
    name: 'Foil Talisman',
    type: 'enhance_tile',
    cost: 5,
    description: 'Turn a random hand tile into a Foil Tile (+30 Chips)',
    enhancement: 'foil'
  },
  {
    id: 'tome_gold',
    name: 'Gold Midas Touch',
    type: 'enhance_tile',
    cost: 6,
    description: 'Turn a random hand tile into a Gold Tile (+$4 on play)',
    enhancement: 'gold'
  },
  {
    id: 'tome_holo',
    name: 'Holo Rune',
    type: 'enhance_tile',
    cost: 6,
    description: 'Turn a random hand tile into a Holo Tile (+10 Mult)',
    enhancement: 'holo'
  },
  {
    id: 'gold_pouch',
    name: 'Infernal Pouch',
    type: 'gain_cash',
    cost: 4,
    description: 'Instantly gain $12 cash',
  }
];
