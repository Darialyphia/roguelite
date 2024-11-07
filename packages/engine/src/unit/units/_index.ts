import { keyBy } from 'lodash-es';
import { testUnit } from './test.unit';

export const UNITS_DICTIONARY = keyBy([testUnit], 'id');
