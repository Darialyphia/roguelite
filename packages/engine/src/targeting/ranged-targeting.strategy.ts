import { isDefined, type Point3D } from '@game/shared';
import type { Game } from '../game/game';
import type { Unit } from '../unit/unit.entity';
import {
  isValidTargetingType,
  TARGETING_TYPE,
  type TargetingStrategy,
  type TargetingType
} from './targeting-strategy';
import { match } from 'ts-pattern';
import type { Card } from '../card/card.entity';
import { Position } from '../utils/position';

export type RangedTargetingStrategyOptions = {
  minRange: number;
  maxRange: number;
};

export class RangedTargetingStrategy implements TargetingStrategy {
  constructor(
    private game: Game,
    private card: Card,
    private origin: Point3D,
    private type: TargetingType,
    public readonly options: RangedTargetingStrategyOptions
  ) {}

  get position() {
    return Position.fromPoint3D(this.origin);
  }

  isWithinRange(point: Point3D) {
    if (this.position.isWithinCells(point, this.options.minRange, this.game))
      return false;
    if (!this.position.isWithinCells(point, this.options.maxRange, this.game))
      return false;

    return true;
  }

  canTargetAt(point: Point3D) {
    if (!this.isWithinRange(point)) return false;

    return isValidTargetingType(this.game, point, this.card.player, this.type);
  }
}
