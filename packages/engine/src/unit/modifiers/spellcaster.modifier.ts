import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { SpellCasterModifierMixin } from '../modifier-mixins/spellcaster.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class SpellCasterModifier extends UnitModifier {
  constructor(game: Game) {
    super(createEntityId(KEYWORDS.SPELLCASTER.id), game, {
      stackable: false,
      mixins: [new SpellCasterModifierMixin(game)]
    });
  }
}
