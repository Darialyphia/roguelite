import { Vec3, type Point3D } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import type { Team } from './team.entity';
import type { Game } from '../game';
import { PlayerRosterComponent } from './player-roster.component';
import { UNITS_DICTIONARY } from '../unit/units/_index';
import { CARDS_DICTIONARY } from '../card/cards/_index';
import { nanoid } from 'nanoid';

export type PlayerOptions = {
  id: string;
  team: Team;
  roster: Array<{ blueprintId: string; deck: Array<{ blueprintId: string }> }>;
  deployZone: Point3D[];
  units: Array<{
    blueprintId: string;
    position: Point3D;
    deck: Array<{ blueprintId: string }>;
  }>;
};

export class Player extends Entity {
  private game: Game;

  private team: Team;

  readonly roster: PlayerRosterComponent;

  constructor(game: Game, options: PlayerOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.team = options.team;

    this.roster = new PlayerRosterComponent(this.game, {
      player: this,
      units: options.roster,
      deployZone: options.deployZone
    });

    options.units.forEach(unit => {
      this.game.unitSystem.addUnit({
        blueprint: UNITS_DICTIONARY[unit.blueprintId],
        player: this,
        position: unit.position,
        deck: unit.deck.map(card => {
          return {
            blueprint: CARDS_DICTIONARY[card.blueprintId],
            id: `card_${card.blueprintId}_${nanoid(4)}`
          };
        })
      });
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
