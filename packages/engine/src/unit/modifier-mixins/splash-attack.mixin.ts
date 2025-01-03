import { createEntityId } from '../../entity';
import { Game } from '../../game/game';
import { IntersectionAoeShape } from '../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../targeting/targeting-strategy';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class SplashAttackdModifierMixin extends UnitModifierMixin {
  static modifierName = createEntityId('SPLASH_ATTACK');

  private modifier!: UnitModifier;

  constructor(game: Game) {
    super(game);
  }

  interceptor() {
    return new IntersectionAoeShape(this.game, this.modifier.target, {
      allow3D: false,
      targetingType: TARGETING_TYPE.ENEMY
    });
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    unit.addInterceptor('attackAOEShape', this.interceptor.bind(this));
  }

  onRemoved(unit: Unit): void {
    unit.removeInterceptor('attackAOEShape', this.interceptor.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
