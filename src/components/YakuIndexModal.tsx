import React from 'react';
import type { YakuLevel, YakuType } from '../types/game';
import { BookOpen, X, Sparkles } from 'lucide-react';

interface YakuIndexModalProps {
  yakuLevels: Record<YakuType, YakuLevel>;
  onClose: () => void;
}

export const YakuIndexModal: React.FC<YakuIndexModalProps> = ({ yakuLevels, onClose }) => {
  return (
    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-950/60 rounded-xl border border-rose-800/40 text-rose-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-black text-xl text-stone-200 tracking-wider">
                YAKU HAND CODEX
              </h2>
              <p className="text-xs font-mono text-stone-400">
                Guide to all Mahjong scoring combinations & base Chips × Mult
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

        {/* Yaku List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.keys(yakuLevels) as YakuType[]).map((key) => {
            const yaku = yakuLevels[key];
            return (
              <div
                key={key}
                className="bg-stone-950/60 border border-stone-800 p-3.5 rounded-2xl flex flex-col justify-between gap-1.5"
              >
                <div className="flex justify-between items-center">
                  <div className="font-bold text-stone-200 text-sm">{yaku.name}</div>
                  <span className="font-serif font-black text-rose-400 text-sm">{yaku.japanese}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> LVL {yaku.level}
                  </span>
                  <span className="text-stone-300 font-bold bg-stone-900 border border-stone-800 px-2 py-0.5 rounded-lg">
                    {yaku.baseChips} Chips × {yaku.baseMult} Mult
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
