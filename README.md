# Mahjong Hell

A browser roguelite built around Mahjong hands. Draw and play tiles, score Yaku, earn chips and multipliers, and improve Yaku through a run. The game is a prototype; see [SHIP.md](SHIP.md) for the current demo path and implementation notes.

## Development

```bash
pnpm install
pnpm dev
```

Useful checks and a walkthrough:

```bash
pnpm typecheck
pnpm test
pnpm build
```

The game engine lives in `src/engine/`; React UI components are in `src/components/`.

## License

Original project content is available under the [PolyForm Noncommercial License 1.0.0](LICENSE). For uses outside the license permissions, contact the rights holder for separate permission. Third-party components and assets remain under their respective licenses.
