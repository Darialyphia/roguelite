import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { RageModifierMixin } from '../modifier-mixins/rage.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class RageModifier extends UnitModifier {
  constructor(game: Game, source: Card) {
    super(createEntityId(KEYWORDS.RAGE.id), game, source, {
      name: KEYWORDS.RAGE.name,
      description: KEYWORDS.RAGE.description,
      iconId: KEYWORDS.RAGE.spriteId,
      stackable: false,
      mixins: [new RageModifierMixin(game)]
    });
  }
}
