import { type Point3D } from '@game/shared';
import {
  isValidTargetingType,
  type TargetingStrategy,
  type TargetingType
} from './targeting-strategy';
import type { Game } from '../game/game';
import type { Player } from '../player/player.entity';

export class AnywhereTargetingStrategy implements TargetingStrategy {
  constructor(
    private game: Game,
    private player: Player,
    private type: TargetingType
  ) {}

  isWithinRange() {
    return true;
  }

  canTargetAt(point: Point3D) {
    return isValidTargetingType(this.game, point, this.player, this.type);
  }
}
