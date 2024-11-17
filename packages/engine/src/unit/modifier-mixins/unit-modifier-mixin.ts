import type { Game } from '../../game/game';
import type { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';

export abstract class UnitModifierMixin {
  protected game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  abstract onApplied(unit: Unit, modifier: UnitModifier): void;
  abstract onRemoved(unit: Unit, modifier: UnitModifier): void;
  abstract onReapplied(unit: Unit, modifier: UnitModifier): void;
}
