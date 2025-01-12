import { isDefined, isString, type Point, type Point3D } from '@game/shared';
import { Cell } from './cell';
import { pointToCellId } from './board-utils';
import { System } from '../system';
import type { GameMap } from './map';
import { defineHex, Grid, Orientation, rectangle, spiral } from 'honeycomb-grid';
import { defaultConfig } from '../config';

export type BoardSystemOptions = {
  map: GameMap;
};

export const BoardHex = defineHex({
  dimensions: {
    width: defaultConfig.TILE_WIDTH,
    height: defaultConfig.TILE_HEIGHT
  },
  orientation: Orientation.POINTY
});

type HexFloor = Grid<InstanceType<typeof BoardHex>>;

export class BoardSystem extends System<BoardSystemOptions> {
  name = 'BOARD SYSTEM';

  color = 'green';

  map!: GameMap;

  cellsMap = new Map<string, Cell>();

  floors!: Array<HexFloor>;

  dimensions!: { width: number; height: number };

  padding!: { x: number; y: number };

  initialize(options: BoardSystemOptions) {
    this.map = options.map;

    this.floors = this.map.floors.map(
      () => new Grid(BoardHex, rectangle({ width: this.map.cols, height: this.map.rows }))
    );

    this.map.floors.forEach((floor, z) => {
      floor.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (!cell) return;

          const instance = new Cell(this.game, {
            id: pointToCellId({ x, y, z }),
            position: { x, y, z },
            hex: this.floors[z].createHex({ col: x, row: y }),
            ...cell
          });
          this.cellsMap.set(instance.id, instance);
        });
      });
    });

    this.dimensions = {
      width: options.map.cols,
      height: options.map.rows
    };
    this.padding = options.map.padding;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  shutdown() {}

  get width() {
    return this.map.cols;
  }

  get height() {
    return this.map.rows;
  }

  get cells() {
    return [...this.cellsMap.values()];
  }

  getCellAt(posOrKey: string | Point3D) {
    if (isString(posOrKey)) {
      return this.cellsMap.get(posOrKey) ?? null;
    }
    return this.cellsMap.get(pointToCellId(posOrKey)) ?? null;
  }

  getDistance(from: Point3D, to: Point3D) {
    return this.floors[from.z].distance(
      { col: from.x, row: from.y },
      { col: to.x, row: to.y }
    );
  }

  getNeighbors(point: Point3D) {
    const floor = this.floors[point.z];
    if (!floor) return [];

    const neighbors = floor
      .traverse(spiral({ radius: 1, start: { col: point.x, row: point.y } }))
      .toArray()
      .map(hex => {
        return this.getCellAt({ x: hex.col, y: hex.row, z: point.z });
      })
      .filter(isDefined);
    return neighbors;
  }

  getNeighbors3D(point: Point3D) {
    return [
      ...this.getNeighbors({ ...point, z: point.z - 1 }),
      ...this.getNeighbors(point),
      ...this.getNeighbors({ ...point, z: point.z + 1 })
    ].filter(cell => !cell.cellAbove);
  }

  getCellsWithin(topLeft: Point, bottomRight: Point) {
    return [...this.cellsMap.values()].filter(
      cell =>
        cell.x >= topLeft.x &&
        cell.x <= bottomRight.x &&
        cell.y >= topLeft.y &&
        cell.y <= bottomRight.y
    );
  }
}
