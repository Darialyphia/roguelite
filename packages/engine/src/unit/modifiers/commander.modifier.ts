import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { CommanderModifierMixin } from '../modifier-mixins/commander.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class CommanderModifier extends UnitModifier {
  constructor(game: Game) {
    super(createEntityId(KEYWORDS.COMMANDER.id), game, {
      stackable: false,
      mixins: [new CommanderModifierMixin(game)]
    });
  }
}
