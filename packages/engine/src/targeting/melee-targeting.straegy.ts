import { type Point3D } from '@game/shared';
import type { TargetingStrategy, TargetingType } from './targeting-strategy';
import type { Unit } from '../unit/unit.entity';
import type { Game } from '../game/game';
import { match } from 'ts-pattern';

export class MeleeTargetingPatternStrategy implements TargetingStrategy {
  constructor(
    private game: Game,
    private unit: Unit,
    private type: TargetingType
  ) {}

  isWithinRange(point: Point3D) {
    if (!this.unit.position.isAxisAligned(point)) return false;
    if (!this.unit.position.isNearby(point)) return false;

    return true;
  }

  canTargetAt(point: Point3D) {
    if (!this.isWithinRange(point)) return false;

    const unit = this.game.unitSystem.getUnitAt(point);

    return match(this.type)
      .with('any', () => true)
      .with('empty', () => !unit)
      .with('ally', () => !!unit?.isAlly(this.unit))
      .with('enemy', () => !!unit?.isEnemy(this.unit))
      .with('both', () => !!unit)
      .exhaustive();
  }
}
