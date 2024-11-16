import type { Unit } from '../../../unit/unit.entity';
import type { DamageMitigationStrategy } from './mitigation-strategy';

export class PhysicalMitigationStrategy implements DamageMitigationStrategy {
  getMitigatedDamage(amount: number, target: Unit, source: Unit): number {
    const reduction =
      target.pDef -
      target.pDef * (source.pDefPiercing.percentage / 100) -
      source.pDefPiercing.flat;

    return Math.round(amount * (100 / (100 + reduction)));
  }
}
