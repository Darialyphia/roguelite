import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { SplashAttackdModifierMixin } from '../modifier-mixins/splash-attack.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class SplashAttackModifier extends UnitModifier {
  constructor(game: Game, source: Card) {
    super(createEntityId(KEYWORDS.SPLASH_ATTACK.id), game, source, {
      stackable: false,
      mixins: [new SplashAttackdModifierMixin(game)],
      name: KEYWORDS.SPLASH_ATTACK.name,
      description: KEYWORDS.SPLASH_ATTACK.description,
      iconId: KEYWORDS.SPLASH_ATTACK.spriteId
    });
  }
}
