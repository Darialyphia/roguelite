import { Game } from '../../game/game';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit, UnitEventMap } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class SelfEventModifierMixin<
  TEvent extends keyof UnitEventMap
> extends UnitModifierMixin {
  private modifier!: UnitModifier;

  constructor(
    game: Game,
    private options: {
      eventName: TEvent;
      handler: (event: UnitEventMap[TEvent][0]) => void;
      once?: boolean;
    }
  ) {
    super(game);
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    if (this.options.once) {
      unit.once(this.options.eventName, this.options.handler as any);
    } else {
      unit.on(this.options.eventName, this.options.handler as any);
    }
  }

  onRemoved(unit: Unit): void {
    unit.off(this.options.eventName, this.options.handler as any);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
