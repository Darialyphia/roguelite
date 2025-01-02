import { testSpell } from './test-spell';
import type { CardBlueprint } from '../../card-blueprint';
import { testUnit } from './test-unit';
import { keyBy } from 'lodash-es';
import { testQuest } from './test-quest';

export const CORE_CARDS = keyBy([testUnit, testSpell, testQuest], 'id') as Record<
  string,
  CardBlueprint
>;
