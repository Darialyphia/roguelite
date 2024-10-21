import type { Serializable, Values } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import { TypedEventEmitter } from '../utils/typed-emitter';

export type SerializedCard = {
  id: string;
};

export type CardOptions = {
  id: string;
};

export class Card extends Entity implements Serializable<SerializedCard> {
  constructor(options: CardOptions) {
    super(createEntityId(options.id));
  }

  serialize(): SerializedCard {
    return { id: this.id };
  }

  play() {
    console.log('todo card play');
  }
}
