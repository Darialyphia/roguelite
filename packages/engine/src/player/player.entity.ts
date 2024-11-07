import { Vec3, type Point3D } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import type { Team } from './team.entity';
import type { Game } from '../game';
import { PlayerRosterComponent } from './player-roster.component';

export type PlayerOptions = {
  id: string;
  team: Team;
  roster: Array<{ blueprintId: string; deck: Array<{ blueprintId: string }> }>;
  deployZone: Point3D[];
};

export class Player extends Entity {
  private game: Game;

  private team: Team;

  readonly deployZone: Vec3[];

  readonly roster: PlayerRosterComponent;

  constructor(game: Game, options: PlayerOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.team = options.team;
    this.deployZone = options.deployZone.map(point => Vec3.fromPoint3D(point));
    this.roster = new PlayerRosterComponent(this.game, {
      player: this,
      units: options.roster
    });
  }

  isEnemy(player: Player) {
    return player.team.equals(this.team);
  }

  get commitDeployment() {
    return this.roster.commitDeployment;
  }

  get isReady() {
    return this.roster.isReady;
  }

  get deploy() {
    return this.roster.deploy;
  }
}
