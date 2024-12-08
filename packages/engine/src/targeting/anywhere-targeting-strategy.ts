import type { Point3D } from '@game/shared';
import type { TargetingStrategy, TargetingType } from './targeting-strategy';
import type { Game } from '../game/game';
import type { Unit } from '../unit/unit.entity';
import { match } from 'ts-pattern';

export class AnywhereTargetingStrategy implements TargetingStrategy {
  constructor(
    private game: Game,
    private unit: Unit,
    private type: TargetingType
  ) {}

  isWithinRange() {
    return true;
  }

  canTargetAt(point: Point3D) {
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
