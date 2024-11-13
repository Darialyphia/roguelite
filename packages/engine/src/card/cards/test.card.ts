import { Damage } from '../../combat/damage/damage';
import { MagicalMitigationStrategy } from '../../combat/damage/mitigation/magical-mitigation.strategy';
import { MagicalScalingStrategy } from '../../combat/damage/scaling/magical-scaling.strategy';
import { PointAOEShape } from '../../targeting/aoe-shapes';
import { RangedTargetingStrategy } from '../../targeting/ranged-targeting.strategy';
import { TARGETING_TYPE } from '../../targeting/targeting-strategy';
import type { CardBlueprint } from '../card-blueprint';
import { getEnemyTargets } from '../card.utils';

export const testCard: CardBlueprint = {
  id: 'test-card',
  name: 'Magic Missile',
  cost: 1,
  description: 'Deal (5 + 50% MATK) magic damage to an enemy.',
  minTargets: 0,
  targets: [
    {
      getTargeting(game, card) {
        return new RangedTargetingStrategy(game, card.unit, TARGETING_TYPE.ENEMY, 3);
      },
      getAoe(game) {
        return new PointAOEShape(game);
      }
    }
  ],
  onPlay(game, card, targets) {
    card.unit.dealDamage(
      getEnemyTargets(game, targets, card.unit),
      new Damage({
        baseAmount: 10,
        source: card.unit,
        mitigation: new MagicalMitigationStrategy(),
        scalings: [new MagicalScalingStrategy(0.5)]
      })
    );
  }
};
