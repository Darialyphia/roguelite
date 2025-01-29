import { Damage } from '../../../combat/damage/damage';
import { DAMAGE_TYPES } from '../../../combat/damage/damage.enums';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { RUNES } from '../../../utils/rune';
import { type SpellCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS } from '../../card-enums';

export const redFireball: SpellCardBlueprint = {
  id: 'red-fireball',
  iconId: 'spell-fireball',
  set: CARD_SETS.CORE,
  name: 'Fire ball',
  description: 'Deal 2 damage to an enemy.',
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
      target.takeDamage(
        card,
        new Damage({
          baseAmount: 2,
          source: card,
          type: DAMAGE_TYPES.SPELL,
          scalings: [new NoScalingStrategy()],
          mitigations: [new NoMitigationStrategy()]
        })
      );
    });
  }
};
