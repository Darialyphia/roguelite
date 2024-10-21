import type { Serializable } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import type { Team } from './team.entity';

export type SerializedPlayer = {
  id: string;
};

export type PlayerOptions = {
  id: string;
  team: Team;
};

export class Player extends Entity implements Serializable<SerializedPlayer> {
  private team: Team;

  constructor(options: PlayerOptions) {
    super(createEntityId(options.id));
    this.team = options.team;
  }

  isEnemy(player: Player) {
    return player.team.equals(this.team);
  }

  serialize(): SerializedPlayer {
    return { id: this.id };
  }
}
