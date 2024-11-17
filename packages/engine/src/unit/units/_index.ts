import { keyBy } from 'lodash-es';
import { wizard } from './wizard.unit';
import { arcaneServant } from './arcane-servant';

export const UNITS_DICTIONARY = keyBy([wizard, arcaneServant], 'id');
