import { meleeFighter } from '../../../ai/ai-traits';
import { Damage } from '../../../combat/damage/damage';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { RangedTargetingStrategy } from '../../../targeting/ranged-targeting.strategy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { RangedModifier } from '../../../unit/modifiers/ranged.modifier';
import { SpellCasterModifier } from '../../../unit/modifiers/spellcaster.modifier';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, UNIT_TYPES } from '../../card-enums';

export const redExorcist: UnitCardBlueprint = {
  id: 'red-exorcist',
  spriteId: 'exorcist',
  iconId: 'unit_exorcist',
  name: 'Exorcist',
  description: '@Ranged(2)@.\n@Summon@: Deal 1 damage to an enemy unit.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 2,
    runes: [RUNES.RED, RUNES.COLORLESS]
  },
  jobs: [JOBS.MAGE],
  atk: 1,
  maxHp: 2,
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new UnitSummonTargetingtrategy(game, card);
      }
    },
    {
      getTargeting(game, card, points) {
        return new RangedTargetingStrategy(
          game,
          card,
          points[0],
          TARGETING_TYPE.ENEMY_UNIT,
          {
            maxRange: 3,
            minRange: 0
          }
        );
      }
    }
  ],
  getAoe(game) {
    return new PointAOEShape(game);
  },
  vfx: {
    play() {
      return { tracks: [] };
    },
    destroy() {
      return { tracks: [] };
    }
  },
  onPlay(game, card, cells, units) {
    card.unit.addModifier(new RangedModifier(game, card, 2));
    card.unit.addModifier(new SpellCasterModifier(game, card));
    const target = units[1];
    if (target) {
      card.unit.dealDamage(
        [target],
        new Damage({
          baseAmount: 1,
          source: card,
          scalings: [new NoScalingStrategy()],
          mitigations: [new NoMitigationStrategy()]
        })
      );
    }
  }
};
