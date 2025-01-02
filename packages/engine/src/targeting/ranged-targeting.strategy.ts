import { type Point3D } from '@game/shared';
import type { Game } from '../game/game';
import type { Unit } from '../unit/unit.entity';
import type { TargetingStrategy, TargetingType } from './targeting-strategy';
import { match } from 'ts-pattern';

export type RangedTargetingStrategyOptions = {
  minRange: number;
  maxRange: number;
};

export class RangedTargetingStrategy implements TargetingStrategy {
  constructor(
    private game: Game,
    private unit: Unit,
    private type: TargetingType,
    public readonly options: RangedTargetingStrategyOptions
  ) {}

  isWithinRange(point: Point3D) {
    if (this.unit.position.isWithinCells(point, this.options.minRange, this.game))
      return false;
    if (!this.unit.position.isWithinCells(point, this.options.maxRange, this.game))
      return false;

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
