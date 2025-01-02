import { type Point3D, type Nullable, type AnyObject, assert } from '@game/shared';
import { Entity, type EntityId } from '../entity';
import type { Unit } from '../unit/unit.entity';
import { Position } from '../utils/position';
import { GAME_EVENTS, type Game } from '../game/game';
import { OBSTACLES } from './obstacles/_index';
import type { ObstacleBlueprint } from './obstacle-blueprint';

export type ObstacleOptions = {
  id: EntityId;
  blueprintId: string;
  position: Point3D;
  playerId?: EntityId;
};

export class Obstacle extends Entity {
  position: Position;
  blueprintId: string;
  playerId?: EntityId;
  occupant: Nullable<Unit> = null;
  spriteId: string;
  meta: AnyObject = {};
  isAttackable: boolean;
  constructor(
    private game: Game,
    options: ObstacleOptions
  ) {
    super(options.id);
    this.blueprintId = options.blueprintId;
    this.spriteId = this.blueprint.spriteId;
    this.position = Position.fromPoint3D(options.position);
    this.playerId = options.playerId;
    this.isAttackable = this.blueprint.attackable;
    this.checkOccupation = this.checkOccupation.bind(this);
    this.game.on(GAME_EVENTS.UNIT_CREATED, this.checkOccupation);
    this.game.on(GAME_EVENTS.UNIT_AFTER_DESTROY, this.checkOccupation);
    this.game.on(GAME_EVENTS.UNIT_AFTER_MOVE, this.checkOccupation);

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
    this.game.off(GAME_EVENTS.UNIT_CREATED, this.checkOccupation);
    this.game.off(GAME_EVENTS.UNIT_AFTER_DESTROY, this.checkOccupation);
    this.game.off(GAME_EVENTS.UNIT_AFTER_MOVE, this.checkOccupation);
  }

  attack(unit: Unit) {
    assert(this.isAttackable, 'obstacle canno be attack');

    this.blueprint.onAttacked?.(this.game, this, unit);
  }
}
