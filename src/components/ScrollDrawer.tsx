import React from 'react';
import type { ScrollItem } from '../types/game';
import { Scroll, Zap } from 'lucide-react';

interface ScrollDrawerProps {
  heldScrolls?: ScrollItem[];
  maxHeldScrolls?: number;
  onUseScroll: (scroll: ScrollItem) => void;
}

export const ScrollDrawer: React.FC<ScrollDrawerProps> = ({
  heldScrolls = [],
  maxHeldScrolls = 2,
  onUseScroll
}) => {
  const safeScrolls = heldScrolls || [];
  const safeMax = maxHeldScrolls || 2;

  return (
    <div className="flex items-center gap-2 bg-stone-950/60 border border-stone-800/80 rounded-2xl px-3 py-1.5">
      <span className="text-[11px] font-mono font-bold text-stone-400 flex items-center gap-1">
        <Scroll className="w-3.5 h-3.5 text-teal-400" /> SCROLLS ({safeScrolls.length}/{safeMax}):
      </span>
      <div className="flex items-center gap-2">
        {Array.from({ length: safeMax }).map((_, idx) => {
          const scroll = safeScrolls[idx];
          return (
            <div
              key={idx}
              className={`px-3 py-1 rounded-xl border flex items-center gap-2 text-xs font-mono transition-all ${
                scroll
                  ? 'bg-stone-900 border-teal-500/50 text-teal-300 shadow-md'
                  : 'bg-stone-950/40 border-dashed border-stone-800 text-stone-700'
              }`}
            >
              {scroll ? (
                <>
                  <span>{scroll.name}</span>
                  <button
                    onClick={() => onUseScroll(scroll)}
                    className="bg-teal-600 hover:bg-teal-500 text-stone-950 px-2 py-0.5 rounded-lg font-bold text-[10px] flex items-center gap-0.5"
                  >
                    <Zap className="w-3 h-3" /> USE
                  </button>
                </>
              ) : (
                <span className="text-[10px] uppercase">EMPTY</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
