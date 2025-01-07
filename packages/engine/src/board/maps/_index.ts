import { keyBy } from 'lodash-es';
import { map1v1 } from './1v1.map';

export const MAPS_DICTIONARY = keyBy([map1v1], 'id');
