import type { Tile } from '../types/game';

// Standard Mahjong Dora indicator sequence:
// 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 1
// East -> South -> West -> North -> East
// Red -> Green -> White -> Red
export function getDoraTargetTile(indicator: Tile): { suit: Tile['suit']; value: Tile['value'] } {
  if (typeof indicator.value === 'number') {
    const nextVal = indicator.value === 9 ? 1 : indicator.value + 1;
    return { suit: indicator.suit, value: nextVal };
  }

  if (indicator.suit === 'wind') {
    const windOrder: Tile['value'][] = ['E', 'S', 'W', 'N'];
    const idx = windOrder.indexOf(indicator.value);
    const nextWind = windOrder[(idx + 1) % 4];
    return { suit: 'wind', value: nextWind };
  }

  if (indicator.suit === 'dragon') {
    const dragonOrder: Tile['value'][] = ['red', 'green', 'white'];
    const idx = dragonOrder.indexOf(indicator.value);
    const nextDragon = dragonOrder[(idx + 1) % 3];
    return { suit: 'dragon', value: nextDragon };
  }

  return { suit: indicator.suit, value: indicator.value };
}

export function isTileDoraMatch(tile: Tile, indicator: Tile | null): boolean {
  if (!indicator) return false;
  const target = getDoraTargetTile(indicator);
  return tile.suit === target.suit && tile.value === target.value;
}
