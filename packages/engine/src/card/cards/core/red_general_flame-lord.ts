import { meleeFighter } from '../../../ai/ai-traits';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { JOBS } from '../../../utils/job';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, UNIT_TYPES } from '../../card-enums';

export const redGeneralFlameLord: UnitCardBlueprint = {
  id: 'red-general-flame-lord',
  spriteId: 'flame-lord',
  iconId: 'unit_flame-lord',
  name: 'Flame lord',
  description: '',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.GENERAL,
  aiHints: meleeFighter,
  cost: {
    gold: 0,
    runes: []
  },
  jobs: [JOBS.FIGHTER],
  atk: 2,
  maxHp: 16,
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new UnitSummonTargetingtrategy(game, card);
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
  onPlay() {
    return;
  }
};
