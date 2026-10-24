import React, { useState } from 'react';
import type { RunState, Relic, ScrollItem, YakuType, Voucher } from '../types/game';
import { ALL_RELICS, ALL_SCROLLS } from '../engine/relics';
import { getAvailableVouchers } from '../engine/vouchersEngine';
import { soundEngine } from '../engine/audio';
import { ShoppingBag, ArrowRight, RefreshCw, Sparkles, ChevronUp, Coins, ShieldAlert } from 'lucide-react';

interface ShopModalProps {
  runState: RunState;
  onBuyRelic: (relic: Relic) => void;
  onBuyScroll: (scroll: ScrollItem) => void;
  onBuyVoucher: (voucher: Voucher) => void;
  onUpgradeYaku: (yakuKey: YakuType, cost: number) => void;
  onNextRound: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  runState,
  onBuyRelic,
  onBuyScroll,
  onBuyVoucher,
  onUpgradeYaku,
  onNextRound
}) => {
  const { money, relics, maxRelics, yakuLevels, purchasedVouchers } = runState;

  const [shopRelics, setShopRelics] = useState<Relic[]>(() => {
    const unowned = ALL_RELICS.filter((r) => !relics.some((owned) => owned.id === r.id));
    return unowned.sort(() => 0.5 - Math.random()).slice(0, 2);
  });

  const [shopScrolls, setShopScrolls] = useState<ScrollItem[]>(() => {
    return [...ALL_SCROLLS].sort(() => 0.5 - Math.random()).slice(0, 2);
  });

  const availableVouchers = getAvailableVouchers(purchasedVouchers);

  const handleReroll = () => {
    if (money < 5) return;
    soundEngine.playBuySound();
    const unowned = ALL_RELICS.filter((r) => !relics.some((owned) => owned.id === r.id));
    setShopRelics(unowned.sort(() => 0.5 - Math.random()).slice(0, 2));
    setShopScrolls([...ALL_SCROLLS].sort(() => 0.5 - Math.random()).slice(0, 2));
  };

  return (
    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Shop Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-950/60 rounded-2xl border border-amber-800/40">
              <ShoppingBag className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="font-serif font-black text-2xl text-amber-300 tracking-wider">
                HELLISH BAZAAR
              </h2>
              <p className="text-xs font-mono text-stone-400">
                Purchase Relics, Vouchers, Scrolls, and upgrade Yaku levels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-800/60 px-4 py-2 rounded-2xl font-mono font-bold text-amber-300 text-lg">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>${money}</span>
            </div>

            <button
              onClick={handleReroll}
              disabled={money < 5}
              className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 font-mono text-xs px-3.5 py-2 rounded-xl border border-stone-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>REROLL ($5)</span>
            </button>
          </div>
        </div>

        {/* Section 1: Relics for Sale */}
        <div>
          <h3 className="text-xs font-mono font-bold text-stone-400 tracking-widest uppercase mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> PASSIVE RELICS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shopRelics.map((relic) => {
              const canAfford = money >= relic.cost && relics.length < maxRelics;
              return (
                <div
                  key={relic.id}
                  className="bg-stone-950/60 border border-amber-500/20 hover:border-amber-500/50 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all"
                >
                  <div>
                    <div className="font-bold text-amber-300">{relic.name}</div>
                    <div className="text-xs text-stone-400 font-serif italic mb-1">{relic.japanese}</div>
                    <div className="text-xs text-stone-300">{relic.description}</div>
                  </div>
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      soundEngine.playBuySound();
                      onBuyRelic(relic);
                      setShopRelics(shopRelics.filter((r) => r.id !== relic.id));
                    }}
                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-stone-950 font-mono font-bold text-xs px-4 py-2.5 rounded-xl whitespace-nowrap transition-all shadow-md"
                  >
                    BUY (${relic.cost})
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Vouchers */}
        {availableVouchers.length > 0 && (
          <div>
            <h3 className="text-xs font-mono font-bold text-stone-400 tracking-widest uppercase mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" /> RUN VOUCHERS (PERMANENT UPGRADES)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableVouchers.slice(0, 2).map((voucher) => {
                const canAfford = money >= voucher.cost;
                return (
                  <div
                    key={voucher.id}
                    className="bg-stone-950/60 border border-purple-500/30 hover:border-purple-500/60 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all"
                  >
                    <div>
                      <div className="font-bold text-purple-300">{voucher.name}</div>
                      <div className="text-xs text-stone-400 font-serif italic mb-1">{voucher.japanese}</div>
                      <div className="text-xs text-stone-300">{voucher.description}</div>
                    </div>
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        soundEngine.playBuySound();
                        onBuyVoucher(voucher);
                      }}
                      className="bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-stone-100 font-mono font-bold text-xs px-4 py-2.5 rounded-xl whitespace-nowrap transition-all shadow-md"
                    >
                      BUY (${voucher.cost})
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 3: Consumables & Scrolls */}
        <div>
          <h3 className="text-xs font-mono font-bold text-stone-400 tracking-widest uppercase mb-3">
            SCROLLS & CONSUMABLES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shopScrolls.map((scroll) => {
              const canAfford = money >= scroll.cost;
              return (
                <div
                  key={scroll.id}
                  className="bg-stone-950/60 border border-stone-800 hover:border-stone-700 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all"
                >
                  <div>
                    <div className="font-bold text-stone-200">{scroll.name}</div>
                    <div className="text-xs text-stone-400 mt-1">{scroll.description}</div>
                  </div>
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      soundEngine.playBuySound();
                      onBuyScroll(scroll);
                      setShopScrolls(shopScrolls.filter((s) => s.id !== scroll.id));
                    }}
                    className="bg-teal-600 hover:bg-teal-500 disabled:opacity-30 text-stone-950 font-mono font-bold text-xs px-4 py-2.5 rounded-xl whitespace-nowrap transition-all shadow-md"
                  >
                    BUY (${scroll.cost})
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Yaku Level Upgrades */}
        <div>
          <h3 className="text-xs font-mono font-bold text-stone-400 tracking-widest uppercase mb-3">
            UPGRADE YAKU HANDS
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(Object.keys(yakuLevels) as YakuType[]).slice(0, 8).map((yakuKey) => {
              const info = yakuLevels[yakuKey];
              const cost = 4 + info.level * 2;
              const canAfford = money >= cost;

              return (
                <div
                  key={yakuKey}
                  className="bg-stone-950/40 border border-stone-800 p-3 rounded-xl flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-stone-200 truncate">{info.name}</div>
                    <div className="text-[10px] text-stone-400 font-serif">{info.japanese}</div>
                    <div className="text-[11px] text-amber-400 font-mono mt-1">
                      LVL {info.level} ({info.baseChips}pt / ×{info.baseMult})
                    </div>
                  </div>
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      soundEngine.playBuySound();
                      onUpgradeYaku(yakuKey, cost);
                    }}
                    className="w-full flex items-center justify-center gap-1 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-200 font-mono text-[11px] font-bold py-1.5 rounded-lg border border-stone-700 transition-all"
                  >
                    <ChevronUp className="w-3 h-3 text-emerald-400" />
                    <span>LVL UP (${cost})</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Next Round */}
        <div className="pt-2 border-t border-stone-800 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playMeldSound();
              onNextRound();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-stone-950 font-mono font-black text-sm px-8 py-3 rounded-2xl shadow-xl transition-all active:scale-95"
          >
            <span>NEXT BLIND</span>
            <ArrowRight className="w-5 h-5 fill-stone-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
