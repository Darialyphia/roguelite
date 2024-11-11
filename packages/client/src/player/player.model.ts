import type { Game } from '@game/engine';
import type { RosterUnit } from '@game/engine/src/player/player-roster.component';
import type { Player } from '@game/engine/src/player/player.entity';

export class PlayerViewModel {
  private game: Game;

  private player: Player;

  id: string;

  roster: RosterUnit[];

  constructor(game: Game, player: Player) {
    this.game = game;
    this.player = player;

    this.id = player.id;
    this.roster = player.roster.units;
  }

  getPlayer() {
    return this.player;
  }
}
