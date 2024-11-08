import type { Unit } from '../../../unit/unit.entity';

export type DamageMitigationStrategy = {
  getMitigatedDamage(amount: number, target: Unit, source: Unit): number;
};
