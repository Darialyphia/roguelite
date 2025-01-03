import { testSpell } from './test-spell';
import type { CardBlueprint } from '../../card-blueprint';
import { redFootman } from './red_footman';
import { keyBy } from 'lodash-es';
import { testQuest } from './test-quest';
import { redArcher } from './red-archer';

export const CORE_CARDS = keyBy(
  [redFootman, redArcher, testSpell, testQuest],
  'id'
) as Record<string, CardBlueprint>;
