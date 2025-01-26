import type { CardBlueprint } from '../../card-blueprint';
import { keyBy } from 'lodash-es';
import { tutorialQuest } from './tutorial_quest';
import { tutorialSpell } from './tutorial_spell';
import { tutorialBerserk } from './tutorial_berserk';

export const TUTORIAL_CARDS = keyBy(
  [tutorialSpell, tutorialQuest, tutorialBerserk],
  'id'
) as Record<string, CardBlueprint>;
