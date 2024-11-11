import { type Values } from '@game/shared';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { shuffleArray } from '@game/shared';
import type { Game } from '../game/game';
import type { Card } from './card.entity';
import { nanoid } from 'nanoid';
import { createEntityId, Entity } from '../entity';

export const DECK_EVENTS = {
  BEFORE_DRAW: 'before_draw',
  AFTER_DRAW: 'after_draw'
} as const;

export type DeckEvent = Values<typeof DECK_EVENTS>;

export type DeckEventMap = {
  [DECK_EVENTS.BEFORE_DRAW]: [];
  [DECK_EVENTS.AFTER_DRAW]: [{ cards: Card[] }];
};

export class Deck extends Entity {
  private emitter = new TypedEventEmitter<DeckEventMap>();

  constructor(
    private game: Game,
    public cards: Card[]
  ) {
    super(createEntityId(`deck_${nanoid(4)}`));
  }

  get size() {
    return this.cards.length;
  }

  get on() {
    return this.emitter.on.bind(this.emitter);
  }

  get once() {
    return this.emitter.once.bind(this.emitter);
  }

  get off() {
    return this.emitter.off.bind(this.emitter);
  }

  shuffle() {
    this.cards = shuffleArray(this.cards, () => this.game.rngSystem.next());
  }

  draw(amount: number) {
    this.emitter.emit(DECK_EVENTS.BEFORE_DRAW);

    const cards = this.cards.splice(0, amount);

    this.emitter.emit(DECK_EVENTS.AFTER_DRAW, { cards: cards });

    return cards;
  }

  addToTop(card: Card) {
    this.cards.unshift(card);
  }

  addToBottom(card: Card) {
    this.cards.push(card);
  }

  peek(amount: number) {
    return this.cards.slice(0, amount);
  }

  pluck(card: Card) {
    this.cards = this.cards.filter(c => c !== card);
    return card;
  }
}
