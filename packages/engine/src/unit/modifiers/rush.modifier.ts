import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { RushModifierMixin } from '../modifier-mixins/rush.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class RushModifier extends UnitModifier {
  constructor(game: Game, source: Card) {
    super(createEntityId(KEYWORDS.RUSH.id), game, source, {
      stackable: false,
      mixins: [new RushModifierMixin(game)],
      name: KEYWORDS.RUSH.name,
      description: KEYWORDS.RUSH.description,
      iconId: KEYWORDS.RUSH.spriteId
    });
  }
}
