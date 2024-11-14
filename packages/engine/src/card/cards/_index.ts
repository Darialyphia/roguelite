import { keyBy } from 'lodash-es';
import { magicMissile } from './magic-missile';
import { arcaneIntellect } from './arcane-intellect';

export const CARDS_DICTIONARY = keyBy([magicMissile, arcaneIntellect], 'id');
