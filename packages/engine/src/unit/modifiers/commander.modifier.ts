import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { InterceptorModifierMixin } from '../modifier-mixins/interceptor.mixin';
import { KeywordModifierMixin } from '../modifier-mixins/keyword.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class CommanderModifier extends UnitModifier {
  constructor(game: Game, source: Card) {
    super(createEntityId(KEYWORDS.COMMANDER.id), game, source, {
      stackable: false,
      mixins: [
        new InterceptorModifierMixin(game, {
          key: 'canSummonNearby',
          interceptor: () => true
        }),
        new KeywordModifierMixin(game, KEYWORDS.COMMANDER)
      ],
      name: KEYWORDS.COMMANDER.name,
      description: KEYWORDS.COMMANDER.description,
      iconId: KEYWORDS.COMMANDER.spriteId
    });
  }
}
