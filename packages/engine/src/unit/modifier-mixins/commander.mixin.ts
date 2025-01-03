import { createEntityId } from '../../entity';
import { Game } from '../../game/game';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class CommanderModifierMixin extends UnitModifierMixin {
  static modifierName = createEntityId('COMMANDER');

  private modifier!: UnitModifier;

  constructor(
    game: Game,
    private maxRange: number
  ) {
    super(game);
  }

  interceptor() {
    return true;
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    unit.addInterceptor('canSummonUnitsNearby', this.interceptor.bind(this));
  }

  onRemoved(unit: Unit): void {
    unit.removeInterceptor('canSummonUnitsNearby', this.interceptor.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
