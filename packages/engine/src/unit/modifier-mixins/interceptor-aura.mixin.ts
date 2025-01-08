import { type EntityId } from '../../entity';
import type { Game } from '../../game/game';
import type { inferInterceptor, inferInterceptorValue } from '../../utils/interceptable';
import type { UnitModifier } from '../unit-modifier.entity';
import type { Unit, UnitInterceptor } from '../unit.entity';
import { AuraModifierMixin } from './aura.mixin';

export class InterceptorAuraModifierMixin<
  TKey extends keyof UnitInterceptor
> extends AuraModifierMixin {
  private interceptorMap = new Map<EntityId, inferInterceptor<TKey>>();

  constructor(
    game: Game,
    private options: {
      key: TKey;
      interceptor: (
        value: inferInterceptorValue<UnitInterceptor[TKey]>,
        unit: Unit,
        modifier: UnitModifier
      ) => inferInterceptorValue<UnitInterceptor[TKey]>;
      isElligible: (unit: Unit, modifier: UnitModifier) => boolean;
    }
  ) {
    super(game);
  }

  isElligible(unit: Unit): boolean {
    return this.options.isElligible(unit, this.modifier);
  }

  onGainAura(unit: Unit): void {
    const interceptor = (value: inferInterceptorValue<UnitInterceptor[TKey]>) =>
      this.options.interceptor(value, unit, this.modifier);
    this.interceptorMap.set(unit.id, interceptor as any);
    unit.addInterceptor(this.options.key, interceptor as any);
  }

  onLoseAura(unit: Unit): void {
    unit.removeInterceptor(this.options.key, this.interceptorMap.get(unit.id)! as any);
    this.interceptorMap.delete(unit.id);
  }
}
