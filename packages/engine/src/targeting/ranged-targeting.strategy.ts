import { isDefined, type Point3D } from '@game/shared';
import type { Game } from '../game';
import type { Unit } from '../unit/unit.entity';
import type { TargetingStrategy } from './targeting-strategy';

export class RangedTargetingStrategy implements TargetingStrategy {
  constructor(
    private game: Game,
    private unit: Unit,
    public readonly range: number
  ) {}

  canAttackAt(point: Point3D) {
    const unit = this.game.unitSystem.getUnitAt(point);
    if (!unit) return false;

    return (
      this.unit.position.isAxisAligned(point) &&
      !this.unit.position.isNearby(point) &&
      this.unit.position.isWithinCells(point, this.range)
    );
  }

  getAOE(target: Point3D) {
    return [this.game.boardSystem.getCellAt(target)].filter(isDefined);
  }
}
