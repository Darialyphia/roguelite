import type { Nullable, Point3D } from '@game/shared';
import type { Player } from './player.entity';
import type { Game } from '../game';
import { UNITS_DICTIONARY } from '../unit/units/_index';
import { CARDS_DICTIONARY } from '../card/cards/_index';
import { nanoid } from 'nanoid';

export type RosterUnit = { blueprintId: string; deck: Array<{ blueprintId: string }> };

export type PlayerRosterComponentOptions = {
  player: Player;
  units: RosterUnit[];
};

export class PlayerRosterComponent {
  private game: Game;
  readonly units: RosterUnit[];

  readonly player: Player;

  private deployment: Nullable<Point3D[]> = null;

  constructor(game: Game, options: PlayerRosterComponentOptions) {
    this.game = game;
    this.units = options.units;
    this.player = options.player;
  }

  get isReady() {
    return !!this.deployment;
  }

  commitDeployment(deployment: Point3D[]) {
    this.deployment = deployment;
  }

  deploy() {
    if (!this.deployment) {
      throw new Error('Cannot deploy units before commiting deployment');
    }

    this.units.forEach((unit, index) => {
      this.game.unitSystem.addUnit({
        blueprint: UNITS_DICTIONARY[unit.blueprintId],
        player: this.player,
        position: this.deployment![index],
        deck: unit.deck.map(card => {
          return {
            blueprint: CARDS_DICTIONARY[card.blueprintId],
            id: `card_${card.blueprintId}_${nanoid(4)}`
          };
        })
      });
    });
  }
}
