import { Vec3, type Point3D, type Values } from '@game/shared';
import type { Game } from '../../game/game';
import { PathfinderComponent } from '../../pathfinding/pathfinder.component';
import type { PathfindingStrategy } from '../../pathfinding/strategies/pathinding-strategy';
import { Position } from '../../utils/position';
import { TypedEventEmitter } from '../../utils/typed-emitter';

export type MovementComponentOptions = {
  position: Point3D;
  pathfindingStrategy: PathfindingStrategy;
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
  private game: Game;

  private _position: Position;

  private pathfinding: PathfinderComponent;

  private emitter = new TypedEventEmitter<MoveEventMap>();

  constructor(game: Game, options: MovementComponentOptions) {
    this.game = game;
    this._position = Position.fromPoint3D(options.position);
    this.pathfinding = new PathfinderComponent(this.game, options.pathfindingStrategy);
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

  get position() {
    return this._position.clone();
  }

  get x() {
    return this._position.x;
  }

  get y() {
    return this._position.y;
  }

  get z() {
    return this._position.z;
  }

  isAt(point: Point3D) {
    return this._position.equals(point);
  }

  canMoveTo(point: Point3D, maxDistance: number) {
    const path = this.pathfinding.getPathTo(this, point);
    if (!path) return false;

    return path.distance <= maxDistance;
  }

  getPathTo(point: Point3D) {
    return this.pathfinding.getPathTo(this, point);
  }

  move(to: Point3D) {
    const path = this.pathfinding.getPathTo(this, to);
    if (!path) return;

    for (const point of path.path) {
      const currentPosition = this._position;
      this.emitter.emit(MOVE_EVENTS.BEFORE_MOVE, {
        position: this._position,
        destination: Vec3.fromPoint3D(point)
      });
      this._position = Position.fromPoint3D(point);
      this.emitter.emit(MOVE_EVENTS.AFTER_MOVE, {
        position: this._position,
        previousPosition: currentPosition
      });
    }

    return path;
  }

  shutdown() {
    this.emitter.removeAllListeners();
  }
}
