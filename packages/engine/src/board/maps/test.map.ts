import { Vec3 } from '@game/shared';
import { TERRAINS } from '../board-utils';
import type { GameMap } from '../map';
import { plainTileset } from '../tilesets/plains';

export const testMap1v1: GameMap = {
  id: 'testMap1v1',
  width: 11,
  height: 7,
  cells: [
    // level 0
    [
      [
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS,
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
        { ...plainTileset.GRASS, obstacle: 'shrine' },
        plainTileset.GRASS,
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
        plainTileset.GRASS,
        plainTileset.GRASS,
        plainTileset.GRASS
      ]
    ]
  ],
  altarPositions: [[new Vec3(0, 3, 0)], [new Vec3(10, 3, 0)]]
};
