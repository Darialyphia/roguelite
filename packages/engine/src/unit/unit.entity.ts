import { Vec3, type Point3D, type Serializable, type Values } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import { Card, type CardOptions, type SerializedCard } from '../card/card.entity';
import type { Game } from '../game';
import { SolidBodyPathfindingStrategy } from '../pathfinding/strategies/solid-pathfinding.strategy';
import type { UnitBlueprint } from './unit-blueprint';
import { Interceptable } from '../utils/interceptable';
import { ActionPointComponent } from './action-point.component';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { HealthComponent } from './health.component';
import { CardManagerComponent } from '../card/card-manager.component';
import { CombatComponent, type Damage } from './combat.component';
import { MOVE_EVENTS, MovementComponent } from './movement.component';
import { DECK_EVENTS } from '../card/deck.entity';

export type SerializedUnit = {
  id: string;
  position: Point3D;
  blueprint: UnitBlueprint;
  deckSize: number;
  hand: SerializedCard[];
};

export type UnitOptions = {
  id: string;
  position: Point3D;
  deck: CardOptions[];
  blueprint: UnitBlueprint;
};

export const UNIT_EVENTS = {
  BEFORE_MOVE: 'before_move',
  AFTER_MOVE: 'after_move',
  BEFORE_DRAW: 'before_draw',
  AFTER_DRAW: 'after_draw',
  BEFORE_ATTACK: 'before_attack',
  AFTER_ATTACK: 'after_attack',
  BEFORE_DEAL_DAMAGE: 'before_deal_damage',
  AFTER_DEAL_DAMAGE: 'after_deal_damage',
  BEFORE_RECEIVE_DAMAGE: 'before_receive_damage',
  AFTER_RECEIVE_DAMAGE: 'after_receive_damage'
} as const;

export type UnitEvent = Values<typeof UNIT_EVENTS>;

export type UnitEventMap = {
  [UNIT_EVENTS.BEFORE_MOVE]: [{ position: Vec3; destination: Vec3 }];
  [UNIT_EVENTS.AFTER_MOVE]: [{ position: Vec3; previousPosition: Vec3 }];
  [UNIT_EVENTS.BEFORE_DRAW]: [];
  [UNIT_EVENTS.AFTER_DRAW]: [{ cards: Card[] }];
  [UNIT_EVENTS.BEFORE_ATTACK]: [{ target: Unit }];
  [UNIT_EVENTS.AFTER_ATTACK]: [{ target: Unit }];
  [UNIT_EVENTS.BEFORE_DEAL_DAMAGE]: [{ target: Unit; damage: Damage; amount: number }];
  [UNIT_EVENTS.AFTER_DEAL_DAMAGE]: [{ target: Unit; damage: Damage; amount: number }];
  [UNIT_EVENTS.BEFORE_RECEIVE_DAMAGE]: [{ from: Unit; damage: Damage; amount: number }];
  [UNIT_EVENTS.AFTER_RECEIVE_DAMAGE]: [{ from: Unit; damage: Damage; amount: number }];
};

export class Unit extends Entity implements Serializable<SerializedUnit> {
  private game: Game;

  private emitter = new TypedEventEmitter<UnitEventMap>();

  private cardManager: CardManagerComponent;

  private blueprint: UnitBlueprint;

  readonly ap: ActionPointComponent;

  readonly hp: HealthComponent;

  readonly movement: MovementComponent;

  readonly combat: CombatComponent;

  private interceptors = {
    speed: new Interceptable<number, Unit>()
  };

  constructor(game: Game, options: UnitOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.blueprint = options.blueprint;
    this.cardManager = new CardManagerComponent(this.game, { deck: options.deck });
    this.ap = new ActionPointComponent({ maxAp: this.blueprint.maxAp });
    this.hp = new HealthComponent({ maxHp: this.blueprint.maxHp });
    this.combat = new CombatComponent(this.game, { baseStats: this.blueprint });
    this.movement = new MovementComponent(this.game, {
      position: options.position,
      pathfindingStrategy: new SolidBodyPathfindingStrategy(this.game)
    });

    this.forwardEvents();
  }

  get position() {
    return this.movement.position;
  }

  get x() {
    return this.movement.x;
  }

  get y() {
    return this.movement.y;
  }

  get z() {
    return this.movement.z;
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

  get speed(): number {
    return this.interceptors.speed.getValue(this.blueprint.speed, this);
  }

  get pAtk() {
    return this.combat.pAtk;
  }

  get mAtk() {
    return this.combat.mAtk;
  }

  get pDef() {
    return this.combat.pDef;
  }

  get mDef() {
    return this.combat.mDef;
  }

  get pDefPiercing() {
    return this.combat.pDefPiercing;
  }

  get mDefPiercing() {
    return this.combat.mDefPiercing;
  }

  private forwardEvents() {
    this.movement.on(MOVE_EVENTS.BEFORE_MOVE, e => {
      this.emitter.emit(UNIT_EVENTS.BEFORE_MOVE, e);
    });
    this.movement.on(MOVE_EVENTS.AFTER_MOVE, e => {
      this.emitter.emit(UNIT_EVENTS.AFTER_MOVE, e);
    });
    this.cardManager.deck.on(DECK_EVENTS.BEFORE_DRAW, () => {
      this.emitter.emit(DECK_EVENTS.BEFORE_DRAW);
    });
    this.cardManager.deck.on(DECK_EVENTS.AFTER_DRAW, e => {
      this.emitter.emit(DECK_EVENTS.AFTER_DRAW, e);
    });
  }

  canMoveTo(point: Point3D) {
    return this.movement.canMoveTo(point, this.ap.current);
  }

  move(to: Point3D) {
    const path = this.movement.move(to);
    if (!path) return;

    this.ap.remove(path.distance * this.game.config.AP_SPENT_PER_MOVEMENT);
  }

  dealDamage(target: Unit, damage: Damage) {
    const amount = this.combat.getDamageDealt(damage, target);
    this.emitter.emit(UNIT_EVENTS.BEFORE_DEAL_DAMAGE, { target, damage, amount });
    target.receiveDamage(this, damage, amount);
    this.emitter.emit(UNIT_EVENTS.AFTER_DEAL_DAMAGE, { target, damage, amount });
  }

  receiveDamage(from: Unit, damage: Damage, amount: number) {
    this.emitter.emit(UNIT_EVENTS.BEFORE_RECEIVE_DAMAGE, { from, damage, amount });
    this.hp.remove(amount);
    this.emitter.emit(UNIT_EVENTS.AFTER_RECEIVE_DAMAGE, { from, damage, amount });
  }

  attack(target: Unit) {
    this.emitter.emit(UNIT_EVENTS.BEFORE_ATTACK, { target });

    this.dealDamage(target, { type: 'physical', amount: 0, ratio: 1 });

    this.emitter.emit(UNIT_EVENTS.AFTER_ATTACK, { target });
  }

  ready() {
    this.ap.refill();
  }

  serialize(): SerializedUnit {
    return {
      id: this.id,
      position: this.position.serialize(),
      blueprint: this.blueprint,
      deckSize: this.cardManager.remainingCardsInDeck,
      hand: [...this.cardManager.hand.values()].map(card => card.serialize())
    };
  }
}
