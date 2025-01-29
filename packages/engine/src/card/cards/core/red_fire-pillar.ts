import { Damage } from '../../../combat/damage/damage';
import { DAMAGE_TYPES } from '../../../combat/damage/damage.enums';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { ShrineAoeShape } from '../../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { RUNES } from '../../../utils/rune';
import { type SpellCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS } from '../../card-enums';

export const redFirePillar: SpellCardBlueprint = {
  id: 'red-fire-pillar',
  iconId: 'spell-fire-pillar',
  set: CARD_SETS.CORE,
  name: 'Fire Pillar',
  description: 'Deal 3 damage to every unit standing on a shrine.',
  kind: CARD_KINDS.SPELL,
  aiHints: {},
  cost: {
    gold: 4,
    runes: [RUNES.RED, RUNES.RED]
  },
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new AnywhereTargetingStrategy(game, card.player, TARGETING_TYPE.ANYWHERE);
      }
    }
  ],
  getAoe(game, card) {
    return new ShrineAoeShape(game, card.player, { targetingType: TARGETING_TYPE.UNIT });
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
          baseAmount: 3,
          source: card,
          type: DAMAGE_TYPES.SPELL,
          scalings: [new NoScalingStrategy()],
          mitigations: [new NoMitigationStrategy()]
        })
      );
    });
  }
};
