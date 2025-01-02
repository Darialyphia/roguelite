import type { ObstacleBlueprint } from '../obstacle-blueprint';
import { altar } from './altar';
import { shrine } from './shrine';

export const OBSTACLES: Record<string, ObstacleBlueprint> = {
  shrine,
  altar
};
