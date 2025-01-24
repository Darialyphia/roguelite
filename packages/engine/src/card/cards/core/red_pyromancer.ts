import { meleeFighter } from '../../../ai/ai-traits';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';
import { redFireball } from './red_fireball';

export const redPyromancer: UnitCardBlueprint = {
  id: 'red-pyromancer',
  spriteId: 'blood-pyromancer',
  iconId: 'unit_pyromancer',
  set: CARD_SETS.CORE,
  name: 'Pyromancer',
  description: '@Summon@:  .',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 4,
    runes: [RUNES.RED, RUNES.RED]
  },
  jobs: [JOBS.MAGE],
  atk: 2,
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
    const count = card.player.getRuneCount(RUNES.RED);

    for (let i = 0; i <= count; i++) {
      card.player.addToHand(card.player.generateCard(redFireball.id));
    }
  }
};
