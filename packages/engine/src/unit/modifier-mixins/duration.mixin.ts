import { Game, GAME_EVENTS } from '../../game/game';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class DurationModifierMixin extends UnitModifierMixin {
  private modifier!: UnitModifier;

  constructor(game: Game) {
    super(game);
  }
  onTurnStart() {
    this.modifier.removeStacks(1);
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    this.game.on(GAME_EVENTS.TURN_START, this.onTurnStart.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onRemoved(unit: Unit, modifier: UnitModifier): void {
    this.game.off(GAME_EVENTS.TURN_START, this.onTurnStart);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  onReapplied(unit: Unit, modifier: UnitModifier): void {}
}
