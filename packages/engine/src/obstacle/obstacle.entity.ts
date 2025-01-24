import { type Point3D, type Nullable, type AnyObject, assert } from '@game/shared';
import { Entity, type EntityId } from '../entity';
import type { Unit } from '../unit/unit.entity';
import { Position } from '../utils/position';
import { OBSTACLES } from './obstacles/_index';
import type { ObstacleBlueprint } from './obstacle-blueprint';
import type { Game } from '../game/game';
import { Interceptable, type inferInterceptor } from '../utils/interceptable';

export type ObstacleOptions = {
  id: EntityId;
  blueprintId: string;
  position: Point3D;
  playerId?: EntityId;
};

export type ObstacleInterceptor = Obstacle['interceptors'];

export class Obstacle extends Entity {
  position: Position;
  blueprintId: string;
  playerId?: EntityId;
  occupant: Nullable<Unit> = null;
  spriteId: string;
  iconId: string;
  meta: AnyObject = {};
  isAttackable: boolean;

  private interceptors = {
    canBeSummonTarget: new Interceptable<boolean>()
  };

  constructor(
    private game: Game,
    options: ObstacleOptions
  ) {
    super(options.id);
    this.blueprintId = options.blueprintId;
    this.spriteId = this.blueprint.spriteId;
    this.iconId = this.blueprint.iconId;
    this.position = Position.fromPoint3D(options.position);
    this.playerId = options.playerId;
    this.isAttackable = this.blueprint.attackable;
    this.checkOccupation = this.checkOccupation.bind(this);
    this.game.on('*', this.checkOccupation);

    this.checkOccupation();
    this.blueprint.onCreated?.(this.game, this);
  }

  get name() {
    return this.blueprint.name;
  }

  get description() {
    return this.blueprint.description;
  }

  get player() {
    if (!this.playerId) return null;
    return this.game.playerSystem.getPlayerById(this.playerId);
  }

  get blueprint(): ObstacleBlueprint {
    return OBSTACLES[this.blueprintId];
  }

  get isWalkable() {
    return this.blueprint.walkable;
  }

  get canBeSummonTarget() {
    return this.interceptors.canBeSummonTarget.getValue(false, {});
  }

  private checkOccupation() {
    const previous = this.occupant;

    this.occupant = this.game.unitSystem.getUnitAt(this.position);
    if (!previous && this.occupant) {
      this.blueprint.onEnter?.(this.game, this);
    } else if (previous && !this.occupant) {
      this.blueprint.onLeave?.(this.game, this);
    }
  }

  destroy() {
    this.blueprint.onDestroyed?.(this.game, this);
    this.game.boardSystem.getCellAt(this.position)!.obstacle = null;
    this.game.off('*', this.checkOccupation);
  }

  attack(unit: Unit) {
    assert(this.isAttackable, 'obstacle cannot be attacked');

    this.blueprint.onAttacked?.(this.game, this, unit);
  }

  addInterceptor<T extends keyof ObstacleInterceptor>(
    key: T,
    interceptor: inferInterceptor<ObstacleInterceptor[T]>,
    priority?: number
  ) {
    this.interceptors[key].add(interceptor as any, priority);

    return () => this.removeInterceptor(key, interceptor);
  }

  removeInterceptor<T extends keyof ObstacleInterceptor>(
    key: T,
    interceptor: inferInterceptor<ObstacleInterceptor[T]>
  ) {
    this.interceptors[key].remove(interceptor as any);
  }
}
