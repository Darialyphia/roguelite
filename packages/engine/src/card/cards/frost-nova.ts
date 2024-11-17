import { RingAOEShape } from '../../targeting/aoe-shapes';
import { SelfTargetingPatternStrategy } from '../../targeting/self-targeting-strategy';
import { TARGETING_TYPE } from '../../targeting/targeting-strategy';
import type { CardBlueprint } from '../card-blueprint';

export const frostNova: CardBlueprint = {
  id: 'frost-nova',
  iconId: 'frost-nova',
  name: 'Frost Nova',
  cost: 1,
  description: 'Freeze nearby enemies until the end of the turn',
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new SelfTargetingPatternStrategy(card.unit);
      }
    }
  ],
  getAoe(game, card, points) {
    return new RingAOEShape(game, card.unit, points[0], {
      allow3D: true,
      targetingType: TARGETING_TYPE.ENEMY
    });
  },
  onPlay(game, card) {
    console.log('todo frost nova');
  },
  aiHints: {
    maxUsesPerTurn: 1
  }
};
