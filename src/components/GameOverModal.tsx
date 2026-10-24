import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../engine/audio';
import { Skull, Trophy, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  targetScore: number;
  ante: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  targetScore,
  ante,
  onRestart
}) => {
  useEffect(() => {
    soundEngine.playGameLoss();
  }, []);

  return (
    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-md bg-stone-900 border border-rose-900/60 rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center gap-4">
        <div className="p-4 bg-rose-950/60 rounded-full border border-rose-600/40 text-rose-500 animate-bounce">
          <Skull className="w-12 h-12" />
        </div>
        <h2 className="font-serif font-black text-3xl text-rose-500 tracking-wider">
          RUN CONSUMED BY HELL
        </h2>
        <p className="text-xs font-mono text-stone-400">
          You failed to reach the blind score target.
        </p>

        <div className="w-full bg-stone-950/60 border border-stone-800 rounded-2xl p-4 flex flex-col gap-2 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-stone-400">FINAL ANTE REACHED:</span>
            <span className="text-amber-400 font-bold">ANTE {ante}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">SCORE ACHIEVED:</span>
            <span className="text-rose-400 font-bold">{score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">TARGET REQUIRED:</span>
            <span className="text-stone-300 font-bold">{targetScore.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-stone-950 font-mono font-black py-3 rounded-2xl shadow-xl transition-all active:scale-95 mt-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>TRY AGAIN</span>
        </button>
      </div>
    </div>
  );
};

interface VictoryModalProps {
  score: number;
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ score, onRestart }) => {
  useEffect(() => {
    soundEngine.playWinFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-md bg-stone-900 border border-amber-500/60 rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center gap-4">
        <div className="p-4 bg-amber-950/60 rounded-full border border-amber-500/40 text-amber-400 animate-pulse">
          <Trophy className="w-12 h-12" />
        </div>
        <h2 className="font-serif font-black text-3xl text-amber-300 tracking-wider">
          HELL CONQUERED!
        </h2>
        <p className="text-xs font-mono text-stone-400">
          You defeated all 8 Antes and emerged victorious!
        </p>

        <div className="w-full bg-stone-950/60 border border-stone-800 rounded-2xl p-4 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-stone-400">TOTAL SCORE ACCUMULATED:</span>
            <span className="text-amber-400 font-bold">{score.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-mono font-black py-3 rounded-2xl shadow-xl transition-all active:scale-95 mt-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>START NEW RUN</span>
        </button>
      </div>
    </div>
  );
};
