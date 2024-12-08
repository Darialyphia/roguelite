import { testGeneral } from './test-general';
import { testUnit } from './test-unit';
import { testSpell } from './test-spell';
import type { CardBlueprint } from '../../card-blueprint';

export const CORE_CARDS = { testGeneral, testSpell, testUnit } satisfies Record<
  string,
  CardBlueprint
>;
