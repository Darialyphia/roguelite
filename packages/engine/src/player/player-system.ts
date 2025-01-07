import type { EntityId } from '../entity';
import { System } from '../system';
import { PLAYER_EVENTS } from './player-enums';
import { type Player } from './player.entity';
import { Team, type TeamOptions } from './team.entity';

export type PlayerSystemOptions = { teams: TeamOptions[] };

export class PlayerSystem extends System<PlayerSystemOptions> {
  private teamMap = new Map<EntityId, Team>();

  private playerMap = new Map<EntityId, Player>();

  initialize(options: PlayerSystemOptions): void {
    options.teams.forEach(teamInfo => {
      const team = new Team(this.game, teamInfo);
      this.teamMap.set(team.id, team);
      team.players.forEach(player => {
        this.playerMap.set(player.id, player);
        this.forwardListeners(player);
      });
    });
  }

  shutdown() {
    this.players.forEach(player => player.shutdown());
  }

  getTeamById(id: EntityId) {
    return this.teamMap.get(id);
  }

  getPlayerById(id: EntityId) {
    return this.playerMap.get(id);
  }

  get teams() {
    return [...this.teamMap.values()];
  }

  get players() {
    return [...this.playerMap.values()];
  }

  forwardListeners(player: Player) {
    Object.values(PLAYER_EVENTS).forEach(eventName => {
      player.on(eventName, event => {
        this.game.emit(`player.${eventName}`, { ...event, player } as any);
      });
    });
  }
}
