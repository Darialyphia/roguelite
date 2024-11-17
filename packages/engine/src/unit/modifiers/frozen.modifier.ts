import type { EntityId } from '../../entity';
import type { Game } from '../../game/game';
import { DurationModifierMixin } from '../modifier-mixins/duration.mixin';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';

const MODIFIER_ID = 'UNIT_MODIFIER_FROZEN' as EntityId;

export class FrozenModifier extends UnitModifier {
  constructor(game: Game, duration: number) {
    super(MODIFIER_ID, game, {
      stackable: true,
      initialStacks: duration,
      mixins: [new DurationModifierMixin(game)]
    });
  }

  get infos() {
    return {
      name: `Frozen ${this.stacks}`,
      description: `This unit cannot move for ${this.stacks} turn${this.stacks > 1 ? 's' : ''}.`,
      iconId: 'modifier-frozen',
      spriteId: 'fx-frozen'
    };
  }

  private interceptor = () => false;

  applyTo(unit: Unit): void {
    super.applyTo(unit);

    this.target.addInterceptor('canMove', this.interceptor);
  }

  remove(): void {
    super.remove();
    this.target.removeInterceptor('canMove', this.interceptor);
  }
}
