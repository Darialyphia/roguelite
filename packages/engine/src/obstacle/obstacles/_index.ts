import { keyBy } from 'lodash-es';
import type { ObstacleBlueprint } from '../obstacle-blueprint';
import { fortuneShrine } from './fortune-shrine';
import { victoryShrine } from './victory-shrine';
import { commandingShrine } from './commanding-shrine';

export const OBSTACLES = keyBy(
  [victoryShrine, fortuneShrine, commandingShrine],
  'id'
) as Record<string, ObstacleBlueprint>;
