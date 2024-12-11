import { type Point3D } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import type { Game } from '../game/game';
import { Position } from '../utils/position';
import type { Terrain } from './board-utils';
import type { CellLight } from './map';

export type SerializedCoords = `${string}:${string}:${string}`;

export type CellOptions = {
  id: string;
  position: Point3D;
  terrain: Terrain;
  light?: CellLight;
};

export class Cell extends Entity {
  readonly position: Position;

  readonly terrain: Terrain;

  readonly light?: CellLight;

  constructor(
    private game: Game,
    public options: CellOptions
  ) {
    super(createEntityId(options.id));
    this.terrain = options.terrain;
    this.position = Position.fromPoint3D(options.position);
    this.light = options.light;
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
}
