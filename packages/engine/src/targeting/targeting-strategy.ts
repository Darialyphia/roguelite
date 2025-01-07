import type { Point3D, Values } from '@game/shared';

export type TargetingStrategy = {
  isWithinRange(point: Point3D): boolean;
  canTargetAt(point: Point3D): boolean;
};

export const TARGETING_TYPE = {
  EMPTY: 'empty',
  ALLY_UNIT: 'ally_unit',
  ALLY_GENERAL: 'ally_general',
  ALLY_MINION: 'ally_minion',
  ENEMY_UNIT: 'enemy_unit',
  ENEMY_GENERAL: 'enemy_general',
  ENEMY_MINION: 'enemy_minion',
  UNIT: 'unit',
  GENERAL: 'general',
  MINION: 'minion',
  ANYWHERE: 'anywhere'
} as const;

export type TargetingType = Values<typeof TARGETING_TYPE>;
export type NonEmptyTargetingType = Exclude<
  TargetingType,
  (typeof TARGETING_TYPE)['EMPTY'] | (typeof TARGETING_TYPE)['ANYWHERE']
>;
