import { Game } from '../../game/game';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';
import { Damage } from '../../combat/damage/damage';
import type { Card } from '../../card/card.entity';
import { NoMitigationStrategy } from '../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../combat/damage/scaling/no-scaling.strategy';
import { PLAYER_EVENTS } from '../../player/player-enums';

export class BurnModifierMixin extends UnitModifierMixin {
  private modifier!: UnitModifier;

  constructor(
    game: Game,
    private source: Card
  ) {
    super(game);
    this.onTurnStart = this.onTurnStart.bind(this);
  }

  onTurnStart() {
    this.modifier.target.takeDamage(
      this.modifier.target.card,
      new Damage({
        baseAmount: this.modifier.stacks,
        source: this.source,
        mitigations: [new NoMitigationStrategy()],
        scalings: [new NoScalingStrategy()]
      })
    );
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    unit.player.on(PLAYER_EVENTS.START_TURN, this.onTurnStart);
  }

  onRemoved(unit: Unit) {
    unit.player.off(PLAYER_EVENTS.START_TURN, this.onTurnStart);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied() {}
}
