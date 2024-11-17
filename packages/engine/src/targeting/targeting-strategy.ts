import type { Point3D, Values } from '@game/shared';

export type TargetingStrategy = {
  isWithinRange(point: Point3D): boolean;
  canTargetAt(point: Point3D): boolean;
};

export const TARGETING_TYPE = {
  EMPTY: 'empty',
  ALLY: 'ally',
  ENEMY: 'enemy',
  BOTH: 'both',
  ANY: 'any'
} as const;

export type TargetingType = Values<typeof TARGETING_TYPE>;
export type NonEmptyTargetingType = Exclude<
  TargetingType,
  (typeof TARGETING_TYPE)['EMPTY'] | (typeof TARGETING_TYPE)['ANY']
>;
