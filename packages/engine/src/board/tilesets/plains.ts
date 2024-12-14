import type { BetterOmit } from '@game/shared';
import { TERRAINS } from '../board-utils';
import type { CellOptions } from '../cell';

export const plainTileset = {
  GRASS: { terrain: TERRAINS.GROUND, spriteId: 'grass' },
  DIRT: { terrain: TERRAINS.GROUND, spriteId: 'dirt' },
  BRIDGE: { terrain: TERRAINS.GROUND, spriteId: 'bridge' },
  WATER: {
    terrain: TERRAINS.WATER,
    spriteId: 'water',
    light: {
      blendMode: 1,
      offset: { x: 0, y: 0 },
      radius: 200,
      colorStops: [
        [0, '#0099990c'],
        [1, '#00000000']
      ]
    }
  }
} satisfies Record<string, BetterOmit<CellOptions, 'id' | 'position'>>;
