import { Vec3 } from '@game/shared';
import type { GameMap } from '../map';
import { plainTileset } from '../tilesets/plains';
import { victoryShrine } from '../../obstacle/obstacles/victory-shrine';
import { fortuneShrine } from '../../obstacle/obstacles/fortune-shrine';

export const map1v1: GameMap = {
  id: '1v1',
  cols: 11,
  rows: 12,
  padding: { x: -240, y: -50 },
  floors: [
    [
      [
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER
      ],
      [
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER
      ],
      [
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.GRASS,
        { ...plainTileset.GRASS, obstacle: victoryShrine.id },
        plainTileset.GRASS,
        plainTileset.GRASS,
        { ...plainTileset.GRASS, obstacle: fortuneShrine.id },
        plainTileset.GRASS,
        plainTileset.WATER,
        plainTileset.WATER
      ],
      [
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.WATER,
        plainTileset.WATER
      ],
      [
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.WATER
      ],
      [
        plainTileset.WATER,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        { ...plainTileset.GRASS, obstacle: victoryShrine.id },
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.WATER
      ],
      [
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.WATER
      ],
      [
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.WATER,
        plainTileset.WATER
      ],
      [
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.GRASS,
        { ...plainTileset.GRASS, obstacle: fortuneShrine.id },
        plainTileset.GRASS,
        plainTileset.GRASS,
        { ...plainTileset.GRASS, obstacle: victoryShrine.id },
        plainTileset.GRASS,
        plainTileset.WATER,
        plainTileset.WATER
      ],
      [
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER
      ],
      [
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER,
        plainTileset.WATER
      ]
    ]
  ],
  generalPositions: [[new Vec3(1, 5, 0)], [new Vec3(9, 5, 0)]]
};
