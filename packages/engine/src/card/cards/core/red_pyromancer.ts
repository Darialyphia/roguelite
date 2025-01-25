import { meleeFighter } from '../../../ai/ai-traits';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { BurnModifier } from '../../../unit/modifiers/burn.modifier';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';
import { redFireball } from './red_fireball';

export const redPyromancer: UnitCardBlueprint = {
  id: 'red-pyromancer',
  spriteId: 'pyromancer',
  iconId: 'unit_pyromancer',
  set: CARD_SETS.CORE,
  name: 'Pyromancer',
  description: '@Summon@: Add a @Fireball@ to your hand for each unit with @Burn@.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 4,
    runes: [RUNES.RED, RUNES.RED]
  },
  jobs: [JOBS.MAGE],
  atk: 3,
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
    const burningUnits = game.unitSystem.units.filter(unit =>
      unit.hasModifier(BurnModifier)
    );
    console.log('burning units', burningUnits);

    for (let i = 0; i < burningUnits.length; i++) {
      card.player.addToHand(card.player.generateCard(redFireball.id));
    }
  }
};
