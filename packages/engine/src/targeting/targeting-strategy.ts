import type { Point3D } from '@game/shared';

export type TargetingStrategy = {
  canAttackAt(point: Point3D): boolean;
};
