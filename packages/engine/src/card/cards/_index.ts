import { keyBy } from 'lodash-es';
import { testCard } from './test.card';

export const CARDS_DICTIONARY = keyBy([testCard], 'id');
