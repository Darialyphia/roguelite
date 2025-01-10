import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { SpellCasterModifierMixin } from '../modifier-mixins/spellcaster.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class SpellCasterModifier extends UnitModifier {
  constructor(game: Game, source: Card) {
    super(createEntityId(KEYWORDS.SPELLCASTER.id), game, source, {
      stackable: false,
      mixins: [new SpellCasterModifierMixin(game)],
      name: KEYWORDS.SPELLCASTER.name,
      description: KEYWORDS.SPELLCASTER.description,
      iconId: KEYWORDS.SPELLCASTER.spriteId
    });
  }
}
