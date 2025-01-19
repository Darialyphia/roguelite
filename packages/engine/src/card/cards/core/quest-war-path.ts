import { irrelevantTarget, mergeTraits } from '../../../ai/ai-traits';
import { GAME_EVENTS } from '../../../game/game';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { type QuestCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const questWarPath: QuestCardBlueprint = {
  id: 'quest-war-path',
  iconId: 'placeholder',
  name: 'War Path',
  description: 'Summon 6 unit. Reward: 2 VP.',
  kind: CARD_KINDS.QUEST,
  aiHints: mergeTraits(irrelevantTarget()),
  cost: {
    gold: 0,
    runes: []
  },
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new AnywhereTargetingStrategy(game, card.player, TARGETING_TYPE.ANYWHERE);
      }
    }
  ],
  vfx: {
    play() {
      return { tracks: [] };
    }
  },
  onPlay(game, card) {
    let count = 0;
    const unsub = game.on(GAME_EVENTS.UNIT_CREATED, e => {
      if (e.unit.player.isAlly(card.player)) {
        count++;
        if (count === 6) {
          card.complete();
          unsub();
        }
      }
    });
  },
  onCompleted(game, card) {
    card.player.team.earnVictoryPoints(2);
  }
};
