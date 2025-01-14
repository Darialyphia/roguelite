import { irrelevantTarget, mergeTraits } from '../../../ai/ai-traits';
import { PLAYER_EVENTS } from '../../../player/player-enums';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { type QuestCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const tutorialQuest: QuestCardBlueprint = {
  id: 'tutorial-quest',
  iconId: 'placeholder',
  name: 'Tutorial Quest',
  description: 'End your turn. Reward: 5 VP.',
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
    card.player.on(PLAYER_EVENTS.END_TURN, () => {
      card.player.team.earnVictoryPoints(5);
    });
  },
  onCompleted(game, card) {
    card.player.team.earnVictoryPoints(1);
    card.meta.onSummon();
    delete card.meta.onSumon;
  }
};
