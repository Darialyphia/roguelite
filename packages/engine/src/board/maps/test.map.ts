import { Vec3 } from '@game/shared';
import { TERRAINS } from '../board-utils';
import type { GameMap } from '../map';

export const testMap1v1: GameMap = {
  id: 'testMap1v1',
  width: 13,
  height: 7,
  cells: [
    [
      [
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        {
          terrain: TERRAINS.WATER,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00dddd44'],
              [1, '#00000000']
            ]
          }
        },
        {
          terrain: TERRAINS.WATER,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00dddd44'],
              [1, '#00000000']
            ]
          }
        },
        {
          terrain: TERRAINS.WATER,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00dddd44'],
              [1, '#00000000']
            ]
          }
        },
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
        { terrain: TERRAINS.GROUND, obstacle: 'shrine' },
        {
          terrain: TERRAINS.WATER,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00dddd44'],
              [1, '#00000000']
            ]
          }
        },
        {
          terrain: TERRAINS.WATER,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00dddd44'],
              [1, '#00000000']
            ]
          }
        },
        {
          terrain: TERRAINS.WATER,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00dddd44'],
              [1, '#00000000']
            ]
          }
        },
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
        {
          terrain: TERRAINS.WATER,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00dddd44'],
              [1, '#00000000']
            ]
          }
        },
        {
          terrain: TERRAINS.WATER,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00dddd44'],
              [1, '#00000000']
            ]
          }
        },
        {
          terrain: TERRAINS.WATER,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00dddd44'],
              [1, '#00000000']
            ]
          }
        },
        { terrain: TERRAINS.GROUND, obstacle: 'shrine' },
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
        {
          terrain: TERRAINS.WATER,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00dddd44'],
              [1, '#00000000']
            ]
          }
        },
        {
          terrain: TERRAINS.WATER,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00dddd44'],
              [1, '#00000000']
            ]
          }
        },
        {
          terrain: TERRAINS.WATER,
          light: {
            blendMode: 1,
            offset: { x: 0, y: 0 },
            radius: 200,
            colorStops: [
              [0, '#00dddd44'],
              [1, '#00000000']
            ]
          }
        },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND },
        { terrain: TERRAINS.GROUND }
      ]
    ]
  ],
  //prettier-ignore
  startPositions: [
    [
      new Vec3(0,3,0)
    ], 
    [
      new Vec3(12,3,0)
    ]
  ]
};
