import { Game } from '../../game/game';
import { IntersectionAoeShape } from '../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../targeting/targeting-strategy';
import { KEYWORDS } from '../keywords';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class SplashAttackdModifierMixin extends UnitModifierMixin {
  private modifier!: UnitModifier;

  constructor(game: Game) {
    super(game);
    this.interceptor = this.interceptor.bind(this);
  }

  interceptor() {
    return new IntersectionAoeShape(this.game, this.modifier.target, {
      allow3D: false,
      targetingType: TARGETING_TYPE.ENEMY_UNIT
    });
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    unit.addInterceptor('attackAOEShape', this.interceptor);
    unit.addKeyword(KEYWORDS.SPLASH_ATTACK);
  }

  onRemoved(unit: Unit): void {
    unit.removeInterceptor('attackAOEShape', this.interceptor);
    unit.removeKeyword(KEYWORDS.SPLASH_ATTACK);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
