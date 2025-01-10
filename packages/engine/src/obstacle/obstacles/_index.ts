import { keyBy } from 'lodash-es';
import type { ObstacleBlueprint } from '../obstacle-blueprint';
import { fortuneShrine } from './fortune-shrine';
import { victoryShrine } from './victory-shrine';

export const OBSTACLES = keyBy([victoryShrine, fortuneShrine], 'id') as Record<
  string,
  ObstacleBlueprint
>;
