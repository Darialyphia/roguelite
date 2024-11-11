import { assert, Vec3, type Nullable, type Point3D } from '@game/shared';
import type { Player } from './player.entity';
import type { Game } from '../game/game';
import { UNITS_DICTIONARY } from '../unit/units/_index';
import { CARDS_DICTIONARY } from '../card/cards/_index';
import { nanoid } from 'nanoid';

export type RosterUnit = {
  blueprintId: string;
  deck: Array<{ blueprintId: string }>;
  spriteParts: Record<string, string | null>;
};

export type PlayerRosterComponentOptions = {
  player: Player;
  units: RosterUnit[];
  deployZone: Point3D[];
};

export class PlayerRosterComponent {
  private game: Game;
  readonly units: RosterUnit[];

  readonly player: Player;

  private deployment: Nullable<Point3D[]> = null;

  readonly deployZone: Vec3[];

  constructor(game: Game, options: PlayerRosterComponentOptions) {
    this.game = game;
    this.units = options.units;
    this.player = options.player;
    this.deployZone = options.deployZone.map(point => Vec3.fromPoint3D(point));
    if (!this.units.length) {
      this.deployment = [];
    }
  }

  get isReady() {
    return !!this.deployment;
  }

  canDeployAt(point: Point3D) {
    return this.deployZone.some(vec => vec.equals(point));
  }

  commitDeployment(deployment: Point3D[]) {
    deployment.forEach(point => {
      assert(this.canDeployAt(point), 'Invalid deploy position');
    });
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
        cosmetics: unit?.spriteParts,
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
