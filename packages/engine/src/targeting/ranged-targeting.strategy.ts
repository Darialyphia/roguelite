import { type Point3D } from '@game/shared';
import type { Game } from '../game/game';
import type { Unit } from '../unit/unit.entity';
import type { TargetingStrategy, TargetingType } from './targeting-strategy';
import { Position } from '../utils/position';
import { match } from 'ts-pattern';

export class RangedTargetingStrategy implements TargetingStrategy {
  constructor(
    private game: Game,
    private unit: Unit,
    private type: TargetingType,
    public readonly range: number
  ) {}

  canTargetAt(point: Point3D) {
    const position = Position.fromPoint3D(point);
    if (position.isNearby(point)) return false;
    if (!position.isWithinCells(point, this.range)) return false;

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
