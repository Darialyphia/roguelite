import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { InterceptorModifierMixin } from '../modifier-mixins/interceptor.mixin';
import { KeywordModifierMixin } from '../modifier-mixins/keyword.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class StructureModifier extends UnitModifier {
  constructor(game: Game, source: Card) {
    super(createEntityId(KEYWORDS.STRUCTURE.id), game, source, {
      stackable: false,
      mixins: [
        new InterceptorModifierMixin(game, {
          key: 'canMove',
          interceptor: () => false
        }),
        new InterceptorModifierMixin(game, {
          key: 'canAttack',
          interceptor: () => false
        }),
        new KeywordModifierMixin(game, KEYWORDS.STRUCTURE)
      ],
      name: KEYWORDS.STRUCTURE.name,
      description: KEYWORDS.STRUCTURE.description,
      iconId: KEYWORDS.STRUCTURE.spriteId
    });
  }
}
