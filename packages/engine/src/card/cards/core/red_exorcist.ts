import { meleeFighter } from '../../../ai/ai-traits';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { MeleeTargetingStrategy } from '../../../targeting/melee-targeting.straegy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { RangedModifierMixin } from '../../../unit/modifier-mixins/ranged.mixin';
import { SpellCasterModifierMixin } from '../../../unit/modifier-mixins/spellcaster.mixin';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, UNIT_TYPES } from '../../card-enums';

export const redExorcist: UnitCardBlueprint = {
  id: 'red-exorcist',
  spriteId: 'exorcist',
  iconId: 'unit_exorcist',
  name: 'Exorcist',
  description: '@Ranged(2)@.\n@Spellcaster@.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 2,
    runes: [RUNES.RED, RUNES.COLORLESS]
  },
  jobs: [JOBS.MAGE],
  atk: 1,
  maxHp: 3,
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new UnitSummonTargetingtrategy(game, card);
      }
    }
  ],
  getAttackPattern(game, unit) {
    return new MeleeTargetingStrategy(game, unit, TARGETING_TYPE.ENEMY_UNIT);
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
  onPlay(game, card) {
    card.unit.addModifier(
      new UnitModifier(RangedModifierMixin.modifierName, game, {
        stackable: false,
        mixins: [new RangedModifierMixin(game, 2)]
      })
    );

    card.unit.addModifier(
      new UnitModifier(SpellCasterModifierMixin.modifierName, game, {
        stackable: false,
        mixins: [new SpellCasterModifierMixin(game)]
      })
    );
  }
};
