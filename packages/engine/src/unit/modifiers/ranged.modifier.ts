import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { RangedModifierMixin } from '../modifier-mixins/ranged.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class RangedModifier extends UnitModifier {
  constructor(game: Game, source: Card, maxRange: number) {
    super(createEntityId(KEYWORDS.RANGED.id), game, source, {
      stackable: false,
      mixins: [new RangedModifierMixin(game, maxRange)],
      name: KEYWORDS.RANGED.name,
      description: KEYWORDS.RANGED.description,
      iconId: KEYWORDS.RANGED.spriteId
    });
  }
}
