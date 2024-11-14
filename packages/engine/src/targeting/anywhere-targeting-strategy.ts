import type { TargetingStrategy } from './targeting-strategy';

export class AnywhereTargetingPatternStrategy implements TargetingStrategy {
  isWithinRange() {
    return true;
  }

  canTargetAt() {
    return true;
  }
}
