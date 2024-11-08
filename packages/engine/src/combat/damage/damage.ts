import type { Unit } from '../../unit/unit.entity';
import type { DamageMitigationStrategy } from './mitigation/mitigation-strategy';
import type { DamageScalingStrategy } from './scaling/scaling-strategy';

export type DamageOptions = {
  source: Unit;
  baseAmount: number;
  scalings: DamageScalingStrategy[];
  mitigation: DamageMitigationStrategy;
};

export class Damage {
  private source: Unit;

  private baseAmount: number;

  private scalings: DamageScalingStrategy[];

  private mitigation: DamageMitigationStrategy;

  constructor(options: DamageOptions) {
    this.source = options.source;
    this.baseAmount = options.baseAmount;
    this.scalings = options.scalings;
    this.mitigation = options.mitigation;
  }

  getScaledAmount(target: Unit) {
    return (
      this.baseAmount +
      this.scalings.reduce(
        (acc, scaling) =>
          acc + scaling.getExtraDamage(this.baseAmount, this.source, target),
        0
      )
    );
  }

  getMitigatedAmount(target: Unit) {
    return this.mitigation.getMitigatedDamage(
      this.getScaledAmount(target),
      target,
      this.source
    );
  }
}
