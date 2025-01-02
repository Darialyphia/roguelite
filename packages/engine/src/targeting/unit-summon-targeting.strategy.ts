import { type Point3D } from '@game/shared';
import type { TargetingStrategy } from './targeting-strategy';
import type { Card } from '../card/card.entity';
import type { Game } from '../game/game';

export class UnitSummonTargetingtrategy implements TargetingStrategy {
  constructor(
    private game: Game,
    private card: Card
  ) {}

  isWithinRange(point: Point3D) {
    return (
      this.card.player.altar.position.isNearby(point) ||
      this.card.player.units.some(
        unit => unit.canSummonUnitsNearby && unit.position.isNearby(point)
      )
    );
  }

  canTargetAt(point: Point3D) {
    return (
      this.isWithinRange(point) &&
      !this.game.unitSystem.getUnitAt(point) &&
      !!this.game.boardSystem.getCellAt(point)?.isWalkable
    );
  }
}
