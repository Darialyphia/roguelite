import type { Unit } from '../../../unit/unit.entity';
import type { DamageScalingStrategy } from './scaling-strategy';

export class MagicalScalingStrategy implements DamageScalingStrategy {
  private ratio: number;

  constructor(ratio: number) {
    this.ratio = ratio;
  }

  getExtraDamage(amount: number, source: Unit): number {
    return source.mAtk * this.ratio;
  }
}
