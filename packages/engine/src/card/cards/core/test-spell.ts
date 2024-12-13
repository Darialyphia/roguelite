import { Damage } from '../../../combat/damage/damage';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { PointAOEShape, RingAOEShape } from '../../../targeting/aoe-shapes';
import { SelfTargetingStrategy } from '../../../targeting/self-targeting.strategy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type SpellCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const testSpell: SpellCardBlueprint = {
  id: 'testSpell',
  iconId: 'spell-arcane-intellect',
  name: 'Test Spell With Long Name',
  description: 'Deal 2 damage to nearby enemies.',
  kind: CARD_KINDS.SPELL,
  aiHints: {},
  cost: {
    ap: 1,
    runes: [RUNES.RED, RUNES.COLORLESS],
    job: [JOBS.FIGHTER]
  },
  minTargets: 1,
  targets: [
    {
      getTargeting(game) {
        return new SelfTargetingStrategy(game.turnSystem.activeUnit);
      }
    }
  ],
  getAoe(game) {
    return new RingAOEShape(game, game.turnSystem.activeUnit, {
      allow3D: true,
      targetingType: TARGETING_TYPE.ENEMY
    });
  },
  vfx: {
    play(game, card) {
      return { tracks: [] };
    }
  },
  onPlay(game, card, cellTargets, unitTargets) {
    console.log(unitTargets);
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
