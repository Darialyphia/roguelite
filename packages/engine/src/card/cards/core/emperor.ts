import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { MeleeTargetingStrategy } from '../../../targeting/melee-targeting.straegy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const emperor: UnitCardBlueprint = {
  id: 'emperor',
  spriteId: 'emperor',
  iconId: 'unit-emperor',
  name: 'Emperor',
  description: '',
  kind: CARD_KINDS.UNIT,
  aiHints: {},
  cost: {
    gold: 6,
    runes: [RUNES.YELLOW, RUNES.YELLOW, RUNES.RED]
  },
  jobs: [JOBS.FIGHTER],
  atk: 5,
  maxHp: 10,
  speed: 6,
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
    return new MeleeTargetingStrategy(game, unit, TARGETING_TYPE.ENEMY, {
      allowDiagonals: false
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
