import { Vec3 } from '@game/shared';
import type { GameMap } from '../map';
import { plainTileset } from '../tilesets/plains';

export const testMap1v1: GameMap = {
  id: 'testMap1v1',
  cols: 9,
  rows: 9,
  floors: [
    [
      [
        null,
        null,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        null,
        null,
        null
      ],
      [
        null,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        null,
        null
      ],
      [
        null,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        null
      ],
      [
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        null
      ],
      [
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        { ...plainTileset.GRASS, obstacle: 'shrine' },
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS
      ],
      [
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        null
      ],
      [
        null,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        null
      ],
      [
        null,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        null,
        null
      ],
      [
        null,
        null,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        null,
        null,
        null
      ]
    ]
  ],
  altarPositions: [[new Vec3(1, 4, 0)], [new Vec3(7, 4, 0)]]
};
