import { isDefined, type Point3D } from '@game/shared';
import {
  isValidTargetingType,
  TARGETING_TYPE,
  type TargetingStrategy,
  type TargetingType
} from './targeting-strategy';
import type { Unit } from '../unit/unit.entity';
import type { Game } from '../game/game';
import { match } from 'ts-pattern';
import type { Card } from '../card/card.entity';
import { Position } from '../utils/position';

export class NearbyTargetingStrategy implements TargetingStrategy {
  constructor(
    private game: Game,
    private card: Card,
    private origin: Point3D,
    private type: TargetingType
  ) {}

  get position() {
    return Position.fromPoint3D(this.origin);
  }

  isWithinRange(point: Point3D) {
    if (!this.position.isNearby(point, this.game)) return false;

    return true;
  }

  canTargetAt(point: Point3D) {
    if (!this.isWithinRange(point)) return false;

    return isValidTargetingType(this.game, point, this.card.player, this.type);
  }
}
