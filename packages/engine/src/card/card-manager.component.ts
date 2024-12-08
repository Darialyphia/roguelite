import type { Point3D } from '@game/shared';
import type { Game } from '../game/game';
import { Card, type CardOptions } from './card.entity';
import { Deck } from './deck.entity';
import type { Player } from '../player/player.entity';
import { createCard } from './card-factory';

export type CardManagerComponentOptions = {
  deck: CardOptions[];
};

export class CardManagerComponent {
  private game: Game;

  readonly deck: Deck;

  readonly hand: Card[] = [];

  readonly discardPile = new Set<Card>();

  constructor(game: Game, player: Player, options: CardManagerComponentOptions) {
    this.game = game;
    this.deck = new Deck(
      this.game,
      options.deck.map(card => createCard(this.game, player, card))
    );
    this.deck.shuffle();
  }

  get isHandFull() {
    return this.hand.length === this.game.config.MAX_HAND_SIZE;
  }

  get remainingCardsInDeck() {
    return this.deck.remaining;
  }

  get deckSize() {
    return this.deck.size;
  }

  getCardAt(index: number) {
    return [...this.hand][index];
  }

  draw(amount: number) {
    if (this.isHandFull) return;

    const cards = this.deck.draw(
      Math.min(amount, this.game.config.MAX_HAND_SIZE - this.hand.length)
    );

    cards.forEach(card => {
      this.hand.push(card);
    });
  }

  discard(card: Card) {
    this.hand.splice(this.hand.indexOf(card, 1));
    this.discardPile.add(card);
  }

  play(card: Card, targets: Point3D[]) {
    if (!this.hand.includes(card)) return;
    card.play(targets);
    this.discard(card);
  }

  replaceCardAt(index: number) {
    const card = this.getCardAt(index);
    if (!card) return;

    const replacement = this.deck.replace(card);
    this.hand[index] = replacement;
  }
}
