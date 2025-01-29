import type { Card } from '../../card/card.entity';
import type { Unit } from '../../unit/unit.entity';
import type { DamageType } from './damage.enums';
import type { DamageMitigationStrategy } from './mitigation/mitigation-strategy';
import type { DamageScalingStrategy } from './scaling/scaling-strategy';

export type DamageOptions = {
  source: Card;
  baseAmount: number;
  scalings: DamageScalingStrategy[];
  mitigations: DamageMitigationStrategy[];
  type: DamageType;
};

export class Damage {
  private source: Card;

  private baseAmount: number;

  private scalings: DamageScalingStrategy[];

  private mitigations: DamageMitigationStrategy[];

  readonly type: DamageType;

  constructor(options: DamageOptions) {
    this.source = options.source;
    this.baseAmount = options.baseAmount;
    this.scalings = options.scalings;
    this.type = options.type;
    this.mitigations = options.mitigations;
  }

  getScaledAmount(target: Unit) {
    return this.scalings.reduce(
      (acc, scaling) => scaling.getDealtDamage(acc, this.source, target),
      this.baseAmount
    );
  }

  getMitigatedAmount(target: Unit) {
    return this.mitigations.reduce(
      (acc, scaling) => scaling.getMitigatedDamage(acc, target, this.source),
      this.getScaledAmount(target)
    );
  }
}
