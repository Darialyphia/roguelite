import { lancer } from './lancer';
import { testSpell } from './test-spell';
import type { CardBlueprint } from '../../card-blueprint';
import { shaman } from './shaman';
import { emperor } from './emperor';
import { dancer } from './dancer';
import { monk } from './monk';
import { berserker } from './berserker';
import { gladiator } from './gladiator';
import { apprentice } from './apprentice';
import { kingsGuard } from './kings-guard';
import { snakeLady } from './snake-lady';
import { keyBy } from 'lodash-es';
import { treasureHunter } from './treasure-hunter';

export const CORE_CARDS = keyBy(
  [
    testSpell,
    lancer,
    dancer,
    shaman,
    emperor,
    apprentice,
    gladiator,
    berserker,
    monk,
    snakeLady,
    kingsGuard,
    treasureHunter
  ],
  'id'
) as Record<string, CardBlueprint>;
