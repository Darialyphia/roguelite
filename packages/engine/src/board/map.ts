import type { Nullable, Point3D, Values } from '@game/shared';
import type { LightBlendMode } from '../vfx/vfx-sequencer';

export type CellLight = {
  radius: number;
  blendMode: LightBlendMode;
  colorStops: [number, string][];
  offset: { x: number; y: number };
};

export type GameMap = {
  id: string;
  height: number;
  width: number;
  cells: Nullable<{
    terrain: Terrain;
    spriteId: string;
    light?: CellLight;
    obstacle?: string;
  }>[][][];
  startPositions: Point3D[][];
};

export const TERRAINS = {
  GROUND: 'ground',
  WATER: 'water'
} as const;

export type Terrain = Values<typeof TERRAINS>;
