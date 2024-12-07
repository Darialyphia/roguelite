import type { Game } from '../game/game';
import type { TargetingStrategy } from '../targeting/targeting-strategy';
import type { Unit } from './unit.entity';

export type UnitBlueprint = {
  id: string;
  name: string;
  spriteId: string;
  iconId: string;
  maxAp: number;
  maxHp: number;
  atk: number;
  speed: number;
  reward: number;
  goldCost: number;
  getAttackPattern: (game: Game, unit: Unit) => TargetingStrategy;
};
