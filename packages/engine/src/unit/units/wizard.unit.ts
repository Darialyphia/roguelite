import type { UnitBlueprint } from '../unit-blueprint';

export const wizard: UnitBlueprint = {
  id: 'wizard',
  name: 'Wizard',
  spriteId: 'wizard',
  iconId: 'unit-wizard',
  speed: 6,
  pAtk: 20,
  pDef: 10,
  mAtk: 35,
  mDef: 16,
  maxAp: 3,
  maxHp: 120,
  mDefPiercing: {
    flat: 0,
    percentage: 0
  },
  pDefPiercing: {
    flat: 0,
    percentage: 0
  }
};
