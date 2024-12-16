import { isDefined } from '@game/shared';
import type { Card } from '../card/card.entity';
import { SpellCard } from '../card/spell-card.entity';
import { UnitCard } from '../card/unit-card.entity';
import type { Game } from '../game/game';
import type { SerializedInput } from '../input/input-system';
import { RUNES } from '../utils/rune';
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
    if (!card.aiHints.maxUsesPerTurn) return false;
    return this.cardsPlayedByActiveUnit[card.blueprintId] >= card.aiHints.maxUsesPerTurn;
  }

  getPreScoreResourceActionScoreModifier(
    game: Game,
    input: SerializedInput & {
      type: 'drawResourceAction' | 'runeResourceAction' | 'goldResourceAction';
    }
  ) {
    const player = game.turnSystem.activeUnit.player;
    const needRune = player.hand
      .filter(card => card instanceof UnitCard || card instanceof SpellCard)
      .some(card => !player.hasUnlockedRunes(card.cost.runes));
    if (needRune && input.type !== 'runeResourceAction') {
      return Number.NEGATIVE_INFINITY;
    }

    if (input.type === 'runeResourceAction') {
      const runeWeights = player.hand
        .filter(card => card instanceof UnitCard || card instanceof SpellCard)
        .filter(card => !player.hasUnlockedRunes(card.cost.runes))
        .reduce(
          (total, card) => {
            const missing = player.getMissingRunes(card.cost.runes);
            const missingCount = player.runes.length - card.cost.runes.length;
            Object.entries(missing).forEach(([runeName, count]) => {
              if (runeName === RUNES.COLORLESS.id) return total;
              if (!isDefined(total[runeName])) {
                total[runeName] = 0;
              }
              total[runeName] += count * (missingCount === 1 ? 4 : 1); // give more weight to cards that are 1 rune away from being playable
            });
            return total;
          },
          {} as Record<string, number>
        );
      let bestRune: string | undefined = undefined;
      Object.entries(runeWeights).forEach(([key, weight]) => {
        if (!bestRune) {
          bestRune = key;
        } else if (runeWeights[bestRune] < weight) {
          bestRune = key;
        }
      });
      if (!isDefined(bestRune)) return 0;

      return bestRune === input.payload.rune ? 0 : Number.NEGATIVE_INFINITY;
    }

    const needGold = player.hand
      .filter(card => card instanceof UnitCard)
      .every(card => {
        card.cost.gold > player.gold;
      });
    if (needGold && input.type === 'drawResourceAction') {
      return Number.NEGATIVE_INFINITY;
    }

    return 0;
  }

  getScoreModifier(game: Game, input: SerializedInput): ScoreModifier {
    const defaultModifier: ScoreModifier = {
      pre: () => 0,
      post: () => 0
    };

    if (
      input.type === 'drawResourceAction' ||
      input.type === 'goldResourceAction' ||
      input.type === 'runeResourceAction'
    ) {
      return {
        pre: (game: Game) => this.getPreScoreResourceActionScoreModifier(game, input),
        post: () => 0
      };
    }
    if (input.type === 'playCard') {
      const card = game.turnSystem.activeUnit.player.getCardAt(input.payload.index);
      const { preScoreModifier, postScoreModifier } = card.aiHints;

      return {
        pre: preScoreModifier
          ? (game: Game) => preScoreModifier(game, card, input.payload.targets)
          : defaultModifier.pre,
        post: postScoreModifier
          ? (game: Game) => postScoreModifier(game, card, input.payload.targets)
          : defaultModifier.pre
      };
    }

    return defaultModifier;
  }
}
