import { meleeFighter } from '../../../ai/ai-traits';
import { createEntityId } from '../../../entity';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { BurnAuraModifierMixin } from '../../../unit/modifier-mixins/burn-aura.mixin';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, UNIT_TYPES } from '../../card-enums';

export const redFireElemental: UnitCardBlueprint = {
  id: 'red-fire-elemental',
  spriteId: 'fire-elemental',
  iconId: 'unit_fire-elemental',
  name: 'Fire Elemental',
  description: 'Applies @Burn(2)@ to nearby enemy units.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 5,
    runes: [RUNES.RED, RUNES.RED, RUNES.RED]
  },
  jobs: [JOBS.FIGHTER],
  atk: 4,
  maxHp: 5,
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
    card.unit.addModifier(
      new UnitModifier(createEntityId('fire_elemental_burn_aura'), game, {
        stackable: false,
        mixins: [
          new BurnAuraModifierMixin(game, {
            strength: 2,
            targetingType: TARGETING_TYPE.ENEMY_UNIT
          })
        ]
      })
    );
  }
};
