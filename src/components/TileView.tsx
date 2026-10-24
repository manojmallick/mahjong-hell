import React from 'react';
import type { Tile } from '../types/game';
import { Sparkles, Coins, Shield, Flame } from 'lucide-react';

interface TileViewProps {
  tile: Tile;
  isSelected?: boolean;
  onClick?: () => void;
  small?: boolean;
}

export const TileView: React.FC<TileViewProps> = ({ tile, isSelected, onClick, small }) => {
  const getSuitColor = () => {
    switch (tile.suit) {
      case 'man':
        return 'text-red-500 border-red-500/30';
      case 'pin':
        return 'text-cyan-400 border-cyan-500/30';
      case 'sou':
        return 'text-emerald-400 border-emerald-500/30';
      case 'wind':
        return 'text-amber-400 border-amber-500/30';
      case 'dragon':
        if (tile.value === 'red') return 'text-rose-500 border-rose-500/40';
        if (tile.value === 'green') return 'text-emerald-500 border-emerald-500/40';
        return 'text-slate-100 border-slate-300/40';
      default:
        return 'text-amber-200 border-amber-500/30';
    }
  };

  const getEnhancementStyle = () => {
    switch (tile.enhancement) {
      case 'foil':
        return 'bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border-indigo-400 ring-2 ring-indigo-500/50 shadow-indigo-500/30';
      case 'gold':
        return 'bg-gradient-to-tr from-amber-950 via-yellow-900 to-amber-950 border-amber-400 ring-2 ring-amber-500/50 shadow-amber-500/30';
      case 'holo':
        return 'bg-gradient-to-tr from-purple-950 via-pink-950 to-purple-950 border-pink-400 ring-2 ring-pink-500/50 shadow-pink-500/30';
      case 'glass':
        return 'bg-gradient-to-tr from-cyan-950/80 via-blue-900/60 to-cyan-950/80 border-cyan-300/60 ring-2 ring-cyan-400/40';
      case 'steel':
        return 'bg-gradient-to-tr from-slate-800 via-zinc-700 to-slate-900 border-slate-400 ring-2 ring-slate-400/50';
      default:
        return 'bg-gradient-to-b from-stone-900 to-stone-950 border-stone-700/80';
    }
  };

  const renderBadge = () => {
    switch (tile.enhancement) {
      case 'foil':
        return <Sparkles className="w-3 h-3 text-indigo-400 absolute top-1 right-1" />;
      case 'gold':
        return <Coins className="w-3 h-3 text-amber-400 absolute top-1 right-1" />;
      case 'holo':
        return <Flame className="w-3 h-3 text-pink-400 absolute top-1 right-1" />;
      case 'steel':
        return <Shield className="w-3 h-3 text-slate-300 absolute top-1 right-1" />;
      default:
        return null;
    }
  };

  const dimensions = small
    ? 'w-10 h-14 text-sm'
    : 'w-14 h-20 md:w-16 md:h-24 text-base md:text-lg';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border flex flex-col items-center justify-between p-1.5 md:p-2 cursor-pointer transition-all duration-200 select-none ${dimensions} ${getSuitColor()} ${getEnhancementStyle()} ${
        isSelected
          ? '-translate-y-4 shadow-xl ring-2 ring-amber-400 border-amber-400 scale-105'
          : 'hover:-translate-y-1 hover:shadow-lg'
      }`}
    >
      {renderBadge()}

      {/* Top Value Indicator */}
      <div className="w-full flex justify-between items-center text-[10px] md:text-xs font-bold opacity-75">
        <span>{tile.baseChips}pt</span>
      </div>

      {/* Center Kanji / Graphic */}
      <div className="flex-1 flex items-center justify-center font-serif font-black text-2xl md:text-3xl tracking-wider drop-shadow-md">
        {tile.kanji}
      </div>

      {/* Bottom Suit / Subtext */}
      <div className="text-[10px] uppercase font-mono tracking-tighter opacity-60">
        {tile.suit}
      </div>
    </div>
  );
};
