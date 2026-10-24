import React from 'react';
import type { RunState } from '../types/game';
import type { Language } from '../engine/i18n';
import { t } from '../engine/i18n';
import { Flame, Coins, Trophy, RefreshCw, Layers, Volume2, VolumeX, BookOpen, History, Globe, HelpCircle } from 'lucide-react';

interface HeaderProps {
  runState: RunState;
  onToggleSound: () => void;
  onOpenYakuCodex: () => void;
  onOpenHistory: () => void;
  onOpenHowToPlay: () => void;
  onChangeLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  runState,
  onToggleSound,
  onOpenYakuCodex,
  onOpenHistory,
  onOpenHowToPlay,
  onChangeLanguage
}) => {
  const { score, currentBlind, ante, money, handsLeft, discardsLeft, soundEnabled, language } = runState;
  const progressPercent = Math.min(100, Math.floor((score / currentBlind.targetScore) * 100));

  return (
    <header className="w-full bg-stone-950/80 border-b border-rose-950/40 backdrop-blur-md px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-stone-200">
      {/* Brand & Ante */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-rose-950/60 rounded-xl border border-rose-800/40 flex items-center gap-2">
          <Flame className="w-6 h-6 text-rose-500 animate-pulse" />
          <span className="font-serif font-black text-lg md:text-xl tracking-wider text-rose-400">
            {t('title', language)}
          </span>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-1 text-xs font-mono">
          <span className="text-stone-400">{t('ante', language)} </span>
          <span className="text-amber-400 font-bold text-sm">{ante}/8</span>
        </div>
      </div>

      {/* Score Progress Bar */}
      <div className="flex-1 max-w-md bg-stone-900/90 border border-stone-800 rounded-xl p-2 flex flex-col gap-1">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-stone-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> {t('target', language)}:
          </span>
          <span className="text-stone-300 font-bold">
            {score.toLocaleString()} / <span className="text-amber-400">{currentBlind.targetScore.toLocaleString()}</span>
          </span>
        </div>
        <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
          <div
            className="h-full bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Action Controls & Badges */}
      <div className="flex items-center gap-3 text-xs md:text-sm font-mono">
        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-xl px-2 py-1">
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as Language)}
            className="bg-transparent text-xs text-stone-200 focus:outline-none cursor-pointer"
          >
            <option value="en" className="bg-stone-900">EN</option>
            <option value="ja" className="bg-stone-900">日本語</option>
            <option value="zh" className="bg-stone-900">中文</option>
          </select>
        </div>

        {/* How to Play Guide */}
        <button
          onClick={onOpenHowToPlay}
          className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-xl text-teal-400 transition-all"
          title="How to Play Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* History Log */}
        <button
          onClick={onOpenHistory}
          className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-xl text-blue-400 transition-all"
          title="Hand History Log"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Yaku Codex */}
        <button
          onClick={onOpenYakuCodex}
          className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-xl text-amber-400 transition-all"
          title="Open Yaku Codex"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-xl text-stone-300 transition-all"
          title="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>

        {/* Money */}
        <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-800/50 text-amber-300 px-3 py-1.5 rounded-xl font-bold">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>${money}</span>
        </div>

        {/* Hands */}
        <div className="flex items-center gap-1.5 bg-blue-950/40 border border-blue-800/50 text-blue-300 px-3 py-1.5 rounded-xl font-bold">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>{handsLeft}</span>
        </div>

        {/* Discards */}
        <div className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-800/50 text-rose-300 px-3 py-1.5 rounded-xl font-bold">
          <RefreshCw className="w-4 h-4 text-rose-400" />
          <span>{discardsLeft}</span>
        </div>
      </div>
    </header>
  );
};
