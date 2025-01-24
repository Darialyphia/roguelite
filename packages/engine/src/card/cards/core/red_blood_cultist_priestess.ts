import { meleeFighter } from '../../../ai/ai-traits';
import { createEntityId } from '../../../entity';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { InterceptorAuraModifierMixin } from '../../../unit/modifier-mixins/interceptor-aura.mixin';
import { CommanderModifier } from '../../../unit/modifiers/commander.modifier';
import { RageModifier } from '../../../unit/modifiers/rage.modifier';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import type { UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';

export const redBloodCultistPriestess: UnitCardBlueprint = {
  id: 'red-blood-cultist-priestess',
  spriteId: 'blood-cultist-priestess',
  iconId: 'unit_blood-cultist-priestess',
  set: CARD_SETS.CORE,
  name: 'Blood Cultist Priestess',
  description:
    '@Commander@.\nWhile this is on the board, units with @Rage@ can attack allies minions.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 3,
    runes: [RUNES.RED, RUNES.RED, RUNES.COLORLESS]
  },
  jobs: [JOBS.MAGE],
  atk: 3,
  maxHp: 1,
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
    card.unit.addModifier(new CommanderModifier(game, card));
    card.unit.addModifier(
      new UnitModifier(createEntityId('blood-cultist-priestess-debuff'), game, card, {
        stackable: false,
        mixins: [
          new InterceptorAuraModifierMixin(game, {
            key: 'attackTargetType',
            isElligible(unit) {
              return unit.isEnemy(card.unit);
            },
            interceptor(value, unit) {
              return unit.hasModifier(RageModifier) ? TARGETING_TYPE.MINION : value;
            }
          })
        ]
      })
    );
  }
};
