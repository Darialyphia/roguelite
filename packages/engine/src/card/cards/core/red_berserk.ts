import { meleeFighter } from '../../../ai/ai-traits';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { MeleeTargetingStrategy } from '../../../targeting/melee-targeting.straegy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { SplashAttackdModifierMixin } from '../../../unit/modifier-mixins/splash-attack.mixin';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const redBerserk: UnitCardBlueprint = {
  id: 'red-berserk',
  spriteId: 'berserk',
  iconId: 'unit_berserk',
  name: 'Berserk',
  description: '@Splash Attack@.',
  kind: CARD_KINDS.UNIT,
  aiHints: meleeFighter,
  cost: {
    gold: 4,
    runes: [RUNES.RED, RUNES.COLORLESS, RUNES.COLORLESS]
  },
  jobs: [JOBS.FIGHTER],
  atk: 4,
  maxHp: 4,
  reward: 1,
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
      new UnitModifier(SplashAttackdModifierMixin.modifierName, game, {
        stackable: false,
        mixins: [new SplashAttackdModifierMixin(game)]
      })
    );
  }
};
