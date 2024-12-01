import { Damage } from '../../combat/damage/damage';
import { MagicalMitigationStrategy } from '../../combat/damage/mitigation/magical-mitigation.strategy';
import { MagicalScalingStrategy } from '../../combat/damage/scaling/magical-scaling.strategy';
import { PointAOEShape } from '../../targeting/aoe-shapes';
import { RangedTargetingStrategy } from '../../targeting/ranged-targeting.strategy';
import { TARGETING_TYPE } from '../../targeting/targeting-strategy';
import type { CardBlueprint } from '../card-blueprint';

export const spellSpark: CardBlueprint = {
  id: 'spell-spark',
  iconId: 'spell-spark',
  name: 'Spellspark',
  cost: 1,
  description: 'Deal (10+40% MATK) magic damage to an enemy. Draw a card.',
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new RangedTargetingStrategy(game, card.unit, TARGETING_TYPE.ENEMY, {
          minRange: 0,
          maxRange: 2
        });
      }
    }
  ],
  getAoe(game, card, points) {
    return new PointAOEShape(game, points[0]);
  },
  onPlay(game, card, targets, unitTargets) {
    card.unit.dealDamage(
      unitTargets,
      new Damage({
        baseAmount: 10,
        source: card.unit,
        mitigation: new MagicalMitigationStrategy(),
        scalings: [new MagicalScalingStrategy(0.4)]
      })
    );

    card.unit.draw(1);
  },
  aiHints: {}
};
