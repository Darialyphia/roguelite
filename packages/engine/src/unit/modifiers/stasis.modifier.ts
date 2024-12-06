import type { EntityId } from '../../entity';
import type { Game } from '../../game/game';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';

const MODIFIER_ID = 'UNIT_MODIFIER_STASIS' as EntityId;

export class StasisModifier extends UnitModifier {
  static MODIFIER_ID = MODIFIER_ID;

  constructor(game: Game) {
    super(MODIFIER_ID, game, {
      stackable: false,
      mixins: []
    });
  }

  get infos() {
    return {
      name: `Stasis ${this.stacks}`,
      description: `This unit cannot move, attack, use cards, or be targeted until the end of this turn.`,
      iconId: 'modifier-stasis',
      spriteId: 'fx-stasis'
    };
  }

  private interceptor = () => false;

  applyTo(unit: Unit): void {
    super.applyTo(unit);

    this.target.addInterceptor('canMove', this.interceptor);
    this.target.addInterceptor('canAttack', this.interceptor);
    this.target.addInterceptor('canPlayCardFromHand', this.interceptor);
    this.target.addInterceptor('canBeAttackTarget', this.interceptor);
    this.target.addInterceptor('canBeCardTarget', this.interceptor);
    this.game.once('turn.turn_end', this.remove.bind(this));
  }

  remove(): void {
    super.remove();
    this.target.removeInterceptor('canMove', this.interceptor);
    this.target.removeInterceptor('canAttack', this.interceptor);
    this.target.removeInterceptor('canPlayCardFromHand', this.interceptor);
    this.target.removeInterceptor('canBeAttackTarget', this.interceptor);
    this.target.removeInterceptor('canBeCardTarget', this.interceptor);
  }
}
