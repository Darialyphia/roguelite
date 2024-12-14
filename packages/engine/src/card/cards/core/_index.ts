import { testGeneral } from './test-general';
import { lancer } from './lancer';
import { testSpell } from './test-spell';
import type { CardBlueprint } from '../../card-blueprint';
import { shaman } from './shaman';
import { emperor } from './emperor';
import { dancer } from './dancer';

export const CORE_CARDS = {
  testGeneral,
  testSpell,
  lancer,
  dancer,
  shaman,
  emperor
} satisfies Record<string, CardBlueprint>;
