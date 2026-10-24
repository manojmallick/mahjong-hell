import React from 'react';
import type { RunState, Tile, HandEvaluation, ScrollItem } from '../types/game';
import { t } from '../engine/i18n';
import { TileView } from './TileView';
import { ScrollDrawer } from './ScrollDrawer';
import { soundEngine } from '../engine/audio';
import { ArrowUpDown, Play, Trash2, ShieldAlert, Sparkles, Flame } from 'lucide-react';

interface GameBoardProps {
  runState: RunState;
  selectedHandEval: HandEvaluation;
  onTileClick: (tile: Tile) => void;
  onPlayHand: () => void;
  onDiscard: () => void;
  onSortHand: () => void;
  onUseScroll: (scroll: ScrollItem) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  runState,
  selectedHandEval,
  onTileClick,
  onPlayHand,
  onDiscard,
  onSortHand,
  onUseScroll
}) => {
  const { hand, selectedTileIds, currentBlind, handsLeft, discardsLeft, heldScrolls, maxHeldScrolls, doraIndicator, language } = runState;
  const selectedTiles = hand.filter((t) => selectedTileIds.includes(t.id));

  const calculatedChips = selectedHandEval.baseChips + selectedTiles.reduce((acc, t) => acc + t.baseChips, 0);
  const calculatedMult = selectedHandEval.baseMult + selectedTiles.reduce((acc, t) => acc + t.bonusMult, 0);
  const estimatedScore = calculatedChips * calculatedMult;

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-4 max-w-5xl mx-auto w-full gap-4">
      {/* Top Controls: Blind Target, Dora Indicator & Scroll Drawer */}
      <div className="w-full flex flex-wrap items-center justify-between bg-stone-900/60 border border-stone-800/80 rounded-2xl px-4 py-2.5 gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl text-xs font-mono font-bold ${
            currentBlind.type === 'boss'
              ? 'bg-rose-950 border border-rose-600 text-rose-300 animate-pulse'
              : 'bg-stone-800 text-amber-400'
          }`}>
            {currentBlind.name.toUpperCase()}
          </div>
          {currentBlind.bossDebuff && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>{t('debuff', language)}: {currentBlind.bossDebuff}</span>
            </div>
          )}
        </div>

        {/* Dora Indicator Banner */}
        {doraIndicator && (
          <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-500/40 rounded-xl px-3 py-1 text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-stone-400 text-[11px] font-bold">{t('dora', language)}:</span>
            <span className="text-amber-300 font-serif font-black text-sm">{doraIndicator.kanji}</span>
          </div>
        )}

        {/* Scroll Drawer */}
        <ScrollDrawer
          heldScrolls={heldScrolls}
          maxHeldScrolls={maxHeldScrolls}
          onUseScroll={onUseScroll}
        />

        <div className="text-xs font-mono text-stone-400">
          Tiles selected: <span className="text-amber-400 font-bold">{selectedTileIds.length}/14</span>
        </div>
      </div>

      {/* Hand Evaluation & Score Preview Card */}
      <div className="w-full max-w-xl bg-gradient-to-r from-stone-900 via-rose-950/40 to-stone-900 border border-rose-900/50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden min-h-[110px]">
        {selectedTileIds.length > 0 ? (
          <div className="flex flex-col items-center gap-1.5 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-serif font-bold text-lg md:text-xl text-rose-300">
                {selectedHandEval.yakuName} ({selectedHandEval.yakuJapanese})
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono font-black text-xl md:text-2xl">
              <span className="text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-xl border border-cyan-800/50">
                {calculatedChips} CHIPS
              </span>
              <span className="text-rose-500 font-serif">×</span>
              <span className="text-rose-400 bg-rose-950/60 px-3 py-1 rounded-xl border border-rose-800/50">
                {calculatedMult} MULT
              </span>
              <span className="text-stone-400 font-normal text-lg">=</span>
              <span className="text-amber-400 font-bold bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/50">
                {estimatedScore.toLocaleString()} PTS
              </span>
            </div>
          </div>
        ) : (
          <div className="text-stone-500 font-mono text-sm tracking-widest uppercase flex items-center gap-2">
            Select Mahjong Tiles to Evaluate Hand
          </div>
        )}
      </div>

      {/* Tiles Hand Arena */}
      <div className="w-full flex-1 flex flex-wrap items-center justify-center gap-2 md:gap-3 p-4 bg-stone-950/40 border border-stone-800/40 rounded-3xl min-h-[180px]">
        {hand.map((tile) => (
          <TileView
            key={tile.id}
            tile={tile}
            isSelected={selectedTileIds.includes(tile.id)}
            onClick={() => {
              soundEngine.playTileClick();
              onTileClick(tile);
            }}
          />
        ))}
      </div>

      {/* Control Buttons Bar */}
      <div className="w-full flex items-center justify-center gap-4 py-2">
        <button
          onClick={onSortHand}
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 font-mono text-sm px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
        >
          <ArrowUpDown className="w-4 h-4 text-sky-400" />
          <span>{t('sortDeck', language)}</span>
        </button>

        <button
          onClick={onDiscard}
          disabled={selectedTileIds.length === 0 || discardsLeft <= 0}
          className="flex items-center gap-2 bg-rose-950 hover:bg-rose-900 disabled:opacity-40 disabled:hover:bg-rose-950 text-rose-200 border border-rose-700 font-mono font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-rose-950/50 active:scale-95"
        >
          <Trash2 className="w-4 h-4 text-rose-400" />
          <span>{t('discard', language)} ({discardsLeft})</span>
        </button>

        <button
          onClick={onPlayHand}
          disabled={selectedTileIds.length === 0 || handsLeft <= 0}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-stone-950 font-mono font-black text-sm md:text-base px-8 py-2.5 rounded-xl transition-all shadow-xl shadow-emerald-900/30 active:scale-95"
        >
          <Play className="w-4 h-4 fill-stone-950" />
          <span>{t('playHand', language)} ({handsLeft})</span>
        </button>
      </div>
    </div>
  );
};
