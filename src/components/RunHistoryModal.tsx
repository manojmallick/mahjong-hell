import React from 'react';
import type { HandEvaluation } from '../types/game';
import { History, X } from 'lucide-react';

interface RunHistoryModalProps {
  history: HandEvaluation[];
  onClose: () => void;
}

export const RunHistoryModal: React.FC<RunHistoryModalProps> = ({ history, onClose }) => {
  return (
    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/60 rounded-xl border border-blue-800/40 text-blue-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-black text-xl text-stone-200 tracking-wider">
                HAND HISTORY LOG
              </h2>
              <p className="text-xs font-mono text-stone-400">
                Breakdown of hands played in current run
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

        {history.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="bg-stone-950/60 border border-stone-800 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 font-bold">#{idx + 1}</span>
                  <span className="text-stone-200 font-bold">{item.yakuName}</span>
                  <span className="text-rose-400 font-serif">({item.yakuJapanese})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">{item.baseChips} Chips</span>
                  <span className="text-rose-400">× {item.baseMult} Mult</span>
                  <span className="text-amber-400 font-bold bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">
                    {(item.baseChips * item.baseMult).toLocaleString()} PTS
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-stone-500 font-mono text-sm">
            No hands played yet in this round.
          </div>
        )}
      </div>
    </div>
  );
};
