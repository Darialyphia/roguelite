import type { Card } from '../../../card/card.entity';
import type { Unit } from '../../../unit/unit.entity';

export type DamageScalingStrategy = {
  getDealtDamage(baseAmount: number, source: Card, target: Unit): number;
};
