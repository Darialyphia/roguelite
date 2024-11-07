import { Vec3, type Point3D } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import type { Team } from './team.entity';

export type PlayerOptions = {
  id: string;
  team: Team;
  deployZone: Point3D[];
};

export class Player extends Entity {
  private team: Team;

  readonly deployZone: Vec3[];

  constructor(options: PlayerOptions) {
    super(createEntityId(options.id));
    this.team = options.team;
    this.deployZone = options.deployZone.map(point => Vec3.fromPoint3D(point));
  }

  isEnemy(player: Player) {
    return player.team.equals(this.team);
  }
}
