import { useState, useMemo, useEffect } from 'react';
import type { RunState, Tile, HandEvaluation, Relic, ScrollItem, YakuType, Voucher } from './types/game';
import type { Language } from './engine/i18n';
import { createMahjongDeckWithDora, sortTiles, evaluatePlayedHand, EXPANDED_YAKU_LEVELS } from './engine/mahjongEngine';
import { isTileDoraMatch } from './engine/doraEngine';
import { saveRunState, loadRunState, clearRunState } from './engine/stateMachine';
import { loadCareerStats, updateCareerStats } from './engine/statsEngine';
import { getBlindForAnte } from './engine/blinds';
import { Header } from './components/Header';
import { RelicBar } from './components/RelicBar';
import { GameBoard } from './components/GameBoard';
import { ShopModal } from './components/ShopModal';
import { YakuIndexModal } from './components/YakuIndexModal';
import { RunHistoryModal } from './components/RunHistoryModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GameOverModal, VictoryModal } from './components/GameOverModal';
import { soundEngine } from './engine/audio';

export function App() {
  const [showYakuCodex, setShowYakuCodex] = useState(false);
  const [showRunHistory, setShowRunHistory] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Initialize run state
  const [runState, setRunState] = useState<RunState>(() => {
    const saved = loadRunState();
    if (saved) return saved;

    const deck = createMahjongDeckWithDora();
    const initialHand = deck.slice(0, 14);
    const doraIndicator = deck[14];
    const remainingDeck = deck.slice(15);
    const initialBlind = getBlindForAnte(1, 1);
    const initialStats = loadCareerStats();

    return {
      ante: 1,
      roundInAnte: 1,
      currentBlind: initialBlind,
      score: 0,
      handsLeft: 4,
      discardsLeft: 4,
      maxHands: 4,
      maxDiscards: 4,
      money: 10,
      relics: [],
      maxRelics: 5,
      heldScrolls: [],
      maxHeldScrolls: 2,
      purchasedVouchers: [],
      deck: remainingDeck,
      hand: initialHand,
      doraIndicator,
      selectedTileIds: [],
      playedHandsHistory: [],
      yakuLevels: { ...EXPANDED_YAKU_LEVELS },
      inShop: false,
      gameStatus: 'playing',
      soundEnabled: true,
      language: 'en',
      stats: initialStats
    };
  });

  useEffect(() => {
    soundEngine.setMuted(!runState.soundEnabled);
    saveRunState(runState);
  }, [runState]);

  const { hand, selectedTileIds, yakuLevels, doraIndicator } = runState;

  const selectedTiles = useMemo(
    () => hand.filter((t) => selectedTileIds.includes(t.id)),
    [hand, selectedTileIds]
  );

  const currentHandEval = useMemo<HandEvaluation>(
    () => evaluatePlayedHand(selectedTiles, yakuLevels),
    [selectedTiles, yakuLevels]
  );

  const handleToggleSound = () => {
    setRunState((prev) => {
      const nextSound = !prev.soundEnabled;
      soundEngine.setMuted(!nextSound);
      return { ...prev, soundEnabled: nextSound };
    });
  };

  const handleChangeLanguage = (lang: Language) => {
    setRunState((prev) => ({ ...prev, language: lang }));
  };

  const handleTileClick = (tile: Tile) => {
    setRunState((prev) => {
      const isSelected = prev.selectedTileIds.includes(tile.id);
      let newSelected: string[];

      if (isSelected) {
        newSelected = prev.selectedTileIds.filter((id) => id !== tile.id);
      } else {
        if (prev.selectedTileIds.length >= 14) return prev;
        newSelected = [...prev.selectedTileIds, tile.id];
      }

      return { ...prev, selectedTileIds: newSelected };
    });
  };

  const handleSortHand = () => {
    if (runState.soundEnabled) soundEngine.playTileClick();
    setRunState((prev) => ({
      ...prev,
      hand: sortTiles(prev.hand)
    }));
  };

  const handleDiscard = () => {
    if (selectedTileIds.length === 0 || runState.discardsLeft <= 0) return;

    if (runState.soundEnabled) soundEngine.playScorePop();

    setRunState((prev) => {
      const remainingHand = prev.hand.filter((t) => !prev.selectedTileIds.includes(t.id));
      const drawCount = prev.selectedTileIds.length;

      const drawnTiles = prev.deck.slice(0, drawCount);
      const newDeck = prev.deck.slice(drawCount);

      let bonusMoney = 0;
      prev.relics.forEach((r) => {
        if (r.onDiscard) {
          const res = r.onDiscard(selectedTiles);
          if (res.dollars) bonusMoney += res.dollars;
        }
      });

      const updatedStats = updateCareerStats(undefined, prev.ante, false, true);

      return {
        ...prev,
        discardsLeft: prev.discardsLeft - 1,
        hand: [...remainingHand, ...drawnTiles],
        deck: newDeck,
        selectedTileIds: [],
        money: prev.money + bonusMoney,
        stats: updatedStats
      };
    });
  };

  const handlePlayHand = () => {
    if (selectedTileIds.length === 0 || runState.handsLeft <= 0) return;

    if (runState.soundEnabled) soundEngine.playMeldSound();

    let finalChips = currentHandEval.baseChips;
    let finalMult = currentHandEval.baseMult;
    let bonusDollars = 0;
    let xMult = 1.0;

    selectedTiles.forEach((tile) => {
      finalChips += tile.baseChips;
      finalMult += tile.bonusMult;

      if (tile.enhancement === 'foil') finalChips += 30;
      if (tile.enhancement === 'holo') finalMult += 10;
      if (tile.enhancement === 'gold') bonusDollars += 4;

      if (isTileDoraMatch(tile, doraIndicator)) {
        finalChips += 20;
        finalMult += 3;
      }

      runState.relics.forEach((r) => {
        if (r.onTileScore) {
          const res = r.onTileScore(tile, currentHandEval);
          if (res.chips) finalChips += res.chips;
          if (res.mult) finalMult += res.mult;
          if (res.dollars) bonusDollars += res.dollars;
        }
      });
    });

    runState.relics.forEach((r) => {
      if (r.onHandPlayed) {
        const res = r.onHandPlayed(currentHandEval, runState);
        if (res.chips) finalChips += res.chips;
        if (res.mult) finalMult += res.mult;
        if (res.xMult) xMult *= res.xMult;
        if (res.dollars) bonusDollars += res.dollars;
      }
    });

    const handScore = Math.floor(finalChips * (finalMult * xMult));
    const newScore = runState.score + handScore;
    const newHandsLeft = runState.handsLeft - 1;

    setRunState((prev) => {
      const remainingHand = prev.hand.filter((t) => !prev.selectedTileIds.includes(t.id));
      const drawCount = prev.selectedTileIds.length;
      const drawnTiles = prev.deck.slice(0, drawCount);
      const newDeck = prev.deck.slice(drawCount);

      const targetMet = newScore >= prev.currentBlind.targetScore;

      let nextStatus: RunState['gameStatus'] = 'playing';
      let enterShop = false;

      if (targetMet) {
        if (prev.soundEnabled) soundEngine.playWinFanfare();
        enterShop = true;
      } else if (newHandsLeft <= 0) {
        nextStatus = 'game_over';
      }

      const updatedStats = updateCareerStats(handScore, prev.ante, true, false, targetMet && prev.ante === 8);

      return {
        ...prev,
        score: newScore,
        handsLeft: newHandsLeft,
        money: Math.max(0, prev.money + bonusDollars),
        hand: [...remainingHand, ...drawnTiles],
        deck: newDeck,
        selectedTileIds: [],
        playedHandsHistory: [...prev.playedHandsHistory, currentHandEval],
        inShop: enterShop,
        gameStatus: nextStatus,
        stats: updatedStats
      };
    });
  };

  const handleBuyRelic = (relic: Relic) => {
    if (runState.money < relic.cost || runState.relics.length >= runState.maxRelics) return;
    setRunState((prev) => ({
      ...prev,
      money: prev.money - relic.cost,
      relics: [...prev.relics, relic]
    }));
  };

  const handleBuyScroll = (scroll: ScrollItem) => {
    if (runState.money < scroll.cost || runState.heldScrolls.length >= runState.maxHeldScrolls) return;

    setRunState((prev) => ({
      ...prev,
      money: prev.money - scroll.cost,
      heldScrolls: [...prev.heldScrolls, scroll]
    }));
  };

  const handleUseScroll = (scroll: ScrollItem) => {
    setRunState((prev) => {
      let updatedMoney = prev.money;
      let updatedYaku = { ...prev.yakuLevels };
      let updatedHand = [...prev.hand];

      if (scroll.type === 'upgrade_yaku' && scroll.targetYaku) {
        const key = scroll.targetYaku;
        updatedYaku[key] = {
          ...updatedYaku[key],
          level: updatedYaku[key].level + 1
        };
      } else if (scroll.type === 'enhance_tile' && scroll.enhancement) {
        const randIdx = Math.floor(Math.random() * updatedHand.length);
        updatedHand[randIdx] = {
          ...updatedHand[randIdx],
          enhancement: scroll.enhancement
        };
      } else if (scroll.type === 'gain_cash') {
        updatedMoney += 12;
      }

      return {
        ...prev,
        money: updatedMoney,
        yakuLevels: updatedYaku,
        hand: updatedHand,
        heldScrolls: prev.heldScrolls.filter((s) => s.id !== scroll.id)
      };
    });
  };

  const handleBuyVoucher = (voucher: Voucher) => {
    if (runState.money < voucher.cost || runState.purchasedVouchers.includes(voucher.id)) return;

    setRunState((prev) => {
      let extraHands = prev.maxHands;
      let extraDiscards = prev.maxDiscards;
      let extraRelicSlots = prev.maxRelics;

      if (voucher.id === 'voucher_hands_1' || voucher.id === 'voucher_hands_2') extraHands += 1;
      if (voucher.id === 'voucher_discards_1' || voucher.id === 'voucher_discards_2') extraDiscards += 1;
      if (voucher.id === 'voucher_relic_slot_1') extraRelicSlots += 1;

      return {
        ...prev,
        money: prev.money - voucher.cost,
        purchasedVouchers: [...prev.purchasedVouchers, voucher.id],
        maxHands: extraHands,
        maxDiscards: extraDiscards,
        maxRelics: extraRelicSlots
      };
    });
  };

  const handleUpgradeYaku = (yakuKey: YakuType, cost: number) => {
    if (runState.money < cost) return;
    setRunState((prev) => ({
      ...prev,
      money: prev.money - cost,
      yakuLevels: {
        ...prev.yakuLevels,
        [yakuKey]: {
          ...prev.yakuLevels[yakuKey],
          level: prev.yakuLevels[yakuKey].level + 1
        }
      }
    }));
  };

  const handleNextRound = () => {
    setRunState((prev) => {
      let nextRound = prev.roundInAnte + 1;
      let nextAnte = prev.ante;

      if (nextRound > 3) {
        nextRound = 1;
        nextAnte += 1;
      }

      if (nextAnte > 8) {
        return { ...prev, gameStatus: 'victory', inShop: false };
      }

      const nextBlind = getBlindForAnte(nextAnte, nextRound);
      const fullDeck = createMahjongDeckWithDora();
      const newDora = fullDeck[14];

      return {
        ...prev,
        ante: nextAnte,
        roundInAnte: nextRound,
        currentBlind: nextBlind,
        score: 0,
        handsLeft: prev.maxHands,
        discardsLeft: prev.maxDiscards,
        hand: fullDeck.slice(0, 14),
        doraIndicator: newDora,
        deck: fullDeck.slice(15),
        selectedTileIds: [],
        inShop: false,
        gameStatus: 'playing'
      };
    });
  };

  const handleRestart = () => {
    clearRunState();
    const fullDeck = createMahjongDeckWithDora();
    const careerStats = loadCareerStats();

    setRunState({
      ante: 1,
      roundInAnte: 1,
      currentBlind: getBlindForAnte(1, 1),
      score: 0,
      handsLeft: 4,
      discardsLeft: 4,
      maxHands: 4,
      maxDiscards: 4,
      money: 10,
      relics: [],
      maxRelics: 5,
      heldScrolls: [],
      maxHeldScrolls: 2,
      purchasedVouchers: [],
      doraIndicator: fullDeck[14],
      deck: fullDeck.slice(15),
      hand: fullDeck.slice(0, 14),
      selectedTileIds: [],
      playedHandsHistory: [],
      yakuLevels: { ...EXPANDED_YAKU_LEVELS },
      inShop: false,
      gameStatus: 'playing',
      soundEnabled: true,
      language: 'en',
      stats: careerStats
    });
  };

  return (
    <div className="w-full min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans select-none overflow-x-hidden">
      <Header
        runState={runState}
        onToggleSound={handleToggleSound}
        onOpenYakuCodex={() => setShowYakuCodex(true)}
        onOpenHistory={() => setShowRunHistory(true)}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onChangeLanguage={handleChangeLanguage}
      />

      <RelicBar relics={runState.relics} maxRelics={runState.maxRelics} />

      <GameBoard
        runState={runState}
        selectedHandEval={currentHandEval}
        onTileClick={handleTileClick}
        onPlayHand={handlePlayHand}
        onDiscard={handleDiscard}
        onSortHand={handleSortHand}
        onUseScroll={handleUseScroll}
      />

      {runState.inShop && (
        <ShopModal
          runState={runState}
          onBuyRelic={handleBuyRelic}
          onBuyScroll={handleBuyScroll}
          onBuyVoucher={handleBuyVoucher}
          onUpgradeYaku={handleUpgradeYaku}
          onNextRound={handleNextRound}
        />
      )}

      {showYakuCodex && (
        <YakuIndexModal
          yakuLevels={runState.yakuLevels}
          onClose={() => setShowYakuCodex(false)}
        />
      )}

      {showRunHistory && (
        <RunHistoryModal
          history={runState.playedHandsHistory}
          onClose={() => setShowRunHistory(false)}
        />
      )}

      {showHowToPlay && (
        <HowToPlayModal
          language={runState.language}
          onClose={() => setShowHowToPlay(false)}
        />
      )}

      {runState.gameStatus === 'game_over' && (
        <GameOverModal
          score={runState.score}
          targetScore={runState.currentBlind.targetScore}
          ante={runState.ante}
          onRestart={handleRestart}
        />
      )}

      {runState.gameStatus === 'victory' && (
        <VictoryModal score={runState.score} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;
