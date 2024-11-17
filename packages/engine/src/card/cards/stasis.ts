import { AnywhereTargetingPatternStrategy } from '../../targeting/anywhere-targeting-strategy';
import { PointAOEShape } from '../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../targeting/targeting-strategy';
import type { CardBlueprint } from '../card-blueprint';

export const stasis: CardBlueprint = {
  id: 'stasis',
  iconId: 'stasis',
  name: 'Stasis',
  cost: 1,
  description: 'Give a unit stasis 1.',
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new AnywhereTargetingPatternStrategy(game, card.unit, TARGETING_TYPE.BOTH);
      }
    }
  ],
  getAoe(game, card, points) {
    return new PointAOEShape(game, points[0]);
  },
  onPlay(game, card) {
    console.log('todo stasis');
  },
  aiHints: {
    isRelevantTarget(point, game, card) {
      const unit = game.unitSystem.getUnitAt(point)!;

      const hasPlayedThisTurn = game.turnSystem.processedUnits.has(unit);

      return unit.player.isAlly(card.unit.player)
        ? hasPlayedThisTurn
        : !hasPlayedThisTurn;
    },
    maxUsesPerTurn: 1
  }
};
