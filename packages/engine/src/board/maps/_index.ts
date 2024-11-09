import { keyBy } from 'lodash-es';
import { testMap1v1 } from './test.map';

export const MAPS_DICTIONARY = keyBy([testMap1v1], 'id');
