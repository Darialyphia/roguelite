import { Player, type PlayerOptions } from './player.entity';
import { createEntityId, Entity, type EntityId } from '../entity';
import type { Point3D } from '@game/shared';

export type TeamOptions = {
  id: string;
  players: PlayerOptions[];
  deployZone: Point3D[];
};

export class Team extends Entity {
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
}
