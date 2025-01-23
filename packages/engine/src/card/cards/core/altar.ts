import { meleeFighter } from '../../../ai/ai-traits';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { AltarModifier } from '../../../unit/modifiers/altar.modifier';
import { RangedModifier } from '../../../unit/modifiers/ranged.modifier';
import { JOBS } from '../../../utils/job';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, UNIT_TYPES } from '../../card-enums';

export const altar: UnitCardBlueprint = {
  id: 'altar',
  spriteId: 'altar',
  iconId: 'unit_altar',
  name: 'Altar',
  description: '@Altar@.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.ALTAR,
  aiHints: meleeFighter,
  cost: {
    gold: 3,
    runes: []
  },
  jobs: [JOBS.SHOOTER],
  atk: 0,
  maxHp: 20,
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
  onPlay(game, card) {
    card.unit.addModifier(new AltarModifier(game, card));
  }
};
