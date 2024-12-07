import type { Card } from '../../../card/card.entity';
import type { Unit } from '../../../unit/unit.entity';

export type DamageMitigationStrategy = {
  getMitigatedDamage(amount: number, target: Unit, source: Card): number;
};
