import { AnywhereTargetingPatternStrategy } from '../../targeting/anywhere-targeting-strategy';
import { PointAOEShape } from '../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../targeting/targeting-strategy';
import { StasisModifier } from '../../unit/modifiers/stasis.modifier';
import type { CardBlueprint } from '../card-blueprint';

export const stasis: CardBlueprint = {
  id: 'stasis',
  iconId: 'stasis',
  name: 'Stasis',
  cost: 1,
  description: 'Give a unit stasis.',
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
  onPlay(game, card, cells, units) {
    units.forEach(unit => {
      unit.addModifier(new StasisModifier(game));
    });
  },
  aiHints: {
    isRelevantTarget(point, game, card) {
      const unit = game.unitSystem.getUnitAt(point)!;

      const hasPlayedThisTurn = game.turnSystem.processedUnits.has(unit);

      return unit.player.isAlly(card.unit.player)
        ? hasPlayedThisTurn
        : !hasPlayedThisTurn;
    },
    maxUsesPerTurn: 1,
    preScoreModifier(game, card) {
      if (
        card.unit.hp.current < card.unit.hp.max * 0.25 &&
        card.unit.ap.current === card.cost
      ) {
        return 25;
      }

      return 0;
    }
  }
};
