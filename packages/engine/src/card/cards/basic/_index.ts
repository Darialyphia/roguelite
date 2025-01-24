import type { CardBlueprint } from '../../card-blueprint';
import { keyBy } from 'lodash-es';
import { altar } from './altar';

export const BASIC_CARDS = keyBy([altar], 'id') as Record<string, CardBlueprint>;
