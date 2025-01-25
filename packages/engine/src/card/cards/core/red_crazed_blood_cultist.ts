import { meleeFighter } from '../../../ai/ai-traits';
import { createEntityId } from '../../../entity';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { RageAuraModifierMixin } from '../../../unit/modifier-mixins/rage-aura.mixin';
import { RageModifier } from '../../../unit/modifiers/rage.modifier';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';

export const redCrazedBloodCultist: UnitCardBlueprint = {
  id: 'red-crazed-blood-cultist',
  spriteId: 'crazed-warlord',
  iconId: 'unit_crazed-blood-cultist',
  set: CARD_SETS.CORE,
  name: 'Crazed Blood Cultist',
  description: 'All minions have @Rage@.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 4,
    runes: [RUNES.RED, RUNES.RED, RUNES.RED]
  },
  jobs: [JOBS.FIGHTER],
  atk: 4,
  maxHp: 3,
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
    card.unit.addModifier(new RageModifier(game, card));
    card.unit.addModifier(
      new UnitModifier(createEntityId('crazed_blood_cultist_aura'), game, card, {
        stackable: false,
        mixins: [new RageAuraModifierMixin(game)]
      })
    );
  }
};
