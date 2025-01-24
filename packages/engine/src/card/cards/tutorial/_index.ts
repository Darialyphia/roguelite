import type { CardBlueprint } from '../../card-blueprint';
import { keyBy } from 'lodash-es';
import { tutorialQuest } from './tutorial_quest';
import { tutorialSpell } from './tutorial_spell';

export const TUTORIAL_CARDS = keyBy([tutorialSpell, tutorialQuest], 'id') as Record<
  string,
  CardBlueprint
>;
