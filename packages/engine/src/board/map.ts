import type { Point3D, Values } from '@game/shared';

export type GameMap = {
  id: string;
  height: number;
  width: number;
  cells: { terrain: Terrain }[][][];
  deployZones: Point3D[][][];
};

export const TERRAINS = {
  GROUND: 'ground',
  WATER: 'water'
} as const;

export type Terrain = Values<typeof TERRAINS>;
