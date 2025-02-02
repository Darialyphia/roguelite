import { Vec3, type Point3D, type Values } from '@game/shared';
import { PathfinderComponent } from '../../pathfinding/pathfinder.component';
import { Position } from '../../utils/position';
import { TypedEventEmitter } from '../../utils/typed-emitter';
import { cellIdToPoint } from '../../board/board-utils';
import type { SerializedCoords } from '../../board/cell';

export type MovementComponentOptions = {
  position: Point3D;
  pathfinding: PathfinderComponent;
};

export const MOVE_EVENTS = {
  BEFORE_MOVE: 'before_move',
  AFTER_MOVE: 'after_move'
} as const;

export type MoveEvent = Values<typeof MOVE_EVENTS>;

export type MoveEventMap = {
  [MOVE_EVENTS.BEFORE_MOVE]: [{ position: Vec3; destination: Vec3 }];
  [MOVE_EVENTS.AFTER_MOVE]: [{ position: Vec3; previousPosition: Vec3 }];
};

export class MovementComponent {
  position: Position;

  private _movementsCount = 0;

  private pathfinding: PathfinderComponent;

  private emitter = new TypedEventEmitter<MoveEventMap>();

  constructor(options: MovementComponentOptions) {
    this.position = Position.fromPoint3D(options.position);
    this.pathfinding = options.pathfinding;
  }

  get on() {
    return this.emitter.on.bind(this.emitter);
  }

  get once() {
    return this.emitter.once.bind(this.emitter);
  }

  get off() {
    return this.emitter.off.bind(this.emitter);
  }

  get movementsCount() {
    return this._movementsCount;
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

  isAt(point: Point3D) {
    return this.position.equals(point);
  }

  resetMovementsCount() {
    this._movementsCount = 0;
  }

  setMovementCount(count: number) {
    this._movementsCount = count;
  }

  getAllPossibleMoves(maxDistance: number) {
    const distanceMap = this.pathfinding.getDistanceMap(this.position, maxDistance);

    return Object.entries(distanceMap.costs)
      .filter(([, cost]) => cost <= maxDistance)
      .map(([cellId]) => cellIdToPoint(cellId as SerializedCoords));
  }

  canMoveTo(point: Point3D, maxDistance: number) {
    const path = this.pathfinding.getPathTo(this.position, point);
    if (!path) return false;
    return path.distance <= maxDistance;
  }

  getPathTo(point: Point3D, maxDistance?: number) {
    return this.pathfinding.getPathTo(this, point, maxDistance);
  }

  move(to: Point3D) {
    const path = this.pathfinding.getPathTo(this, to);
    if (!path) return;

    for (const point of path.path) {
      const currentPosition = this.position;
      this.emitter.emit(MOVE_EVENTS.BEFORE_MOVE, {
        position: this.position,
        destination: Vec3.fromPoint3D(point)
      });
      this.position = Position.fromPoint3D(point);
      this._movementsCount++;
      this.emitter.emit(MOVE_EVENTS.AFTER_MOVE, {
        position: this.position,
        previousPosition: currentPosition
      });
    }

    return path;
  }

  shutdown() {
    this.emitter.removeAllListeners();
  }
}
