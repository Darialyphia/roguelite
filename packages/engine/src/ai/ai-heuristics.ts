import { isDefined } from '@game/shared';
import type { Card } from '../card/card.entity';
import { SpellCard } from '../card/spell-card.entity';
import { UnitCard } from '../card/unit-card.entity';
import { GAME_EVENTS, type Game } from '../game/game';
import type { SerializedInput } from '../input/input-system';
import { RUNES } from '../utils/rune';
import type { ScoreModifier } from './ai-scorer';
import type { EntityId } from '../entity';

export class AiHeuristics {
  private game: Game;
  private cardsPlayedByActivePlayer: Record<string, number> = {};

  constructor(game: Game) {
    this.game = game;

    game.on(GAME_EVENTS.PLAYER_AFTER_PLAY_CARD, e => {
      if (!this.cardsPlayedByActivePlayer[e.card.blueprintId]) {
        this.cardsPlayedByActivePlayer[e.card.blueprintId] = 0;
      }
      this.cardsPlayedByActivePlayer[e.card.blueprintId]++;
    });

    game.on(GAME_EVENTS.PLAYER_END_TURN, () => {
      this.cardsPlayedByActivePlayer = {};
    });
  }

  shouldAvoidPlayingCard(game: Game, card: Card) {
    if (!this.cardsPlayedByActivePlayer[card.blueprintId]) return false;
    if (!card.aiHints.maxUsesPerTurn) return false;
    return (
      this.cardsPlayedByActivePlayer[card.blueprintId] >=
      card.aiHints.maxUsesPerTurn(game, card)
    );
  }

  getResourceActionPreScoreModifier(
    game: Game,
    input: SerializedInput & {
      type: 'drawResourceAction' | 'runeResourceAction' | 'goldResourceAction';
    }
  ) {
    const player = game.turnSystem.activePlayer;
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
      const card = game.turnSystem.activePlayer.getCardAt(input.payload.index);
      const { prePlayScoreModifier, postPlayScoreModifier } = card.aiHints;

      return {
        pre: prePlayScoreModifier
          ? (game: Game) => prePlayScoreModifier(game, card, input.payload.targets)
          : defaultModifier.pre,
        post: postPlayScoreModifier
          ? (game: Game) => postPlayScoreModifier(game, card, input.payload.targets)
          : defaultModifier.pre
      };
    }

    if (input.type === 'attack') {
      const unit = game.unitSystem.getUnitById(input.payload.unitId as EntityId)!;
      const { preAttackScoreModifier, postAttackScoreModifier } = unit.card.aiHints;

      return {
        pre: preAttackScoreModifier
          ? (game: Game) => preAttackScoreModifier(game, unit, input.payload)
          : defaultModifier.pre,
        post: postAttackScoreModifier
          ? (game: Game) => postAttackScoreModifier(game, unit, input.payload)
          : defaultModifier.pre
      };
    }

    if (input.type === 'move') {
      const unit = game.unitSystem.getUnitById(input.payload.unitId as EntityId)!;
      const { preMoveScoreModifier, postMoveScoreModifier } = unit.card.aiHints;

      return {
        pre: preMoveScoreModifier
          ? (game: Game) => preMoveScoreModifier(game, unit, input.payload)
          : defaultModifier.pre,
        post: postMoveScoreModifier
          ? (game: Game) => postMoveScoreModifier(game, unit, input.payload)
          : defaultModifier.pre
      };
    }

    if (input.type === 'endTurn') {
      return {
        pre: defaultModifier.pre,
        post: (game: Game) => {
          const units = game.turnSystem.activePlayer.units.reduce((total, unit) => {
            return unit.card.aiHints.endTurnWhileOnBoardScoreModifier
              ? total + unit.card.aiHints.endTurnWhileOnBoardScoreModifier(game, unit)
              : total;
          }, 0);
          const hand = game.turnSystem.activePlayer.hand.reduce((total, card) => {
            return card.aiHints.endTurnWhileInHandScoreModifier
              ? total + card.aiHints.endTurnWhileInHandScoreModifier(game, card)
              : total;
          }, 0);

          return units + hand;
        }
      };
    }
    return defaultModifier;
  }
}
