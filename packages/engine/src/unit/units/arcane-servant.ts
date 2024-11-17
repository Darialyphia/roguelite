import type { UnitBlueprint } from '../unit-blueprint';

export const arcaneServant: UnitBlueprint = {
  id: 'arcane-servant',
  name: 'Arcane Servant',
  spriteId: 'arcane-servant',
  iconId: 'unit-arcane-servant',
  speed: 5,
  pAtk: 20,
  pDef: 8,
  mAtk: 0,
  mDef: 15,
  maxAp: 3,
  maxHp: 80,
  mDefPiercing: {
    flat: 0,
    percentage: 0
  },
  pDefPiercing: {
    flat: 0,
    percentage: 0
  }
};
