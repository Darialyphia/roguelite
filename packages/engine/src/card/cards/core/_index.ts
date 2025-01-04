import { testSpell } from './test-spell';
import type { CardBlueprint } from '../../card-blueprint';
import { redFootman } from './red_footman';
import { keyBy } from 'lodash-es';
import { testQuest } from './test-quest';
import { redArcher } from './red_archer';
import { redEmperor } from './red_emperor';
import { redBerserk } from './red_berserk';
import { redAvenger } from './red_avenger';

export const CORE_CARDS = keyBy(
  [redFootman, redArcher, redEmperor, redBerserk, redAvenger, testSpell, testQuest],
  'id'
) as Record<string, CardBlueprint>;
