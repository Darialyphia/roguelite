import { Damage } from '../../../combat/damage/damage';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import {
  CompositeAOEShape,
  PointAOEShape,
  RingAOEShape
} from '../../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { RUNES } from '../../../utils/rune';
import { type SpellCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const redCombustion: SpellCardBlueprint = {
  id: 'red-combustion',
  iconId: 'spell-combustion',
  name: 'Combustion',
  description:
    'Deal 3 damage to an enemy unit. If it dies, deal 1 damage to all nearby units.',
  kind: CARD_KINDS.SPELL,
  aiHints: {},
  cost: {
    gold: 3,
    runes: [RUNES.RED, RUNES.RED]
  },
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new AnywhereTargetingStrategy(game, card.player, TARGETING_TYPE.ENEMY);
      }
    }
  ],
  getAoe(game, unit, points) {
    return new CompositeAOEShape([
      new PointAOEShape(game),
      new RingAOEShape(game, game.unitSystem.getUnitAt(points[0])!, {
        allow3D: true,
        targetingType: TARGETING_TYPE.BOTH
      })
    ]);
  },
  vfx: {
    play() {
      return { tracks: [] };
    }
  },
  onPlay(game, card, cellTargets, unitTargets) {
    const [mainTarget, ...otherTargets] = unitTargets;
    mainTarget.takeDamage(
      card,
      new Damage({
        baseAmount: 3,
        source: card,
        scalings: [new NoScalingStrategy()],
        mitigations: [new NoMitigationStrategy()]
      })
    );
    if (mainTarget.isDead) {
      otherTargets.forEach(target => {
        target.takeDamage(
          card,
          new Damage({
            baseAmount: 1,
            source: card,
            scalings: [new NoScalingStrategy()],
            mitigations: [new NoMitigationStrategy()]
          })
        );
      });
    }
  }
};
