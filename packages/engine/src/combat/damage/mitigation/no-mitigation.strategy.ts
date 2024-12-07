import type { DamageMitigationStrategy } from './mitigation-strategy';

export class NoMitigationStrategy implements DamageMitigationStrategy {
  getMitigatedDamage(amount: number) {
    return amount;
  }
}
