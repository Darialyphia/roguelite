import { Damage } from '../../../combat/damage/damage';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { RUNES } from '../../../utils/rune';
import { type SpellCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const redFireball: SpellCardBlueprint = {
  id: 'red-fireball',
  iconId: 'spell-fireball',
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
        return new AnywhereTargetingStrategy(game, card.player, TARGETING_TYPE.ENEMY);
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
          scalings: [new NoScalingStrategy()],
          mitigations: [new NoMitigationStrategy()]
        })
      );
    });
  }
};
