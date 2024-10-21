import { type Point3D, type Serializable } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import type { Game } from '../game';
import { Position } from '../utils/position';

export type SerializedCoords = `${string}:${string}:${string}`;

export type SerializedCell = {
  id: string;
  position: Point3D;
};

export type CellOptions = {
  id: string;
  position: Point3D;
};

export class Cell extends Entity implements Serializable {
  public position: Position;

  constructor(
    private game: Game,
    public options: CellOptions
  ) {
    super(createEntityId(options.id));
    this.position = Position.fromPoint3D(options.position);
  }

  get cellAbove(): Cell | null {
    return this.game.boardSystem.getCellAt({
      ...this.position,
      z: this.position.z + 1
    });
  }

  get cellBelow(): Cell | null {
    return this.game.boardSystem.getCellAt({
      ...this.position,
      z: this.position.z - 1
    });
  }

  get isTopMost(): boolean {
    return !this.game.boardSystem.getCellAt({ x: this.x, y: this.y, z: this.z + 1 });
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  get z() {
    return this.position.z;
  }

  get isWalkable() {
    // const above = this.game.boardSystem.getCellAt({
    //   ...this.position,
    //   z: this.position.z + 1
    // });
    // if (above) return false;
    // if (this.terrain !== TERRAINS.GROUND) return false;
    return true;
  }

  get unit() {
    return this.game.unitSystem.getUnitAt(this);
  }

  // get canSummonAt() {
  //   return !this.entity && this.isWalkable && this.terrain === TERRAINS.GROUND;
  // }

  serialize(): SerializedCell {
    return { id: this.id, position: this.position.serialize() };
  }
}
