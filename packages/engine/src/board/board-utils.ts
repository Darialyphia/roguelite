import { assert, isDefined, type Point3D, type Values } from '@game/shared';
import type { SerializedCoords } from './cell';

export const DIRECTION = {
  NORTH: 'north',
  SOUTH: 'south',
  WEST: 'west',
  EAST: 'east'
} as const;

export const DIRECTIONS_TO_DIFF = {
  [DIRECTION.NORTH]: { x: 0, y: -1, z: 0 },
  [DIRECTION.SOUTH]: { x: 0, y: 1, z: 0 },
  [DIRECTION.WEST]: { x: -1, y: 0, z: 0 },
  [DIRECTION.EAST]: { x: 1, y: 0, z: 0 }
} as const satisfies Record<Direction, Point3D>;

export type Direction = Values<typeof DIRECTION>;

export const TERRAINS = {
  GROUND: 'ground',
  WATER: 'water',
  EMPTY: 'empty'
} as const;

export type Terrain = Values<typeof TERRAINS>;

export function assertSerializedcoords(str: string): asserts str is SerializedCoords {
  const [x, y, z] = str.split(':').map(Number);

  return assert(
    isDefined(x) && isDefined(y) && isDefined(z),
    'Invalid serialized coordinates'
  );
}

export const pointToCellId = (point: Point3D): SerializedCoords =>
  `${point.x}:${point.y}:${point.z}`;

export const cellIdToPoint = (cellId: SerializedCoords): Point3D => {
  const [x, y, z] = cellId.split(':').map(Number);

  return { x, y, z };
};
