import { Game, type GameEventMap } from '../../game/game';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit, UnitEventMap } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class GameEventModifierMixin<
  TEvent extends keyof GameEventMap
> extends UnitModifierMixin {
  constructor(
    game: Game,
    private options: {
      eventName: TEvent;
      handler: (event: GameEventMap[TEvent][0]) => void;
      once?: boolean;
    }
  ) {
    super(game);
  }

  onApplied(): void {
    if (this.options.once) {
      this.game.once(this.options.eventName, this.options.handler as any);
    } else {
      this.game.on(this.options.eventName, this.options.handler as any);
    }
  }

  onRemoved(): void {
    this.game.off(this.options.eventName, this.options.handler as any);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
