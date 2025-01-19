import { isDefined, type Point3D } from '@game/shared';
import {
  isValidTargetingType,
  type TargetingStrategy,
  type TargetingType
} from './targeting-strategy';
import type { Game } from '../game/game';
import type { SpellCard } from '../card/spell-card.entity';

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

    return isValidTargetingType(
      this.game,
      point,
      this.card.player,
      this.options.targetingType
    );
  }
}
