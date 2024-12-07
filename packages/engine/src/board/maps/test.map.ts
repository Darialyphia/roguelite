import { Vec3 } from '@game/shared';
import { TERRAINS } from '../board-utils';
import type { GameMap } from '../map';

export const testMap1v1: GameMap = {
  id: 'testMap1v1',
  width: 9,
  height: 5,
  //prettier-ignore
  cells: [
    [
      [{ terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }],
      [{ terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }],
      [{ terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }],
      [{ terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }],
      [{ terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }, { terrain: TERRAINS.GROUND }],
    ]
  ],
  //prettier-ignore
  startPositions: [
    [
      new Vec3(0,2,0)
    ], 
    [
      new Vec3(8,2,0)
    ]
  ]
};
