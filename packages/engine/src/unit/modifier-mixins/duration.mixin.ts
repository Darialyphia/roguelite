import { Game } from '../../game/game';
import { PLAYER_EVENTS } from '../../player/player.entity';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class DurationModifierMixin extends UnitModifierMixin {
  private modifier!: UnitModifier;

  private maxDuration: number;

  constructor(
    game: Game,
    private duration = 1
  ) {
    super(game);
    this.maxDuration = this.duration;
  }

  onTurnStart() {
    this.duration--;
    if (this.duration === 0) {
      this.modifier.target.removeModifier(this.modifier.id);
    }
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    unit.player.on(PLAYER_EVENTS.START_TURN, this.onTurnStart.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onRemoved(unit: Unit, modifier: UnitModifier): void {
    unit.player.off(PLAYER_EVENTS.START_TURN, this.onTurnStart);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  onReapplied(unit: Unit, modifier: UnitModifier): void {}
}
