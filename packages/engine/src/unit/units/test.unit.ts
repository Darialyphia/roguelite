import type { UnitBlueprint } from '../unit-blueprint';

export const testUnit: UnitBlueprint = {
  id: 'test-unit',
  name: 'Wizard',
  spriteId: 'wizard',
  speed: 6,
  pAtk: 30,
  pDef: 12,
  mAtk: 40,
  mDef: 18,
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
