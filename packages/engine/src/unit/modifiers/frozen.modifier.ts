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
      mixins: [new DurationModifierMixin(game)],
      infos: {
        name: 'Frozen',
        description: 'This unit cannot move',
        iconId: 'modifier-frozen',
        spriteId: 'fx-frozen'
      }
    });
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
