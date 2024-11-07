import type { UnitBlueprint } from '../unit-blueprint';

export const testUnit: UnitBlueprint = {
  id: 'test',
  speed: 6,
  pAtk: 10,
  pDef: 5,
  mAtk: 10,
  mDef: 5,
  maxAp: 3,
  maxHp: 100,
  mDefPiercing: {
    flat: 0,
    percentage: 0
  },
  pDefPiercing: {
    flat: 0,
    percentage: 0
  }
};
