import { Damage } from '../../../combat/damage/damage';
import { DAMAGE_TYPES } from '../../../combat/damage/damage.enums';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import {
  CompositeAOEShape,
  PointAOEShape,
  RingAOEShape
} from '../../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { BurnModifier } from '../../../unit/modifiers/burn.modifier';
import { RUNES } from '../../../utils/rune';
import { type SpellCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS } from '../../card-enums';

export const redCombustion: SpellCardBlueprint = {
  id: 'red-combustion',
  iconId: 'spell-combustion',
  name: 'Combustion',
  set: CARD_SETS.CORE,
  description:
    'Deal 3 damage to an enemy minion. If it dies, give @Burn(1)@ to all nearby minions.',
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
        return new AnywhereTargetingStrategy(
          game,
          card.player,
          TARGETING_TYPE.ENEMY_MINION
        );
      }
    }
  ],
  getAoe(game, unit, points) {
    return new CompositeAOEShape([
      new PointAOEShape(game),
      new RingAOEShape(game, game.unitSystem.getUnitAt(points[0])!.card, {
        allow3D: true,
        targetingType: TARGETING_TYPE.ALLY_MINION
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
        type: DAMAGE_TYPES.SPELL,
        scalings: [new NoScalingStrategy()],
        mitigations: [new NoMitigationStrategy()]
      })
    );
    if (mainTarget.isDead) {
      otherTargets.forEach(target => {
        target.addModifier(
          new BurnModifier(game, card, {
            initialStacks: 1
          })
        );
      });
    }
  }
};
