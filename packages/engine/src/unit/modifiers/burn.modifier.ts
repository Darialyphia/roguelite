import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { BurnModifierMixin } from '../modifier-mixins/burn.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class BurnModifier extends UnitModifier {
  constructor(game: Game, options: { source: Card; initialStacks: number }) {
    super(createEntityId(KEYWORDS.BURN.id), game, {
      stackable: true,
      initialStacks: options.initialStacks,
      mixins: [new BurnModifierMixin(game, options.source)]
    });
  }
}
