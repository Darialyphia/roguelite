import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { FearsomeModifierMixin } from '../modifier-mixins/fearsome.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class FearsomeModifier extends UnitModifier {
  constructor(game: Game, source: Card) {
    super(createEntityId(KEYWORDS.FEARSOME.id), game, source, {
      stackable: false,
      mixins: [new FearsomeModifierMixin(game)],
      iconId: KEYWORDS.FEARSOME.spriteId,
      name: KEYWORDS.FEARSOME.name,
      description: KEYWORDS.FEARSOME.description
    });
  }
}
