import type { Card } from '../card/card.entity';
import type { Game } from '../game/game';

export class AiHeuristics {
  private game: Game;
  private cardsPlayedByActiveUnit: Record<string, number> = {};

  constructor(game: Game) {
    this.game = game;

    game.on('unit.after_play_card', e => {
      if (!this.cardsPlayedByActiveUnit[e.card.blueprintId]) {
        this.cardsPlayedByActiveUnit[e.card.blueprintId] = 0;
      }
      this.cardsPlayedByActiveUnit[e.card.blueprintId]++;
    });

    game.on('unit.end_turn', () => {
      this.cardsPlayedByActiveUnit = {};
    });
  }

  shouldAvoidPlayingCard(card: Card) {
    if (!this.cardsPlayedByActiveUnit[card.blueprintId]) return false;

    return (
      this.cardsPlayedByActiveUnit[card.blueprintId] >=
      (card.aiHints.maxUsesPerTurn ?? Infinity)
    );
  }
}
