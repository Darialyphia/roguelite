import { assert } from '@game/shared';
import type { Card } from '../../../card/card.entity';
import { UnitCard } from '../../../card/unit-card.entity';
import type { Unit } from '../../../unit/unit.entity';
import type { DamageMitigationStrategy } from './mitigation-strategy';

export class CombatMitigationStrategy implements DamageMitigationStrategy {
  getMitigatedDamage(amount: number, target: Unit, source: Card) {
    assert(
      source instanceof UnitCard,
      'CombatScalingStrategy can only be used with unit cards'
    );
    return source.unit.getReceivedDamage(amount, target);
  }
}
