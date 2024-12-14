import type { ObstacleBlueprint } from '../obstacle-blueprint';
import { rock } from './rock';
import { shrine } from './shrine';
import { tree } from './tree';

export const OBSTACLES: Record<string, ObstacleBlueprint> = {
  shrine,
  tree,
  rock
};
