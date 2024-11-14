import { type Point3D } from '@game/shared';
import type { TargetingStrategy } from './targeting-strategy';
import type { Unit } from '../unit/unit.entity';

export class SelfTargetingPatternStrategy implements TargetingStrategy {
  constructor(private unit: Unit) {}

  isWithinRange(point: Point3D) {
    return this.unit.position.equals(point);
  }

  canTargetAt(point: Point3D) {
    return this.isWithinRange(point);
  }
}
