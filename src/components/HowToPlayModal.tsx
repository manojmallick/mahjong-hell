import React, { useState } from 'react';
import type { Language } from '../engine/i18n';
import { HelpCircle, X, Layers, Flame, Coins, Sparkles, Trophy } from 'lucide-react';

interface HowToPlayModalProps {
  language: Language;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ language, onClose }) => {
  const [tab, setTab] = useState<'basics' | 'scoring' | 'relics' | 'dora'>('basics');

  return (
    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto text-stone-200 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-950/60 rounded-xl border border-amber-800/40 text-amber-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-black text-xl text-stone-200 tracking-wider">
                {language === 'ja' ? '遊び方ガイド' : language === 'zh' ? '玩法指南' : 'HOW TO PLAY GUIDE'}
              </h2>
              <p className="text-xs font-mono text-stone-400">
                {language === 'ja'
                  ? '麻雀ヘルの基本ルール、得点計算、レリックと巻物'
                  : language === 'zh'
                  ? '麻将地狱的基础规则、算分机制与宝物用法'
                  : 'Rules, Chips × Mult scoring, Relic synergies & Dora bonuses'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-stone-800 hover:bg-stone-700 rounded-xl text-stone-400 hover:text-stone-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-800/60 pb-2 text-xs font-mono">
          <button
            onClick={() => setTab('basics')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              tab === 'basics'
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 font-bold'
                : 'bg-stone-950/40 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            🀄 BASICS
          </button>
          <button
            onClick={() => setTab('scoring')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              tab === 'scoring'
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 font-bold'
                : 'bg-stone-950/40 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            🧮 SCORING
          </button>
          <button
            onClick={() => setTab('relics')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              tab === 'relics'
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 font-bold'
                : 'bg-stone-950/40 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            🃏 RELICS & VOUCHERS
          </button>
          <button
            onClick={() => setTab('dora')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              tab === 'dora'
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 font-bold'
                : 'bg-stone-950/40 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            🀅 DORA & SCROLLS
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 text-sm text-stone-300 space-y-4 leading-relaxed font-mono">
          {tab === 'basics' && (
            <div className="space-y-3">
              <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-2xl flex items-start gap-3">
                <Layers className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-100 text-sm">1. Draw & Form Mahjong Melds</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    You start each round with 14 tiles. Click tiles in your hand to select them. Form valid Mahjong combinations:
                    Chi (Sequences like 1-2-3), Pon (Triplets like 5-5-5), Kan (Quads), or Pairs.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-2xl flex items-start gap-3">
                <Trophy className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-100 text-sm">2. Beat Target Score to Progress</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Each round has a Target Score (Blind). You have a limited number of <strong>HANDS</strong> (plays) and <strong>DISCARDS</strong> to reach the target before running out!
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === 'scoring' && (
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-stone-950 to-stone-900 border border-rose-900/60 rounded-2xl text-center">
                <span className="text-xs font-bold text-stone-400 block mb-1">THE BALATRO SCORING FORMULA</span>
                <span className="text-lg font-black text-rose-300 font-mono">
                  (Tile Chips + Yaku Base Chips) × (Yaku Mult + Relic Mult) = TOTAL SCORE
                </span>
              </div>
              <ul className="text-xs text-stone-400 space-y-2 list-disc pl-4">
                <li><strong>Tile Chips:</strong> Each played tile contributes base chips based on its suit number or honor value.</li>
                <li><strong>Yaku Base Values:</strong> Playing rare Yaku combinations (Tanyao, Full Flush, Seven Pairs, 13 Orphans) gives massive base Chips and Mult multipliers.</li>
                <li><strong>Yaku Leveling:</strong> Buy level upgrades in the shop to increase base Chips and Mult permanently for specific hands.</li>
              </ul>
            </div>
          )}

          {tab === 'relics' && (
            <div className="space-y-3">
              <div className="p-3 bg-stone-950/60 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-300 text-sm">Passive Relics (Jokers)</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Equip up to 5 Relics in the shop. Relics trigger passive effects on hand play, tile scoring, or discards (e.g. +35 Mult on every hand, +$3 on discards, x2.0 Mult on Flushes).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-stone-950/60 border border-purple-500/30 rounded-2xl flex items-start gap-3">
                <Coins className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-purple-300 text-sm">Run Vouchers</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Buy permanent Vouchers in the shop to permanently add +1 Hand, +1 Discard, or reduce shop prices by 25%.
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === 'dora' && (
            <div className="space-y-3">
              <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-2xl flex items-start gap-3">
                <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-100 text-sm">Dora Indicator Tile</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    The face-up Dora Indicator tile at the top reveals the round's lucky tile. Played tiles matching the Dora sequence earn <strong>+20 Chips & +3 Mult</strong> bonus!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-stone-950/60 border border-teal-500/30 rounded-2xl">
                <h4 className="font-bold text-teal-300 text-sm">Scroll Enhancements</h4>
                <p className="text-xs text-stone-400 mt-1">
                  Hold Scrolls in your hand drawer and use them mid-game to enchant tiles:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                  <span className="bg-stone-900 border border-indigo-500/40 p-1.5 rounded-lg text-indigo-300">✨ Foil: +30 Chips</span>
                  <span className="bg-stone-900 border border-pink-500/40 p-1.5 rounded-lg text-pink-300">🔥 Holo: +10 Mult</span>
                  <span className="bg-stone-900 border border-amber-500/40 p-1.5 rounded-lg text-amber-300">🪙 Gold: +$4 Cash</span>
                  <span className="bg-stone-900 border border-slate-500/40 p-1.5 rounded-lg text-slate-300">🛡️ Steel: +1.5 Mult</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
