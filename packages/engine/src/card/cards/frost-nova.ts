import { RingAOEShape } from '../../targeting/aoe-shapes';
import { SelfTargetingPatternStrategy } from '../../targeting/self-targeting-strategy';
import { TARGETING_TYPE } from '../../targeting/targeting-strategy';
import { FrozenModifier } from '../../unit/modifiers/frozen.modifier';
import type { CardBlueprint } from '../card-blueprint';

export const frostNova: CardBlueprint = {
  id: 'frost-nova',
  iconId: 'frost-nova',
  name: 'Frost Nova',
  cost: 1,
  description: 'Freeze nearby enemies.',
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
  onPlay(game, card, cells, units) {
    units.forEach(unit => {
      unit.addModifier(new FrozenModifier(game));
    });
  },
  aiHints: {
    maxUsesPerTurn: 1,
    preScoreModifier(game, card, targets) {
      const aoeShape = card.getAoe(targets)!;
      const enemies = aoeShape.getUnits().filter(unit => unit.isEnemy(card.unit));
      if (!enemies.length) return Number.NEGATIVE_INFINITY;

      return 0;
    },
    postScoreModifier(game, card, targets) {
      const aoeShape = card.getAoe(targets)!;
      const frozenEnemies = aoeShape
        .getUnits()
        .filter(
          unit => unit.isEnemy(card.unit) && unit.hasModifier(FrozenModifier.MODIFIER_ID)
        );

      return 10 * frozenEnemies.length;
    }
  }
};
