import { isDefined, type Point3D } from '@game/shared';
import {
  TARGETING_TYPE,
  type TargetingStrategy,
  type TargetingType
} from './targeting-strategy';
import type { Game } from '../game/game';
import type { SpellCard } from '../card/spell-card.entity';
import { match } from 'ts-pattern';

export class SpellTargetingtrategy implements TargetingStrategy {
  constructor(
    private game: Game,
    private card: SpellCard,
    private options: { maxRange: number; targetingType: TargetingType }
  ) {}

  isWithinRange(point: Point3D) {
    return this.card.player.units.some(
      unit =>
        unit.canCastSpells &&
        unit.position.isWithinCells(point, this.options.maxRange, this.game)
    );
  }

  canTargetAt(point: Point3D) {
    if (!this.isWithinRange(point)) return false;

    const unit = this.game.unitSystem.getUnitAt(point);

    return match(this.options.targetingType)
      .with(TARGETING_TYPE.ANYWHERE, () => true)
      .with(TARGETING_TYPE.EMPTY, () => !unit)
      .with(TARGETING_TYPE.ALLY_UNIT, () => !!unit?.player.isAlly(this.card.player))
      .with(
        TARGETING_TYPE.ALLY_GENERAL,
        () => !!unit?.player.isAlly(this.card.player) && unit.isGeneral
      )
      .with(
        TARGETING_TYPE.ALLY_MINION,
        () => !!unit?.player.isAlly(this.card.player) && !unit.isGeneral
      )
      .with(TARGETING_TYPE.ENEMY_UNIT, () => !!unit?.player.isEnemy(this.card.player))
      .with(
        TARGETING_TYPE.ENEMY_GENERAL,
        () => !!unit?.player.isEnemy(this.card.player) && unit.isGeneral
      )
      .with(
        TARGETING_TYPE.ENEMY_MINION,
        () => !!unit?.player.isEnemy(this.card.player) && !unit.isGeneral
      )
      .with(TARGETING_TYPE.UNIT, () => isDefined(unit))
      .with(TARGETING_TYPE.GENERAL, () => isDefined(unit) && unit?.isGeneral)
      .with(TARGETING_TYPE.MINION, () => isDefined(unit) && !unit.isGeneral)
      .exhaustive();
  }
}
