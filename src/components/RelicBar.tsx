import React from 'react';
import type { Relic } from '../types/game';
import { Flame, Sparkles, Coins, Wind, Shield, Zap, Skull, Swords, Anchor, Boxes, Gem } from 'lucide-react';

interface RelicBarProps {
  relics?: Relic[];
  maxRelics?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="w-5 h-5 text-rose-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-400" />,
  Coins: <Coins className="w-5 h-5 text-amber-400" />,
  Shield: <Shield className="w-5 h-5 text-cyan-400" />,
  Wind: <Wind className="w-5 h-5 text-sky-400" />,
  Zap: <Zap className="w-5 h-5 text-purple-400" />,
  Gem: <Gem className="w-5 h-5 text-emerald-400" />,
  Skull: <Skull className="w-5 h-5 text-rose-600" />,
  Swords: <Swords className="w-5 h-5 text-amber-500" />,
  Anchor: <Anchor className="w-5 h-5 text-slate-300" />,
  Boxes: <Boxes className="w-5 h-5 text-pink-400" />
};

export const RelicBar: React.FC<RelicBarProps> = ({ relics = [], maxRelics = 5 }) => {
  const safeRelics = relics || [];
  const safeMax = maxRelics || 5;

  return (
    <div className="w-full bg-stone-950/60 border-b border-stone-800/60 px-4 py-2 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold text-stone-400">RELICS ({safeRelics.length}/{safeMax}):</span>
        <div className="flex items-center gap-2">
          {Array.from({ length: safeMax }).map((_, idx) => {
            const relic = safeRelics[idx];
            return (
              <div
                key={idx}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all group relative ${
                  relic
                    ? 'bg-gradient-to-br from-stone-900 to-stone-950 border-amber-500/40 shadow-md shadow-amber-500/10'
                    : 'bg-stone-900/30 border-dashed border-stone-800'
                }`}
              >
                {relic ? (
                  <>
                    {iconMap[relic.icon] || <Sparkles className="w-5 h-5 text-amber-400" />}
                    {/* Hover Tooltip */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 bg-stone-900 border border-amber-500/40 p-2.5 rounded-xl shadow-2xl z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      <div className="text-xs font-bold text-amber-400">{relic.name}</div>
                      <div className="text-[10px] text-stone-400 font-serif italic mb-1">{relic.japanese}</div>
                      <div className="text-[11px] text-stone-200 leading-tight">{relic.description}</div>
                    </div>
                  </>
                ) : (
                  <span className="text-stone-700 text-xs font-mono">+</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
