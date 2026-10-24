# Mahjong Hell — SHIP.md

## Pitch (30 seconds)
Mahjong Hell is **Balatro but for Mahjong** — a deckbuilder roguelite where you build hands from drawn tiles, score Yaku (mahjong hand patterns), earn chips × multiplier, and upgrade your Yaku levels each round. Tanyao → Chinitsu → Kokushi. Every run is different. Every session ends with you saying "one more."

**"Balatro mechanics. Mahjong hands. Roguelite progression. Browser native."**

---

## 10-Minute Demo Path

1. **Open** `http://localhost:5173`.
2. **See** 13 tiles in the draw pile, with your current hand slots.
3. **Click tiles** to play them into a hand — the Yaku detector shows the matched pattern (e.g. "One Pair / 対子").
4. **Score the hand** — chips × mult calculation appears with a Balatro-style pop. Gold coins awarded.
5. **Discard** unused tiles — draw replacements.
6. **End of round**: upgrade screen appears — pick a Yaku to level up (e.g. Triplet: +25 chips, +2 mult per level).
7. **Relics** — show one relic card: "Dora tile: any tile matching today's dora adds +2 mult."
8. **Higher rounds**: demonstrate chinitsu (full flush) detection — all tiles from one suit → big score.
9. **Show `mahjong.ts`** — pure engine, 282 lines. All yaku detection, meld finding, and scoring in one file.

*Total time: ≈ 5 minutes. Demo Q&A: 5 minutes.*

---

## Environment Variables
None required. Fully static browser app.

---

## Running Locally

```bash
cd mahjong-hell
pnpm install
pnpm typecheck    # zero errors expected
pnpm test         # 18 tests, all passing
pnpm dev          # http://localhost:5173
```

---

## Deployment

```bash
pnpm build
vercel --prod
```

---

## Architecture

```
src/
  engine/
    mahjong.ts        — deck creation, shuffleDeck, sortTiles, evaluatePlayedHand
    mahjong.test.ts   — 18 vitest tests
    blindsEngine.ts   — blind progression (antes, stakes)
    relicsEngine.ts   — relic modifiers
    doraEngine.ts     — dora indicator logic
    statsEngine.ts    — run statistics
    vouchersEngine.ts — voucher system
    stateMachine.ts   — game state transitions
  types/game.ts       — Tile, Yaku, Meld, HandEvaluation types
  components/         — React UI (TileCard, HandZone, ScoreDisplay, ShopPanel)
```

**Key design:** `evaluatePlayedHand()` does priority-ordered Yaku detection (kokushi > daisangen > chitoitsu > chinitsu > honitsu > … > high_hand). Level-scaled chips and mult: `base + (level-1) × upgrade`. Tests verify detection hierarchy by using terminal tiles to prevent lower-priority Yaku from masking higher ones.

---

## Tier A Checklist
- [x] `pnpm typecheck` — green
- [x] `pnpm test` — 18/18 passing
- [x] `SHIP.md` — this file
- [x] 10-minute demo path documented
- [x] No environment variables required
- [x] Vercel-ready static build
