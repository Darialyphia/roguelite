import { Vec3 } from '@game/shared';
import { TERRAINS } from '../board-utils';
import type { GameMap } from '../map';

export const testMap1v1: GameMap = {
  id: 'testMap1v1',
  width: 9,
  height: 5,
  cells: [
    [
      [
        {
          terrain: TERRAINS.GROUND,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#FF000088'],
              [1, '#00000000']
            ]
          }
        },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        {
          terrain: TERRAINS.GROUND,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#FFFF0088'],
              [1, '#00000000']
            ]
          }
        }
      ],
      [
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND }
      ],
      [
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND }
      ],
      [
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND }
      ],
      [
        {
          terrain: TERRAINS.GROUND,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#FF00FF88'],
              [1, '#00000000']
            ]
          }
        },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        {
          terrain: TERRAINS.GROUND,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00FFFF88'],
              [1, '#00000000']
            ]
          }
        }
      ]
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
