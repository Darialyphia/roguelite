import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { MeleeTargetingStrategy } from '../../../targeting/melee-targeting.straegy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { JOBS } from '../../../utils/job';
import { CARD_KINDS, type GeneralCardBlueprint } from '../../card-blueprint';

export const testGeneral: GeneralCardBlueprint = {
  id: 'testGeneral',
  spriteId: 'flame-lord',
  iconId: 'unit-flame-lord',
  name: 'Test General',
  description: '',
  kind: CARD_KINDS.GENERAL,
  aiHints: {},
  jobs: [JOBS.FIGHTER],
  atk: 3,
  maxHp: 18,
  speed: 8,
  reward: 4,
  getAttackPattern(game, unit) {
    return new MeleeTargetingStrategy(game, unit, TARGETING_TYPE.ENEMY, {
      allowDiagonals: false
    });
  },
  getAoe(game, card, points) {
    return new PointAOEShape(game, points[0]);
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onPlay() {}
};
