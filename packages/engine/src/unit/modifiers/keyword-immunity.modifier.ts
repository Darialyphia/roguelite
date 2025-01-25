import type { Card } from '../../card/card.entity';
import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS, type Keyword } from '../keywords';
import { InterceptorModifierMixin } from '../modifier-mixins/interceptor.mixin';
import { UnitModifier } from '../unit-modifier.entity';

export class KeywordImmunityModifier extends UnitModifier {
  constructor(game: Game, source: Card, options: { keyword: Keyword }) {
    super(createEntityId(`${KEYWORDS.BURN.id}_immunity`), game, source, {
      name: `Immunity to ${options.keyword.name}`,
      description: `This unit is unaffected by ${options.keyword.name}`,
      iconId: 'keyword-immunity',
      stackable: false,
      mixins: [
        new InterceptorModifierMixin(game, {
          key: 'canReceiveModifier',
          interceptor(value, ctx) {
            if (ctx.modifier.id === options.keyword.id) return false;

            return value;
          }
        })
      ]
    });
  }
}
