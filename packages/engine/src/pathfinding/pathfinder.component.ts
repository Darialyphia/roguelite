import { Vec3, type Point3D } from '@game/shared';
import { dijkstra, findShortestPath } from './dijkstra';
import type { Game } from '../game';
import type { Unit } from '../unit/unit.entity';
import type { SerializedCoords } from '../board/cell';
import { cellIdToPoint, pointToCellId } from '../board/board-utils';
import type { PathfindingStrategy } from './strategies/pathinding-strategy';

export type DistanceMap = {
  costs: ReturnType<typeof dijkstra>['costs'];
  get: (point: Point3D) => number;
};

export class PathfinderComponent {
  constructor(
    private game: Game,
    private strategy: PathfindingStrategy
  ) {}

  changeStrategy(strategy: PathfindingStrategy) {
    this.strategy = strategy;
  }

  getDistanceMap(from: Point3D): DistanceMap {
    const map = dijkstra(this.strategy, pointToCellId(from));

    return {
      costs: map.costs,
      get(pt: Point3D) {
        return map.costs[pointToCellId(pt)];
      }
    };
  }

  getPathTo(from: Point3D, to: Point3D) {
    const entityAtPoint = this.game.unitSystem.getUnitAt(to);
    if (entityAtPoint) return null;

    const path = findShortestPath<SerializedCoords>(
      this.strategy,
      pointToCellId(from),
      pointToCellId(to)
    );

    if (!path) return null;
    this.strategy.done();

    return {
      distance: path.distance,
      path: path.path.map(p => Vec3.fromPoint3D(cellIdToPoint(p)))
    };
  }
}
