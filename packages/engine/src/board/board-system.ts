import { isDefined, isString, type BetterOmit, type Point3D } from '@game/shared';
import { Cell, type CellOptions } from './cell';
import { createEntityId, type EntityId } from '../entity';
import { pointToCellId } from './board-utils';
import { System } from '../system';
import type { GameMap } from './map';

export type BoardSystemOptions = {
  map: GameMap;
};

export class BoardSystem extends System<BoardSystemOptions> {
  map!: GameMap;

  cellsMap = new Map<EntityId, Cell>();

  initialize(options: BoardSystemOptions) {
    this.map = options.map;
    this.map.cells.forEach((plane, z) => {
      plane.forEach((row, y) => {
        row.forEach((cell, x) => {
          const instance = new Cell(this.game, {
            id: `${x}.${y}.${z}`,
            position: { x, y, z },
            terrain: cell.terrain
          });
          this.cellsMap.set(instance.id, instance);
        });
      });
    });
  }

  get width() {
    return this.map.width;
  }

  get height() {
    return this.map.height;
  }

  get cells() {
    return [...this.cellsMap.values()];
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
