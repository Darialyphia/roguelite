import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { InterceptorModifierMixin } from '../modifier-mixins/interceptor.mixin';
import { KeywordModifierMixin } from '../modifier-mixins/keyword.mixin';
import { SelfEventModifierMixin } from '../modifier-mixins/self-event.mixin';
import { UNIT_EVENTS } from '../unit-enums';
import { UnitModifier } from '../unit-modifier.entity';

export class AltarModifier extends UnitModifier {
  constructor(game: Game, source: Card) {
    super(createEntityId(KEYWORDS.ALTAR.id), game, source, {
      name: KEYWORDS.ALTAR.name,
      description: KEYWORDS.ALTAR.description,
      iconId: KEYWORDS.ALTAR.spriteId,
      stackable: false,
      mixins: [
        new KeywordModifierMixin(game, KEYWORDS.ALTAR),
        new InterceptorModifierMixin(game, {
          key: 'canMove',
          interceptor: () => false
        }),
        new InterceptorModifierMixin(game, {
          key: 'canAttack',
          interceptor: () => false
        }),
        new InterceptorModifierMixin(game, {
          key: 'canBeDestroyed',
          interceptor: () => false
        }),
        new InterceptorModifierMixin(game, {
          key: 'canCounterAttack',
          interceptor: () => false
        }),
        new InterceptorModifierMixin(game, {
          key: 'canSummonNearby',
          interceptor: () => true
        }),
        new SelfEventModifierMixin(game, {
          eventName: UNIT_EVENTS.BEFORE_DESTROY,
          handler: () => {
            this.target.player.triggerAltarReward();
          },
          once: true
        })
      ]
    });
  }
}
