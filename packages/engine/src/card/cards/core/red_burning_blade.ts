import { createEntityId } from '../../../entity';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { SpellTargetingtrategy } from '../../../targeting/spell-targeting.strategy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { InterceptorModifierMixin } from '../../../unit/modifier-mixins/interceptor.mixin';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { RUNES } from '../../../utils/rune';
import { type SpellCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const redBurningBlade: SpellCardBlueprint = {
  id: 'red-burning-blade',
  iconId: 'spell-burning-blade',
  name: 'Burning Blade',
  description: 'Give an ally minion +2 / +0.',
  kind: CARD_KINDS.SPELL,
  aiHints: {},
  cost: {
    gold: 2,
    runes: [RUNES.RED]
  },
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new SpellTargetingtrategy(game, card, {
          maxRange: 3,
          targetingType: TARGETING_TYPE.ALLY_MINION
        });
      }
    }
  ],
  getAoe(game) {
    return new PointAOEShape(game);
  },
  vfx: {
    play() {
      return { tracks: [] };
    }
  },
  onPlay(game, card, cellTargets, unitTargets) {
    unitTargets.forEach(target => {
      target.addModifier(
        new UnitModifier(createEntityId('burning_blade'), game, {
          stackable: true,
          initialStacks: 1,
          mixins: [
            new InterceptorModifierMixin(game, {
              key: 'attack',
              interceptor: (attack, modifier) => attack + 2 * modifier.stacks
            })
          ]
        })
      );
    });
  }
};
