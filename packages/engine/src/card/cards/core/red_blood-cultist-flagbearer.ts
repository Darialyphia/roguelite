import { meleeFighter } from '../../../ai/ai-traits';
import { createEntityId } from '../../../entity';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { KEYWORDS } from '../../../unit/keywords';
import { FearsomeAuraModifierMixin } from '../../../unit/modifier-mixins/fearsome-aura.mixin';
import { KeywordImmunityModifier } from '../../../unit/modifiers/keyword-immunity.modifier';
import { RageModifier } from '../../../unit/modifiers/rage.modifier';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';

export const redBloodCultistFlagbearer: UnitCardBlueprint = {
  id: 'red-blood-cultist-flagbearer',
  spriteId: 'blood-cultist-flagbearer',
  iconId: 'unit_blood-cultist-flagbearer',
  set: CARD_SETS.CORE,
  name: 'Blood Cultist Flagbearer',
  description:
    'Immunity to @Rage@.\nAllies with @Rage@ in a 2 cells radius have @Fearsome@.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 3,
    runes: [RUNES.RED, RUNES.RED]
  },
  jobs: [JOBS.MAGE],
  atk: 1,
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
      new KeywordImmunityModifier(game, card, { keyword: KEYWORDS.RAGE })
    );
    card.unit.addModifier(
      new UnitModifier(createEntityId('blood_cultist_flagbearer_aura'), game, card, {
        stackable: false,
        mixins: [
          new FearsomeAuraModifierMixin(game, {
            isElligible(unit) {
              if (unit.isEnemy(card.unit)) return false;
              return (
                unit.position.isWithinCells(card.unit.position, 2, game) &&
                unit.hasModifier(RageModifier)
              );
            }
          })
        ]
      })
    );
  }
};
