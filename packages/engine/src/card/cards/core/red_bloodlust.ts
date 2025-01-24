import { createEntityId } from '../../../entity';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { InterceptorModifierMixin } from '../../../unit/modifier-mixins/interceptor.mixin';
import { RageModifier } from '../../../unit/modifiers/rage.modifier';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { RUNES } from '../../../utils/rune';
import { type SpellCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS } from '../../card-enums';

export const redBloodlust: SpellCardBlueprint = {
  id: 'red-bloodlust',
  iconId: 'spell-bloodlust',
  set: CARD_SETS.CORE,
  name: 'Bloodlust',
  description: 'Give @Rage@ and +1/+0 to a minion.',
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
        return new AnywhereTargetingStrategy(game, card.player, TARGETING_TYPE.MINION);
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
        new UnitModifier(createEntityId('bloodlust'), game, card, {
          stackable: true,
          initialStacks: 1,
          iconId: 'keyword-attack-buff',
          name: 'Bloodlust buff',
          description: '+1/+0',
          mixins: [
            new InterceptorModifierMixin(game, {
              key: 'attack',
              interceptor: (attack, modifier) => attack + modifier.stacks
            })
          ]
        })
      );
      target.addModifier(new RageModifier(game, card));
    });
  }
};
