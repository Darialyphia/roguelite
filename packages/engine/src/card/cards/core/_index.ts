import { redFireball } from './red-fireball';
import type { CardBlueprint } from '../../card-blueprint';
import { redFootman } from './red_footman';
import { keyBy } from 'lodash-es';
import { testQuest } from './test-quest';
import { redArcher } from './red_archer';
import { redEmperor } from './red_emperor';
import { redBerserk } from './red_berserk';
import { redAvenger } from './red_avenger';
import { redCombustion } from './red_combustion';
import { redGeneralFlameLord } from './red_general_flame-lord';
import { redExorcist } from './red_exorcist';
import { redFireElemental } from './red_fire-elemental';
import { redWarLeader } from './red_warleader';
import { redWillOWisp } from './red_will-o-wisp';
import { redBurningBlade } from './red_burning_blade';
import { tutorialSpell } from './tutorial_spell';
import { tutorialQuest } from './tutorial_quest';
import { redCrazedBloodCultist } from './red_crazed_blood_cultist';

export const CORE_CARDS = keyBy(
  [
    redGeneralFlameLord,
    redFootman,
    redArcher,
    redEmperor,
    redBerserk,
    redWillOWisp,
    redAvenger,
    redFireElemental,
    redExorcist,
    redWarLeader,
    redFireball,
    redCombustion,
    redBurningBlade,
    redCrazedBloodCultist,
    testQuest,
    tutorialSpell,
    tutorialQuest
  ],
  'id'
) as Record<string, CardBlueprint>;
