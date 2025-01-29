import { meleeFighter } from '../../../ai/ai-traits';
import { Damage } from '../../../combat/damage/damage';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { BurnModifier } from '../../../unit/modifiers/burn.modifier';
import { RangedModifier } from '../../../unit/modifiers/ranged.modifier';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';

export const redFirestarter: UnitCardBlueprint = {
  id: 'red-firestarter',
  spriteId: 'red-placeholder',
  iconId: 'placeholder',
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
    card.unit.addModifier(new RangedModifier(game, card, 2));
    const target = units[1];
    if (target) {
      target.addModifier(new BurnModifier(game, card, { initialStacks: 1 }));
    }
  }
};
