import type { Point3D } from '@game/shared';
import { nanoid } from 'nanoid';
import type { EntityId } from '../entity';

export const makeObstacleId = (cell: Point3D) =>
  `obstacle_${cell.x}.${cell.y}.${cell.z}_${nanoid(4)}` as EntityId;
