import type { Unit } from '../../../unit/unit.entity';
import type { DamageMitigationStrategy } from './mitigation-strategy';

export class MagicalMitigationStrategy implements DamageMitigationStrategy {
  getMitigatedDamage(amount: number, target: Unit, source: Unit): number {
    const reduction =
      target.mDef -
      target.mDef * (source.mDefPiercing.percentage / 100) -
      source.mDefPiercing.flat;

    return Math.round(amount * (100 / (100 + reduction)));
  }
}
