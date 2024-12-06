import type { EntityId } from '../../entity';
import type { Game } from '../../game/game';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';

const MODIFIER_ID = 'UNIT_MODIFIER_FROZEN' as EntityId;

export class FrozenModifier extends UnitModifier {
  static MODIFIER_ID = MODIFIER_ID;

  constructor(game: Game) {
    super(MODIFIER_ID, game, {
      stackable: false,
      mixins: []
    });
  }

  get infos() {
    return {
      name: `Frozen ${this.stacks}`,
      description: `This unit cannot move until the end of its next turn.`,
      iconId: 'modifier-frozen',
      spriteId: 'fx-frozen'
    };
  }

  private interceptor = () => false;

  applyTo(unit: Unit): void {
    super.applyTo(unit);

    this.target.addInterceptor('canMove', this.interceptor);
    this.target.once('end_turn', this.remove.bind(this));
  }

  remove(): void {
    super.remove();
    this.target.removeInterceptor('canMove', this.interceptor);
  }
}
