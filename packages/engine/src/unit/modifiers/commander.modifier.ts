import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { CommanderModifierMixin } from '../modifier-mixins/commander.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class CommanderModifier extends UnitModifier {
  constructor(game: Game, source: Card) {
    super(createEntityId(KEYWORDS.COMMANDER.id), game, source, {
      stackable: false,
      mixins: [new CommanderModifierMixin(game)],
      name: KEYWORDS.COMMANDER.name,
      description: KEYWORDS.COMMANDER.description,
      iconId: KEYWORDS.COMMANDER.spriteId
    });
  }
}
