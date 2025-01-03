import { Damage } from '../../../combat/damage/damage';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { PLAYER_EVENTS } from '../../../player/player.entity';
import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { type QuestCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const testQuest: QuestCardBlueprint = {
  id: 'test-quest',
  iconId: 'placeholder',
  name: 'Test Quest',
  description: 'Summon a unit. Reward: 1 VP.',
  kind: CARD_KINDS.QUEST,
  aiHints: {},
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
    card.meta.onSumon = card.player.on(PLAYER_EVENTS.AFTER_PLAY_CARD, e => {
      if (e.card.kind === CARD_KINDS.UNIT) {
        card.complete();
      }
    });
  },
  onCompleted(game, card) {
    card.player.team.earnVictoryPoints(1);
    card.meta.onSumon();
    delete card.meta.onSumon;
  }
};
