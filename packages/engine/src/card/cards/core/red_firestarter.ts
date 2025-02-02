import { meleeFighter } from '../../../ai/ai-traits';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { BurnModifier } from '../../../unit/modifiers/burn.modifier';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';

export const redFirestarter: UnitCardBlueprint = {
  id: 'red-firestarter',
  spriteId: 'firestarter',
  iconId: 'unit_firestarter',
  set: CARD_SETS.CORE,
  name: 'Firestarter',
  description: '@Summon@: inflict @Burn(1)@ to a minion.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 3,
    runes: [RUNES.RED, RUNES.RED]
  },
  jobs: [JOBS.MAGE],
  atk: 3,
  maxHp: 3,
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new UnitSummonTargetingtrategy(game, card);
      }
    },
    {
      getTargeting(game, card) {
        return new AnywhereTargetingStrategy(game, card.player, TARGETING_TYPE.MINION);
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
      target.addModifier(new BurnModifier(game, card, { initialStacks: 1 }));
    }
  }
};
