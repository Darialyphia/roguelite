export type UnitBlueprint = {
  id: string;
  name: string;
  spriteId: string;
  iconId: string;
  maxAp: number;
  speed: number;
  maxHp: number;
  pAtk: number;
  pDef: number;
  mAtk: number;
  mDef: number;
  pDefPiercing: {
    percentage: number;
    flat: number;
  };
  mDefPiercing: {
    percentage: number;
    flat: number;
  };
};
