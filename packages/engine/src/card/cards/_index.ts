import { keyBy } from 'lodash-es';
import { magicMissile } from './magic-missile';
import { arcaneIntellect } from './arcane-intellect';
import { stasis } from './stasis';
import { frostNova } from './frost-nova';
import { summonArcaneServant } from './summon-arcane-servant';

export const CARDS_DICTIONARY = keyBy(
  [magicMissile, arcaneIntellect, stasis, frostNova, summonArcaneServant],
  'id'
);
