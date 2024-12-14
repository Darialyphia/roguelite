import { Vec3, isDefined, type Point3D } from '@game/shared';
import { isString } from 'lodash-es';
import {
  type Direction,
  assertSerializedcoords,
  cellIdToPoint,
  DIRECTIONS_TO_DIFF,
  pointToCellId
} from '../../board/board-utils';
import type { Cell, SerializedCoords } from '../../board/cell';
import type { Game } from '../../game/game';
import type { Edge } from '../dijkstra';
import type { PathfindingStrategy } from './pathinding-strategy';

export type SolidPathfindingStrategyOptions = {
  origin: Point3D;
};

/**
 * A pathfinding strategy for solid bodies that cannot pass through other bodies
 */
export class SolidBodyPathfindingStrategy implements PathfindingStrategy {
  private cache = new Map<SerializedCoords, Edge<SerializedCoords>[]>();

  private origin!: Vec3;

  constructor(private game: Game) {}

  done() {
    this.cache.clear();
  }

  setOrigin(origin: Point3D) {
    this.origin = Vec3.fromPoint3D(origin);
  }

  getEdge(posOrKey: Point3D | string, direction: Direction): Cell | null {
    let from: Point3D;
    if (isString(posOrKey)) {
      from = Vec3.fromPoint3D(cellIdToPoint(posOrKey as SerializedCoords));
    } else {
      from = Vec3.fromPoint3D(posOrKey);
    }

    const target = Vec3.add(from, DIRECTIONS_TO_DIFF[direction]);

    const currentCell = this.game.boardSystem.getCellAt(from);
    const cell = this.game.boardSystem.getCellAt(target);
    const cellBelow = this.game.boardSystem.getCellAt({ ...target, z: target.z - 1 });
    const cellAbove = this.game.boardSystem.getCellAt({ ...target, z: target.z + 1 });

    if (!currentCell) return null;

    if (!currentCell.isWalkable) return null;
    if (cellAbove?.isWalkable) {
      return cellAbove;
    }

    if (cell?.isWalkable) {
      return cell;
    }

    if (cellBelow?.isWalkable) {
      return cellBelow;
    }

    return null;
  }

  computeNeighbors(node: SerializedCoords) {
    const edges = [
      this.getEdge(node, 'north'),
      this.getEdge(node, 'south'),
      this.getEdge(node, 'west'),
      this.getEdge(node, 'east')
    ];
    this.cache.set(
      node,
      edges
        .filter(isDefined)
        .filter(cell => this.isEdgeValid(cell))
        .map(point => {
          return {
            node: pointToCellId(point),
            weight: 1
          };
        })
    );
  }

  isEdgeValid(cell: Cell) {
    if (this.origin.equals(cell)) return false;

    const entityAtPoint = this.game.unitSystem.getUnitAt(cell);
    return !entityAtPoint;
  }

  getEdges(node: SerializedCoords): Array<Edge<SerializedCoords>> {
    if (!this.cache.has(node)) {
      this.computeNeighbors(node);
    }
    return this.cache.get(node)!;
  }
}
