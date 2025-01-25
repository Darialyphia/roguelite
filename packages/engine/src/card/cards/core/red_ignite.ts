import { Damage } from '../../../combat/damage/damage';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { BurnModifier } from '../../../unit/modifiers/burn.modifier';
import { RUNES } from '../../../utils/rune';
import { type SpellCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS } from '../../card-enums';

export const redIgnite: SpellCardBlueprint = {
  id: 'red-ignite',
  iconId: 'spell-ignite',
  set: CARD_SETS.CORE,
  name: 'Ignite',
  description: 'Give @Burn(1)@. Draw a card',
  kind: CARD_KINDS.SPELL,
  aiHints: {},
  cost: {
    gold: 1,
    runes: [RUNES.RED]
  },
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new AnywhereTargetingStrategy(
          game,
          card.player,
          TARGETING_TYPE.ENEMY_MINION
        );
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
      target.addModifier(new BurnModifier(game, card, { initialStacks: 1 }));
    });
    card.player.draw(1);
  }
};
