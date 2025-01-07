import { isDefined, type Point3D } from '@game/shared';
import {
  TARGETING_TYPE,
  type TargetingStrategy,
  type TargetingType
} from './targeting-strategy';
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
      .with(TARGETING_TYPE.ANYWHERE, () => true)
      .with(TARGETING_TYPE.EMPTY, () => !unit)
      .with(TARGETING_TYPE.ALLY_UNIT, () => !!unit?.player.isAlly(this.player))
      .with(
        TARGETING_TYPE.ALLY_GENERAL,
        () => !!unit?.player.isAlly(this.player) && unit.isGeneral
      )
      .with(
        TARGETING_TYPE.ALLY_MINION,
        () => !!unit?.player.isAlly(this.player) && !unit.isGeneral
      )
      .with(TARGETING_TYPE.ENEMY_UNIT, () => !!unit?.player.isEnemy(this.player))
      .with(
        TARGETING_TYPE.ENEMY_GENERAL,
        () => !!unit?.player.isEnemy(this.player) && unit.isGeneral
      )
      .with(
        TARGETING_TYPE.ENEMY_MINION,
        () => !!unit?.player.isEnemy(this.player) && !unit.isGeneral
      )
      .with(TARGETING_TYPE.UNIT, () => isDefined(unit))
      .with(TARGETING_TYPE.GENERAL, () => isDefined(unit) && unit?.isGeneral)
      .with(TARGETING_TYPE.MINION, () => isDefined(unit) && !unit.isGeneral)
      .exhaustive();
  }
}
