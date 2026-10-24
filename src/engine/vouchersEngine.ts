import type { Voucher } from '../types/game';

export const ALL_VOUCHERS: Voucher[] = [
  {
    id: 'voucher_hands_1',
    name: 'Grab of Gold',
    japanese: '黄金の手筒',
    cost: 10,
    tier: 1,
    description: 'Permanently +1 Hand per round',
    icon: 'Layers'
  },
  {
    id: 'voucher_hands_2',
    name: 'Grasp of the Demon',
    japanese: '鬼神の掴み',
    cost: 15,
    tier: 2,
    requiresVoucherId: 'voucher_hands_1',
    description: 'Permanently +1 additional Hand per round',
    icon: 'Layers'
  },
  {
    id: 'voucher_discards_1',
    name: 'Shadow Purge',
    japanese: '影の浄化',
    cost: 10,
    tier: 1,
    description: 'Permanently +1 Discard per round',
    icon: 'RefreshCw'
  },
  {
    id: 'voucher_discards_2',
    name: 'Abyssal Void',
    japanese: '深淵の空隙',
    cost: 15,
    tier: 2,
    requiresVoucherId: 'voucher_discards_1',
    description: 'Permanently +1 additional Discard per round',
    icon: 'RefreshCw'
  },
  {
    id: 'voucher_discount_1',
    name: 'Bazaar Guild Pass',
    japanese: '闇市の通行手形',
    cost: 12,
    tier: 1,
    description: 'All items in the shop cost 25% less',
    icon: 'Coins'
  },
  {
    id: 'voucher_relic_slot_1',
    name: 'Hellish Pouch',
    japanese: '閻魔の袋',
    cost: 15,
    tier: 1,
    description: '+1 Maximum Relic slot (Carry up to 6 Relics)',
    icon: 'Sparkles'
  }
];

export function getAvailableVouchers(purchasedIds: string[]): Voucher[] {
  return ALL_VOUCHERS.filter((v) => {
    if (purchasedIds.includes(v.id)) return false;
    if (v.requiresVoucherId && !purchasedIds.includes(v.requiresVoucherId)) return false;
    return true;
  });
}
