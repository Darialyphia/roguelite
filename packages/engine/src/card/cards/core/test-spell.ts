import { Damage } from '../../../combat/damage/damage';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { SelfTargetingStrategy } from '../../../targeting/self-targeting.strategy';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { CARD_KINDS, type SpellCardBlueprint } from '../../card-blueprint';

export const testSpell: SpellCardBlueprint = {
  id: 'testSpell',
  iconId: 'spell-arcane-intellect',
  name: 'Test Spell With Long Name',
  description: 'Deal 2 damage to nearby enemies.',
  kind: CARD_KINDS.SPELL,
  aiHints: {},
  cost: {
    ap: 1,
    runes: [RUNES.COLORLESS, RUNES.COLORLESS],
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
  getAoe(game, card, points) {
    return new PointAOEShape(game, points[0]);
  },
  onPlay(game, card, cellTargets, unitTargets) {
    unitTargets.forEach(target => {
      target.takeDamage(
        card,
        new Damage({
          baseAmount: 2,
          source: card,
          scalings: [new NoScalingStrategy()],
          mitigation: new NoMitigationStrategy()
        })
      );
    });
  }
};
