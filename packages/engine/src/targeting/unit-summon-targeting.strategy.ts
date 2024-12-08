import { type Point3D } from '@game/shared';
import type { TargetingStrategy } from './targeting-strategy';
import type { Card } from '../card/card.entity';

export class UnitSummonTargetingtrategy implements TargetingStrategy {
  constructor(private card: Card) {}

  isWithinRange(point: Point3D) {
    return this.card.player.general.position.isNearby(point);
  }

  canTargetAt(point: Point3D) {
    return this.isWithinRange(point);
  }
}
