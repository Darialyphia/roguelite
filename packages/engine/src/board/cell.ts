import { type Point3D } from '@game/shared';
import { createEntityId, Entity, type EntityId } from '../entity';
import type { Game } from '../game/game';
import { Position } from '../utils/position';
import { TERRAINS, type Terrain } from './board-utils';
import type { CellLight } from './map';
import { Obstacle } from '../obstacle/obstacle.entity';
import { nanoid } from 'nanoid';
import type { BoardHex } from './board-system';
import { makeObstacleId } from '../obstacle/obstacle.utils';

export type SerializedCoords = `${string}:${string}:${string}`;

export type CellOptions = {
  id: string;
  position: Point3D;
  terrain: Terrain;
  light?: CellLight;
  obstacle?: string;
  spriteId: string;
  hex: InstanceType<typeof BoardHex>;
};

export class Cell extends Entity {
  readonly position: Position;

  readonly spriteId: string;

  readonly terrain: Terrain;

  readonly light?: CellLight;

  obstacle: Obstacle | null;

  readonly hex: InstanceType<typeof BoardHex>;

  constructor(
    private game: Game,
    public options: CellOptions
  ) {
    super(createEntityId(options.id));
    this.terrain = options.terrain;
    this.position = Position.fromPoint3D(options.position);
    this.light = options.light;
    this.spriteId = options.spriteId;

    this.obstacle = options.obstacle
      ? new Obstacle(this.game, {
          blueprintId: options.obstacle,
          id: makeObstacleId(this),
          position: this.position
        })
      : null;
    this.hex = options.hex;
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

  get neighbors(): Cell[] {
    return this.game.boardSystem.getNeighbors(this);
  }

  get neighbors3D(): Cell[] {
    return this.game.boardSystem.getNeighbors3D(this);
  }

  get isWalkable() {
    const above = this.game.boardSystem.getCellAt({
      ...this.position,
      z: this.position.z + 1
    });
    if (above) return false;
    if (this.terrain !== TERRAINS.GROUND) return false;

    if (this.obstacle) {
      return this.obstacle.isWalkable;
    }

    return true;
  }

  get unit() {
    return this.game.unitSystem.getUnitAt(this);
  }
}
