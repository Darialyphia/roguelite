import { assert } from '@game/shared';
import { UnitCard } from '../../../card/unit-card.entity';
import type { Unit } from '../../../unit/unit.entity';
import type { DamageScalingStrategy } from './scaling-strategy';
import type { Card } from '../../../card/card.entity';
import { GeneralCard } from '../../../card/general-card.entity';

export class CombatScalingStrategy implements DamageScalingStrategy {
  getDealtDamage(baseAmount: number, source: Card, target: Unit): number {
    assert(
      source instanceof UnitCard || source instanceof GeneralCard,
      'CombatScalingStrategy can only be used with unit cards'
    );
    return baseAmount + source.unit.getDealtDamage(baseAmount, target);
  }
}
