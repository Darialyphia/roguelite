import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { RushModifierMixin } from '../modifier-mixins/rush.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class RushModifier extends UnitModifier {
  constructor(game: Game) {
    super(createEntityId(KEYWORDS.RUSH.id), game, {
      stackable: false,
      mixins: [new RushModifierMixin(game)]
    });
  }
}
