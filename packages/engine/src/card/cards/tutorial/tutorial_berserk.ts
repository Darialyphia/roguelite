import { meleeFighter } from '../../../ai/ai-traits';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { SplashAttackModifier } from '../../../unit/modifiers/splash-attack.modifier';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';

export const tutorialBerserk: UnitCardBlueprint = {
  id: 'tutorial-berserk',
  spriteId: 'berserk',
  iconId: 'unit_berserk',
  set: CARD_SETS.TUTORIAL,
  name: 'Berserk',
  description: '',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 4,
    runes: [RUNES.RED]
  },
  jobs: [JOBS.FIGHTER],
  atk: 4,
  maxHp: 4,
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
    card.unit.addModifier(new SplashAttackModifier(game, card));
  }
};
