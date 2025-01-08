import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { FearsomeModifierMixin } from '../modifier-mixins/fearsome.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class FearsomeModifier extends UnitModifier {
  constructor(game: Game) {
    super(createEntityId(KEYWORDS.FEARSOME.id), game, {
      stackable: false,
      mixins: [new FearsomeModifierMixin(game)]
    });
  }
}
