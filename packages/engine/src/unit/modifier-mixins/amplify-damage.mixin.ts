import { Game } from '../../game/game';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class AmplifyDamagedModifierMixin extends UnitModifierMixin {
  private modifier!: UnitModifier;

  constructor(
    game: Game,
    private options: {
      when(attacker: Unit, defender: Unit): boolean;
      amount(attacker: Unit, defender: Unit): number;
    }
  ) {
    super(game);
    this.interceptor = this.interceptor.bind(this);
  }

  interceptor(
    value: number,
    { attacker, defender }: { attacker: Unit; defender?: Unit }
  ) {
    if (!defender) return value;

    const shouldApply = this.options.when(attacker, defender);
    if (!shouldApply) return value;

    return value + this.options.amount(attacker, defender);
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    unit.addInterceptor('damageDealt', this.interceptor);
  }

  onRemoved(unit: Unit): void {
    unit.removeInterceptor('damageDealt', this.interceptor);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
