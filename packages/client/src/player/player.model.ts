import { makeCardViewModel, type CardViewModel } from '@/card/card.model';
import type { UnitViewModel } from '@/unit/unit.model';
import type { Game } from '@game/engine';
import type { EntityId } from '@game/engine/src/entity';
import type { Player } from '@game/engine/src/player/player.entity';
import type { Rune } from '@game/engine/src/utils/rune';
import type { Point3D } from '@game/shared';

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
  isActive: boolean;
  quests: CardViewModel[];
  equals(player: PlayerViewModel): boolean;
  isEnemy(unit: UnitViewModel): boolean;
  isAlly(unit: UnitViewModel): boolean;
};

export const makePlayerViewModel = (
  game: Game,
  player: Player
): PlayerViewModel => {
  const vm: PlayerViewModel = {
    id: player.id,
    hand: player.hand.map(card => makeCardViewModel(game, card)),
    canPerformResourceAction: player.canPerformResourceAction,
    name: player.name,
    victoryPoints: player.team.victoryPoints,
    runes: player.runes,
    deckSize: player.deckSize,
    remainingCardsInDeck: player.remainingCardsInDeck,
    gold: player.gold,
    isActive: game.turnSystem.activePlayer.equals(player),
    quests: [...player.quests].map(quest => makeCardViewModel(game, quest)),
    getPlayer() {
      return player;
    },
    equals(playerVm: PlayerViewModel) {
      return playerVm.getPlayer().equals(player);
    },
    isAlly(unit) {
      return unit.player.equals(vm);
    },
    isEnemy(unit) {
      return !unit.player.equals(vm);
    }
  };

  return vm;
};
