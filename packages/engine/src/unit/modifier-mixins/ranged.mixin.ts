import { createEntityId } from '../../entity';
import { Game } from '../../game/game';
import { RangedTargetingStrategy } from '../../targeting/ranged-targeting.strategy';
import { TARGETING_TYPE } from '../../targeting/targeting-strategy';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class RangedModifierMixin extends UnitModifierMixin {
  static modifierName = createEntityId('RANGED');

  private modifier!: UnitModifier;

  constructor(
    game: Game,
    private maxRange: number
  ) {
    super(game);
  }

  interceptor() {
    return new RangedTargetingStrategy(
      this.game,
      this.modifier.target,
      TARGETING_TYPE.ENEMY,
      { minRange: 1, maxRange: this.maxRange }
    );
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    unit.addInterceptor('attackTargetingPattern', this.interceptor.bind(this));
  }

  onRemoved(unit: Unit): void {
    unit.removeInterceptor('attackTargetingPattern', this.interceptor.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
