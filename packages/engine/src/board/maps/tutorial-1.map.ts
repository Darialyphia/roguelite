import { Vec3 } from '@game/shared';
import type { GameMap } from '../map';
import { plainTileset } from '../tilesets/plains';

export const mapTutorial1: GameMap = {
  id: 'tutorial-1',
  cols: 6,
  rows: 6,
  floors: [
    [
      [
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
        plainTileset.GRASS
      ],
      [
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
        plainTileset.GRASS
      ],
      [
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
        plainTileset.GRASS
      ]
    ]
  ],
  generalPositions: [[new Vec3(0, 2, 0)], [new Vec3(5, 2, 0)]]
};
