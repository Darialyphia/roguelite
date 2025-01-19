import { Game } from '../../game/game';
import { PLAYER_EVENTS } from '../../player/player-enums';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class UntilEndOfTurnModifierMixin extends UnitModifierMixin {
  private modifier!: UnitModifier;

  constructor(game: Game) {
    super(game);
    this.onTurnEnd = this.onTurnEnd.bind(this);
  }

  onTurnEnd() {
    this.modifier.target.removeModifier(this.modifier.id);
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    this.game.turnSystem.activePlayer.once(PLAYER_EVENTS.END_TURN, this.onTurnEnd);
  }

  onRemoved(unit: Unit): void {
    unit.player.off(PLAYER_EVENTS.END_TURN, this.onTurnEnd);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
