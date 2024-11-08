import type { Point3D } from '@game/shared';
import type { Game } from '../game/game';
import { Card, type CardOptions } from './card.entity';
import { Deck } from './deck.entity';
import type { Unit } from '../unit/unit.entity';

export type CardManagerComponentOptions = {
  deck: CardOptions[];
};

export class CardManagerComponent {
  private game: Game;

  readonly deck: Deck;

  readonly hand = new Set<Card>();

  readonly discardPile = new Set<Card>();

  constructor(game: Game, unit: Unit, options: CardManagerComponentOptions) {
    this.game = game;
    this.deck = new Deck(
      this.game,
      options.deck.map(card => new Card(this.game, unit, card))
    );

    this.draw(this.game.config.INITIAL_HAND_SIZE);
  }

  get isHandFull() {
    return this.hand.size === this.game.config.MAX_HAND_SIZE;
  }

  get remainingCardsInDeck() {
    return this.deck.size;
  }

  getCardAt(index: number) {
    return [...this.hand][index];
  }

  draw(amount: number) {
    if (this.isHandFull) return;

    const cards = this.deck.draw(
      Math.min(amount, this.game.config.MAX_HAND_SIZE - this.hand.size)
    );

    cards.forEach(card => {
      this.hand.add(card);
    });
  }

  discard(card: Card) {
    this.hand.delete(card);
    this.discardPile.add(card);
  }

  play(card: Card, targets: Point3D[]) {
    if (!this.hand.has(card)) return;
    card.play(targets);
    this.discard(card);
  }
}
