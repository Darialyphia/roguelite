import { isDefined, type Point3D } from '@game/shared';
import {
  TARGETING_TYPE,
  type TargetingStrategy,
  type TargetingType
} from './targeting-strategy';
import type { Unit } from '../unit/unit.entity';
import type { Game } from '../game/game';
import { match } from 'ts-pattern';

export class MeleeTargetingStrategy implements TargetingStrategy {
  constructor(
    private game: Game,
    private unit: Unit,
    private type: TargetingType,
    private allowCenter = true
  ) {}

  isWithinRange(point: Point3D) {
    if (!this.allowCenter && this.unit.position.equals(point)) return false;
    if (!this.unit.position.isNearby(point, this.game)) return false;

    return true;
  }

  canTargetAt(point: Point3D) {
    if (!this.isWithinRange(point)) return false;

    const unit = this.game.unitSystem.getUnitAt(point);

    return match(this.type)
      .with(TARGETING_TYPE.ANYWHERE, () => true)
      .with(TARGETING_TYPE.EMPTY, () => !unit)
      .with(TARGETING_TYPE.ALLY_UNIT, () => !!unit?.isAlly(this.unit))
      .with(TARGETING_TYPE.ALLY_ALTAR, () => !!unit?.isAlly(this.unit) && unit.isAltar)
      .with(TARGETING_TYPE.ALLY_MINION, () => !!unit?.isAlly(this.unit) && !unit.isAltar)
      .with(TARGETING_TYPE.ENEMY_UNIT, () => !!unit?.isEnemy(this.unit))
      .with(TARGETING_TYPE.ENEMY_ALTAR, () => !!unit?.isEnemy(this.unit) && unit.isAltar)
      .with(
        TARGETING_TYPE.ENEMY_MINION,
        () => !!unit?.isEnemy(this.unit) && !unit.isAltar
      )
      .with(TARGETING_TYPE.UNIT, () => isDefined(unit))
      .with(TARGETING_TYPE.ALTAR, () => isDefined(unit) && unit?.isAltar)
      .with(TARGETING_TYPE.MINION, () => isDefined(unit) && !unit.isAltar)
      .exhaustive();
  }
}
