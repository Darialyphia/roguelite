import { Vec3 } from '@game/shared';
import type { GameMap } from '../map';
import { plainTileset } from '../tilesets/plains';
import { victoryShrine } from '../../obstacle/obstacles/victory-shrine';

export const mapTutorial1: GameMap = {
  id: 'tutorial-1',
  cols: 6,
  rows: 6,
  padding: { x: 0, y: 0 },
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
        { ...plainTileset.GRASS, obstacle: victoryShrine.id },
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
