import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { SplashAttackdModifierMixin } from '../modifier-mixins/splash-attack.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class SplashAttackModifier extends UnitModifier {
  constructor(game: Game) {
    super(createEntityId(KEYWORDS.SPLASH_ATTACK.id), game, {
      stackable: false,
      mixins: [new SplashAttackdModifierMixin(game)]
    });
  }
}
