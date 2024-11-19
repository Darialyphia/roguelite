import type { Card } from '../card/card.entity';
import type { Game } from '../game/game';
import type { SerializedInput } from '../input/input-system';
import type { ScoreModifier } from './ai-scorer';

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

  getScoreModifier(game: Game, input: SerializedInput): ScoreModifier {
    const defaultModifier: ScoreModifier = {
      pre: () => 0,
      post: (game, score) => score
    };

    if (input.type === 'playCard') {
      const card = game.turnSystem.activeUnit.getCardAt(input.payload.index);
      const { preScoreModifier, postScoreModifier } = card.aiHints;

      return {
        pre: preScoreModifier
          ? (game: Game) => preScoreModifier(game, card, input.payload.targets)
          : defaultModifier.pre,
        post: postScoreModifier
          ? (game: Game, score: number) =>
              postScoreModifier(game, card, score, input.payload.targets)
          : defaultModifier.pre
      };
    }

    return defaultModifier;
  }
}
