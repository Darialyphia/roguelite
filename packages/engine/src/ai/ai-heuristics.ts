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

  getResourceActionPreScoreModifier(
    game: Game,
    input: SerializedInput & {
      type: 'drawResourceAction' | 'runeResourceAction' | 'goldResourceAction';
    }
  ) {
    const player = game.turnSystem.activeUnit.player;
    const hand = player.hand.filter(
      card => card instanceof UnitCard || card instanceof SpellCard
    );

    const cardsWithUnlockedRunes = hand.filter(
      card => !player.hasUnlockedRunes(card.cost.runes)
    );
    const needRune = !!cardsWithUnlockedRunes.length;
    // AI hasnt unlocked al runes for card in hand and chose to draw or gain gold instead, bias against it
    // it might not always be the best plays but it avoids the AI taking a resource action and still not being able to play any card
    if (needRune && input.type !== 'runeResourceAction') {
      return Number.NEGATIVE_INFINITY;
    }

    if (input.type === 'runeResourceAction') {
      // Determine if  the unlocked rune is the best
      // assign a weight to each rune type depending on the missing runes for each card in hand
      const runeWeights = cardsWithUnlockedRunes.reduce(
        (total, card) => {
          const missingByRune = player.getMissingRunes(card.cost.runes);
          const missingCount = player.runes.length - card.cost.runes.length;

          Object.entries(missingByRune).forEach(([runeName, count]) => {
            if (runeName === RUNES.COLORLESS.id) return;
            if (!isDefined(total[runeName])) {
              total[runeName] = 0;
            }
            const scale = missingCount === 1 ? 4 : 1; // give more weight to cards that are 1 rune away from being playable
            total[runeName] += count * scale;
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

      // no best rune to be played over another, the current choie is as good as any
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
        pre: (game: Game) => this.getResourceActionPreScoreModifier(game, input),
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
