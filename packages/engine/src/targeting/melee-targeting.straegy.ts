import { isDefined, type Point3D } from '@game/shared';
import type { TargetingStrategy } from './targeting-strategy';
import type { Unit } from '../unit/unit.entity';
import type { Game } from '../game';

export class MeleeTargetingPatternStrategy implements TargetingStrategy {
  constructor(
    private game: Game,
    private unit: Unit
  ) {}

  canAttackAt(point: Point3D) {
    const unit = this.game.unitSystem.getUnitAt(point);
    if (!unit) return false;

    return this.unit.position.isAxisAligned(point) && this.unit.position.isNearby(point);
  }

  getAOE(target: Point3D) {
    return [this.game.boardSystem.getCellAt(target)].filter(isDefined);
  }
}
