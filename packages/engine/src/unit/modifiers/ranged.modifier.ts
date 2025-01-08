import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { RangedModifierMixin } from '../modifier-mixins/ranged.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class RangedModifier extends UnitModifier {
  constructor(game: Game, maxRange: number) {
    super(createEntityId(KEYWORDS.RANGED.id), game, {
      stackable: false,
      mixins: [new RangedModifierMixin(game, maxRange)]
    });
  }
}
