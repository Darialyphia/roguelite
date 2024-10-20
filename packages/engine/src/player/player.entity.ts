import type { Serializable } from '@game/shared';
import { createEntityId, Entity } from '../entity';

export type SerializedPlayer = {
  id: string;
};

export type PlayerOptions = {
  id: string;
};

export class Player extends Entity implements Serializable<SerializedPlayer> {
  constructor(options: PlayerOptions) {
    super(createEntityId(options.id));
  }

  serialize(): SerializedPlayer {
    return { id: this.id };
  }
}
