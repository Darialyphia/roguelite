import { redFireball } from './red_fireball';
import type { CardBlueprint } from '../../card-blueprint';
import { redFootman } from './red_footman';
import { keyBy } from 'lodash-es';
import { questWarPath } from './quest-war-path';
import { redArcher } from './red_archer';
import { redEmperor } from './red_emperor';
import { redBerserk } from './red_berserk';
import { redAvenger } from './red_avenger';
import { redCombustion } from './red_combustion';
import { redFlameLord } from './red_flame-lord';
import { redExorcist } from './red_exorcist';
import { redFireElemental } from './red_fire-elemental';
import { redWarLeader } from './red_warleader';
import { redWillOWisp } from './red_will-o-wisp';
import { redBurningBlade } from './red_burning_blade';
import { redCrazedBloodCultist } from './red_crazed_blood_cultist';
import { redFirePillar } from './red_fire-pillar';
import { questBloodThirst } from './quest-blood-thirst';
import { redBloodlust } from './red_bloodlust';
import { redMasterAtArms } from './red-master-at-arms';
import { redBloodCultistDevotee } from './red_blood_cultist_devotee';
import { redBloodCultistBrute } from './red_blood_cultist_brute';
import { redPyromancer } from './red_pyromancer';
import { redBloodCultistPriestess } from './red_blood_cultist_priestess';

export const CORE_CARDS = keyBy(
  [
    redFlameLord,
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
    redFirePillar,
    redBloodlust,
    redMasterAtArms,
    redBloodCultistDevotee,
    redBloodCultistBrute,
    redBloodCultistPriestess,
    redPyromancer,
    questWarPath,
    questBloodThirst
  ],
  'id'
) as Record<string, CardBlueprint>;
