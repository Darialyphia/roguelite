import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { BurnModifierMixin } from '../modifier-mixins/burn.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class BurnModifier extends UnitModifier {
  constructor(
    game: Game,
    source: Card,
    options: { source: Card; initialStacks: number }
  ) {
    super(createEntityId(KEYWORDS.BURN.id), game, source, {
      name: KEYWORDS.BURN.name,
      description: KEYWORDS.BURN.description,
      iconId: KEYWORDS.BURN.spriteId,
      stackable: true,
      initialStacks: options.initialStacks,
      mixins: [new BurnModifierMixin(game, options.source)]
    });
  }
}
