import { irrelevantTarget, mergeTraits } from '../../../ai/ai-traits';
import { GAME_EVENTS } from '../../../game/game';
import { PLAYER_EVENTS } from '../../../player/player.entity';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { type QuestCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const testQuest: QuestCardBlueprint = {
  id: 'test-quest',
  iconId: 'placeholder',
  name: 'Test Quest',
  description: 'Summon 3 unit. Reward: 1 VP.',
  kind: CARD_KINDS.QUEST,
  aiHints: mergeTraits(irrelevantTarget()),
  cost: {
    gold: 1,
    runes: []
  },
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new AnywhereTargetingStrategy(game, card.player, TARGETING_TYPE.ANY);
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
    card.meta.onSummon = game.on(GAME_EVENTS.UNIT_CREATED, e => {
      if (e.unit.player.isAlly(card.player)) {
        count++;
        if (count === 3) {
          card.complete();
        }
      }
    });
  },
  onCompleted(game, card) {
    card.player.team.earnVictoryPoints(1);
    card.meta.onSummon();
    delete card.meta.onSumon;
  }
};
