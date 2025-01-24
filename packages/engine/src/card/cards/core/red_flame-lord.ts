import { meleeFighter } from '../../../ai/ai-traits';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { BurnModifier } from '../../../unit/modifiers/burn.modifier';
import { CommanderModifier } from '../../../unit/modifiers/commander.modifier';
import { JOBS } from '../../../utils/job';
import { Rune, RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';

export const redFlameLord: UnitCardBlueprint = {
  id: 'red-flame-lord',
  spriteId: 'flame-lord',
  iconId: 'unit_flame-lord',
  set: CARD_SETS.CORE,
  name: 'Flame Lord',
  description: '@Commander@.\n@Summon@: Draw 1 for each unit with @Burn@.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 6,
    runes: [RUNES.RED, RUNES.RED, RUNES.RED, RUNES.COLORLESS]
  },
  jobs: [JOBS.FIGHTER],
  atk: 5,
  maxHp: 6,
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

    const cardToDraw = game.unitSystem.units.filter(u =>
      u.hasModifier(BurnModifier)
    ).length;

    card.player.draw(cardToDraw);
  }
};
