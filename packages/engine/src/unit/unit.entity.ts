import { Vec3, type Point3D, type Serializable, type Values } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import { Card, type CardOptions } from '../card/card.entity';
import { Deck } from '../card/deck.entity';
import type { Game } from '../game';
import { PathfinderComponent } from '../pathfinding/pathfinder.component';
import { SolidPathfindingStrategy } from '../pathfinding/strategies/solid-pathfinding.strategy';
import type { UnitBlueprint } from './unit-blueprint';
import { Interceptable } from '../utils/interceptable';
import { ActionPointComponent } from './action-point.component';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { HealthComponent } from './health.component';

export type SerializedUnit = {
  id: string;
  position: Point3D;
  blueprint: UnitBlueprint;
  deckSize: number;
};

export type UnitOptions = {
  id: string;
  position: Point3D;
  deck: CardOptions[];
  blueprint: UnitBlueprint;
};

export const UNIT_EVENTS = {
  BEFORE_MOVE: 'before_move',
  AFTER_MOVE: 'after_move'
} as const;

export type UnitEvent = Values<typeof UNIT_EVENTS>;

export type UnitEventMap = {
  [UNIT_EVENTS.BEFORE_MOVE]: [{ entity: Entity; destination: Vec3 }];
  [UNIT_EVENTS.AFTER_MOVE]: [{ entity: Entity; previousPosition: Vec3 }];
};

export class Unit extends Entity implements Serializable<SerializedUnit> {
  private game: Game;

  private emitter = new TypedEventEmitter<UnitEventMap>();

  private position: Vec3;

  private deck: Deck;

  private blueprint: UnitBlueprint;

  private pathfinding: PathfinderComponent;

  readonly ap: ActionPointComponent;

  readonly hp: HealthComponent;

  private interceptors = {
    canMove: new Interceptable<boolean, Unit>(),

    attack: new Interceptable<number, Unit>(),
    defense: new Interceptable<number, Unit>(),
    speed: new Interceptable<number, Unit>()
  };

  constructor(game: Game, options: UnitOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.blueprint = options.blueprint;
    this.position = Vec3.fromPoint3D(options.position);
    this.deck = new Deck(
      this.game,
      options.deck.map(card => new Card(card))
    );
    this.pathfinding = new PathfinderComponent(
      this.game,
      new SolidPathfindingStrategy(this.game)
    );
    this.ap = new ActionPointComponent({ maxAp: this.blueprint.maxAp });
    this.hp = new HealthComponent({ maxHp: this.blueprint.maxHp });
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

  get on() {
    return this.emitter.on;
  }

  get once() {
    return this.emitter.once;
  }

  get off() {
    return this.emitter.off;
  }

  isAt(point: Point3D) {
    return this.position.equals(point);
  }

  get speed() {
    return this.interceptors.speed.getValue(this.blueprint.speed, this);
  }

  get canMove(): boolean {
    return this.interceptors.canMove.getValue(true, this);
  }

  canMoveTo(point: Point3D) {
    if (!this.canMove) return false;

    const path = this.pathfinding.getPathTo(this, point);
    if (!path) return false;

    return path.distance <= this.ap.current;
  }

  move(to: Point3D) {
    const path = this.pathfinding.getPathTo(this, to);
    if (!path) return;

    for (const point of path.path) {
      const currentPosition = this.position;
      this.emitter.emit(UNIT_EVENTS.BEFORE_MOVE, {
        entity: this,
        destination: Vec3.fromPoint3D(point)
      });
      this.position = Vec3.fromPoint3D(point);
      this.emitter.emit(UNIT_EVENTS.AFTER_MOVE, {
        entity: this,
        previousPosition: currentPosition
      });
    }
    this.ap.remove(path.distance * this.game.config.AP_SPENT_PER_MOVEMENT);
  }

  ready() {
    this.ap.refill();
  }

  serialize(): SerializedUnit {
    return {
      id: this.id,
      position: this.position.serialize(),
      blueprint: this.blueprint,
      deckSize: this.deck.size
    };
  }
}
