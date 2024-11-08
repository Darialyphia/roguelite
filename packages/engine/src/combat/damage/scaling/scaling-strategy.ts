import type { Unit } from '../../../unit/unit.entity';

export type DamageScalingStrategy = {
  getExtraDamage(baseAmount: number, source: Unit, target: Unit): number;
};
