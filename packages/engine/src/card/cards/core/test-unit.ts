import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { MeleeTargetingStrategy } from '../../../targeting/melee-targeting.straegy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const testUnit: UnitCardBlueprint = {
  id: 'testUnit',
  spriteId: 'lancer',
  iconId: 'unit-lancer',
  name: 'Test Unit',
  description: '',
  kind: CARD_KINDS.UNIT,
  aiHints: {},
  cost: {
    gold: 3,
    runes: [RUNES.RED]
  },
  jobs: [JOBS.FIGHTER],
  atk: 3,
  maxHp: 8,
  speed: 6,
  reward: 1,
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new UnitSummonTargetingtrategy(card);
      }
    }
  ],
  getAttackPattern(game, unit) {
    return new MeleeTargetingStrategy(game, unit, TARGETING_TYPE.ENEMY, {
      allowDiagonals: false
    });
  },
  getAoe(game, card, points) {
    return new PointAOEShape(game, points[0]);
  },
  vfx: {
    play(game, card) {
      return { tracks: [] };
    },
    destroy(game, card) {
      return { tracks: [] };
    }
  },
  onPlay() {
    console.log('playing test unit');
  }
};
