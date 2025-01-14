import { Damage } from '../../../combat/damage/damage';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { SpellTargetingtrategy } from '../../../targeting/spell-targeting.strategy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { type SpellCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const tutorialSpell: SpellCardBlueprint = {
  id: 'tutorial-spell',
  iconId: 'placeholder',
  name: 'Tutorial Spell',
  description: 'Deal 8 damage to a general.',
  kind: CARD_KINDS.SPELL,
  aiHints: {},
  cost: {
    gold: 4,
    runes: []
  },
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new SpellTargetingtrategy(game, card, {
          maxRange: 3,
          targetingType: TARGETING_TYPE.ENEMY_UNIT
        });
      }
    }
  ],
  getAoe(game) {
    return new PointAOEShape(game);
  },
  vfx: {
    play() {
      return { tracks: [] };
    }
  },
  onPlay(game, card, cellTargets, unitTargets) {
    unitTargets.forEach(target => {
      target.takeDamage(
        card,
        new Damage({
          baseAmount: 8,
          source: card,
          scalings: [new NoScalingStrategy()],
          mitigations: [new NoMitigationStrategy()]
        })
      );
    });
  }
};
