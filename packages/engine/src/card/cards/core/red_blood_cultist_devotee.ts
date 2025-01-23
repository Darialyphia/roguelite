import { meleeFighter } from '../../../ai/ai-traits';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { RangedTargetingStrategy } from '../../../targeting/ranged-targeting.strategy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { RageModifier } from '../../../unit/modifiers/rage.modifier';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, UNIT_TYPES } from '../../card-enums';

export const redBloodCultistDevotee: UnitCardBlueprint = {
  id: 'red-blood-cultist-devotee',
  spriteId: 'blood-cultist-devotee',
  iconId: 'unit_blood-cultist-devotee',
  name: 'Blood Cultist Devotee',
  description: '@Summon@: Give @Rage@ to a minion within 3 cells.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 3,
    runes: [RUNES.RED, RUNES.COLORLESS]
  },
  jobs: [JOBS.MAGE],
  atk: 3,
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
        return new RangedTargetingStrategy(game, card, points[0], TARGETING_TYPE.MINION, {
          maxRange: 3,
          minRange: 0
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
    },
    destroy() {
      return { tracks: [] };
    }
  },
  onPlay(game, card, cells, units) {
    const target = units[1];
    if (target) {
      target.addModifier(new RageModifier(game, card));
    }
  }
};
