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
      this.card.player.units.some(
        unit => unit.canSummonNearby && unit.position.isNearby(point, this.game)
      ) ||
      this.game.boardSystem.commandingShrines.some(shrine => {
        return (
          shrine.position.equals(point) &&
          shrine.player?.equals(this.card.player) &&
          shrine.canBeSummonTarget
        );
      })
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
