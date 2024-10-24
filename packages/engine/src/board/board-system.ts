import { isDefined, isString, type Point3D, type Serializable } from '@game/shared';
import { Cell, type CellOptions, type SerializedCell } from './cell';
import { createEntityId, type EntityId } from '../entity';
import { pointToCellId } from './board-utils';
import { System } from '../system';

export type BoardSystemOptions = {
  cells: CellOptions[];
  height: number;
  width: number;
};

export type SerializedBoard = {
  width: number;
  height: number;
  cells: SerializedCell[];
};

export class BoardSystem
  extends System<BoardSystemOptions>
  implements Serializable<SerializedBoard>
{
  height!: number;

  width!: number;

  cellsMap = new Map<EntityId, Cell>();

  initialize(options: BoardSystemOptions) {
    this.height = options.height;
    this.width = options.width;

    options.cells.forEach(cell => {
      const instance = new Cell(this.game, cell);
      this.cellsMap.set(instance.id, instance);
    });
  }

  get cells() {
    return [...this.cellsMap.values()];
  }

  serialize(): BoardSystemOptions {
    return {
      width: this.width,
      height: this.height,
      cells: this.cells.map(cell => cell.serialize())
    };
  }

  getCellAt(posOrKey: EntityId | Point3D) {
    if (isString(posOrKey)) {
      return this.cellsMap.get(posOrKey) ?? null;
    }

    return this.cellsMap.get(createEntityId(pointToCellId(posOrKey))) ?? null;
  }

  getManhattanDistance(p1: Point3D, p2: Point3D) {
    return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
  }

  getNeighbors(point: Point3D) {
    return [
      this.getCellAt({ x: point.x - 1, y: point.y - 1, z: point.z }),
      this.getCellAt({ x: point.x - 1, y: point.y, z: point.z }),
      this.getCellAt({ x: point.x - 1, y: point.y + 1, z: point.z }),
      this.getCellAt({ x: point.x, y: point.y - 1, z: point.z }),
      this.getCellAt({ x: point.x, y: point.y + 1, z: point.z }),
      this.getCellAt({ x: point.x + 1, y: point.y - 1, z: point.z }),
      this.getCellAt({ x: point.x + 1, y: point.y, z: point.z }),
      this.getCellAt({ x: point.x + 1, y: point.y + 1, z: point.z })
    ].filter(isDefined);
  }

  getNeighbors3D(point: Point3D) {
    return [
      ...this.getNeighbors({ ...point, z: point.z - 1 }),
      ...this.getNeighbors(point),
      ...this.getNeighbors({ ...point, z: point.z + 1 })
    ];
  }
}
