import type { CardBlueprint } from '../../card-blueprint';
import { keyBy } from 'lodash-es';
import { tutorialQuest } from './tutorial_quest';
import { tutorialSpell } from './tutorial_spell';
import { tutorialBerserk } from './tutorial_berserk';
import { tutorialAltar } from './tutorial_altar';

export const TUTORIAL_CARDS = keyBy(
  [tutorialSpell, tutorialQuest, tutorialBerserk, tutorialAltar],
  'id'
) as Record<string, CardBlueprint>;
