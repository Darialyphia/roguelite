import type { Nullable, Point3D, Values } from '@game/shared';
import type { LightBlendMode } from '../vfx/vfx-sequencer';

export type CellLight = {
  radius: number;
  blendMode: LightBlendMode;
  colorStops: [number, string][];
  offset: { x: number; y: number };
};

type GameMapCell = {
  terrain: Terrain;
  spriteId: string;
  light?: CellLight;
  obstacle?: string;
};

type GameMapRow = Nullable<GameMapCell>[];

type GameMapFloor = GameMapRow[];

export type GameMap = {
  id: string;
  rows: number;
  cols: number;
  floors: GameMapFloor[];
  altarPositions: Point3D[][];
  padding: { x: number; y: number };
};

export const TERRAINS = {
  GROUND: 'ground',
  WATER: 'water'
} as const;

export type Terrain = Values<typeof TERRAINS>;
