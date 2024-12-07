import type { DamageScalingStrategy } from './scaling-strategy';

export class NoScalingStrategy implements DamageScalingStrategy {
  getDealtDamage(baseAmount: number): number {
    return baseAmount;
  }
}
