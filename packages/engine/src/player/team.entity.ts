import { Player, type SerializedPlayer, type PlayerOptions } from './player.entity';
import { type Serializable } from '@game/shared';
import { createEntityId, Entity, type EntityId } from '../entity';

export type TeamOptions = {
  id: string;
  players: PlayerOptions[];
};

export type SerializedTeam = {
  id: string;
  players: SerializedPlayer[];
};

export class Team extends Entity implements Serializable<SerializedTeam> {
  private playerMap = new Map<EntityId, Player>();

  constructor(options: TeamOptions) {
    super(createEntityId(options.id));
    options.players.forEach(player => {
      const entity = new Player(player);
      this.playerMap.set(entity.id, entity);
    });
  }

  get players() {
    return [...this.playerMap.values()];
  }

  getPlayerById(id: EntityId) {
    return this.playerMap.get(id);
  }

  serialize() {
    return {
      id: this.id,
      players: this.players.map(player => player.serialize())
    };
  }
}
