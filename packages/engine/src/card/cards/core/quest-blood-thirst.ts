import { irrelevantTarget, mergeTraits } from '../../../ai/ai-traits';
import { GAME_EVENTS } from '../../../game/game';
import { PLAYER_EVENTS } from '../../../player/player-enums';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { type QuestCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';
import { isUnitCard } from '../../unit-card.entity';

export const questBloodThirst: QuestCardBlueprint = {
  id: 'quest-bloodthirst',
  iconId: 'placeholder',
  description: 'Deal 12 combat damage in a single turn. Reward: 2 VP.',
  name: 'Bloodthirst',
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
    const unsubOnTurnStart = card.player.on(PLAYER_EVENTS.START_TURN, () => {
      count = 0;
    });
    const unsubOnDamage = game.on(GAME_EVENTS.UNIT_AFTER_RECEIVE_DAMAGE, e => {
      if (!isUnitCard(e.from)) return;
      if (!e.from.player.isAlly(card.player)) return;

      count += e.damage.getMitigatedAmount(e.unit);
      if (count >= 12) {
        card.complete();
        unsubOnDamage();
        unsubOnTurnStart();
      }
    });
  },
  onCompleted(game, card) {
    card.player.team.earnVictoryPoints(2);
  }
};
