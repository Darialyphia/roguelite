import type { Serializable, Values } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import { TypedEventEmitter } from '../utils/typed-emitter';

export type SerializedCard = {
  id: string;
};

export type CardOptions = {
  id: string;
};

export const CARD_EVENTS = {
  BEFORE_PLAYED: 'before_played',
  AFTER_PLAYED: 'after_played',
  DRAWN: 'drawn'
} as const;

export type CardEvent = Values<typeof CARD_EVENTS>;

export type CardEventMap = {
  [CARD_EVENTS.BEFORE_PLAYED]: [Card];
  [CARD_EVENTS.AFTER_PLAYED]: [Card];
  [CARD_EVENTS.DRAWN]: [Card];
};

export class Card extends Entity implements Serializable<SerializedCard> {
  private emitter = new TypedEventEmitter<CardEventMap>();

  constructor(options: CardOptions) {
    super(createEntityId(options.id));
  }

  serialize(): SerializedCard {
    return { id: this.id };
  }

  get on() {
    return this.emitter.on;
  }

  get once() {
    return this.emitter.once;
  }

  get off() {
    return this.emitter.off;
  }

  draw() {
    return this.emitter.emit(CARD_EVENTS.DRAWN, this);
  }
}
