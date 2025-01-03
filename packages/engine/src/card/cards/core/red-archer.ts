import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { MeleeTargetingStrategy } from '../../../targeting/melee-targeting.straegy';
import { RangedTargetingStrategy } from '../../../targeting/ranged-targeting.strategy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const redArcher: UnitCardBlueprint = {
  id: 'red-archer',
  spriteId: 'archer',
  iconId: 'unit_archer',
  name: 'Archer',
  description: 'Ranged(2)',
  kind: CARD_KINDS.UNIT,
  aiHints: {},
  cost: {
    gold: 3,
    runes: [RUNES.RED, RUNES.COLORLESS]
  },
  jobs: [JOBS.SHOOTER],
  atk: 2,
  maxHp: 4,
  reward: 1,
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new UnitSummonTargetingtrategy(game, card);
      }
    }
  ],
  getAttackPattern(game, unit) {
    return new RangedTargetingStrategy(game, unit, TARGETING_TYPE.ENEMY, {
      minRange: 1,
      maxRange: 2
    });
  },
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
  onPlay() {
    return;
  }
};
