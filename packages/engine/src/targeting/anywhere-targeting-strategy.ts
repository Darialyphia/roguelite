import type { Point3D } from '@game/shared';
import type { TargetingStrategy, TargetingType } from './targeting-strategy';
import type { Game } from '../game/game';
import { match } from 'ts-pattern';
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
    const unit = this.game.unitSystem.getUnitAt(point);

    return match(this.type)
      .with('any', () => true)
      .with('empty', () => !unit)
      .with('ally', () => !!unit?.player.isAlly(this.player))
      .with('enemy', () => !!unit?.player.isEnemy(this.player))
      .with('both', () => !!unit)
      .exhaustive();
  }
}
