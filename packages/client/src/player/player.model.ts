import { makeCardViewModel, type CardViewModel } from '@/card/card.model';
import type { Game } from '@game/engine';
import type { EntityId } from '@game/engine/src/entity';
import type { Player } from '@game/engine/src/player/player.entity';

export type PlayerViewModel = {
  id: EntityId;
  getPlayer(): Player;
  hand: Array<CardViewModel>;
  canPerformResourceAction: boolean;
};

export const makePlayerViewModel = (
  game: Game,
  player: Player
): PlayerViewModel => {
  return {
    id: player.id,
    hand: player.hand.map(card => makeCardViewModel(game, card)),
    canPerformResourceAction: player.canPerformResourceAction,
    getPlayer() {
      return player;
    }
  };
};
