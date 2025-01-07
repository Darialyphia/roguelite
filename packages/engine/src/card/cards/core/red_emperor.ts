import { meleeFighter } from '../../../ai/ai-traits';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { MeleeTargetingStrategy } from '../../../targeting/melee-targeting.straegy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { CommanderModifierMixin } from '../../../unit/modifier-mixins/commander.mixin';
import { RangedModifierMixin } from '../../../unit/modifier-mixins/ranged.mixin';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, UNIT_TYPES } from '../../card-enums';

export const redEmperor: UnitCardBlueprint = {
  id: 'red-emperor',
  spriteId: 'emperor',
  iconId: 'unit_emperor',
  name: 'Emperor',
  description: '@Commander@.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 5,
    runes: [RUNES.RED, RUNES.RED]
  },
  jobs: [JOBS.SHOOTER],
  atk: 4,
  maxHp: 6,
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new UnitSummonTargetingtrategy(game, card);
      }
    }
  ],
  getAttackPattern(game, unit) {
    return new MeleeTargetingStrategy(game, unit, TARGETING_TYPE.ENEMY);
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
        mixins: [new CommanderModifierMixin(game, 2)]
      })
    );
  }
};
