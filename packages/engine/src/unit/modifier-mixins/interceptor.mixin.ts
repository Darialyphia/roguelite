import type { Game } from '../../game/game';
import type { inferInterceptorValue } from '../../utils/interceptable';
import type { UnitModifier } from '../unit-modifier.entity';
import type { Unit, UnitInterceptor } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class InterceptorModifierMixin<
  TKey extends keyof UnitInterceptor
> extends UnitModifierMixin {
  private modifier!: UnitModifier;

  constructor(
    game: Game,
    private options: {
      key: TKey;
      interceptor: (
        value: inferInterceptorValue<UnitInterceptor[TKey]>,
        modifier: UnitModifier
      ) => inferInterceptorValue<UnitInterceptor[TKey]>;
    }
  ) {
    super(game);
  }

  interceptor(value: inferInterceptorValue<UnitInterceptor[TKey]>) {
    return this.options.interceptor(value, this.modifier);
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    unit.addInterceptor(this.options.key, this.interceptor.bind(this) as any);
  }

  onRemoved(unit: Unit): void {
    unit.removeInterceptor(this.options.key, this.interceptor as any);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied() {}
}
