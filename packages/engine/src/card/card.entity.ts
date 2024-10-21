import type { Serializable } from '@game/shared';
import { createEntityId, Entity } from '../entity';

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
