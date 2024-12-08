import { makeCardViewModel, type CardViewModel } from '@/card/card.model';
import type { Game } from '@game/engine';
import type { EntityId } from '@game/engine/src/entity';
import type { Player } from '@game/engine/src/player/player.entity';
import type { Rune } from '@game/engine/src/utils/rune';

export type PlayerViewModel = {
  id: EntityId;
  getPlayer(): Player;
  canPerformResourceAction: boolean;
  name: string;
  victoryPoints: number;
  runes: Rune[];
  hand: CardViewModel[];
  deckSize: number;
  gold: number;
  remainingCardsInDeck: number;
  equals(unit: PlayerViewModel): boolean;
};

export const makePlayerViewModel = (
  game: Game,
  player: Player
): PlayerViewModel => {
  return {
    id: player.id,
    hand: player.hand.map(card => makeCardViewModel(game, card)),
    canPerformResourceAction: player.canPerformResourceAction,
    name: player.name,
    victoryPoints: player.team.victoryPoints,
    runes: player.runes,
    deckSize: player.deckSize,
    remainingCardsInDeck: player.remainingCardsInDeck,
    gold: player.gold,
    getPlayer() {
      return player;
    },
    equals(playerVm: PlayerViewModel) {
      return playerVm.getPlayer().equals(player);
    }
  };
};
