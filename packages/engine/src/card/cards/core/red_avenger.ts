import { meleeFighter } from '../../../ai/ai-traits';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { FearsomeModifier } from '../../../unit/modifiers/fearsome.modifier';
import { RushModifier } from '../../../unit/modifiers/rush.modifier';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, UNIT_TYPES } from '../../card-enums';

export const redAvenger: UnitCardBlueprint = {
  id: 'red-avenger',
  spriteId: 'avenger',
  iconId: 'unit_avenger',
  name: 'Avenger',
  description:
    '@Fearsome@.\nIf an ally unit died during your opponent last turn, this has @Rush@.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 4,
    runes: [RUNES.RED, RUNES.RED]
  },
  jobs: [JOBS.FIGHTER],
  atk: 3,
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
  shouldHighlightInHand(game, card) {
    return (
      game.turnSystem.activePlayer.equals(card.player) && card.player.allyDiedLastTurn
    );
  },
  onPlay(game, card) {
    card.unit.addModifier(new FearsomeModifier(game, card));

    if (card.player.allyDiedLastTurn) {
      card.unit.addModifier(new RushModifier(game, card));
    }
  }
};
