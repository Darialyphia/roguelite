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
import { CombatComponent, type Damage } from '../combat/combat.component';
import { MOVE_EVENTS, MovementComponent } from './movement.component';
import { DECK_EVENTS } from '../card/deck.entity';
import type { Player } from '../player/player.entity';
import { MeleeTargetingPatternStrategy } from '../targeting/melee-targeting.straegy';
import { PointAOEShape } from '../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../targeting/targeting-strategy';

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
  player: Player;
};

export const UNIT_EVENTS = {
  START_TURN: 'start_turn',
  END_TURN: 'end_turn',
  BEFORE_MOVE: 'before_move',
  AFTER_MOVE: 'after_move',
  BEFORE_DRAW: 'before_draw',
  AFTER_DRAW: 'after_draw',
  BEFORE_ATTACK: 'before_attack',
  AFTER_ATTACK: 'after_attack',
  BEFORE_DEAL_DAMAGE: 'before_deal_damage',
  AFTER_DEAL_DAMAGE: 'after_deal_damage',
  BEFORE_RECEIVE_DAMAGE: 'before_receive_damage',
  AFTER_RECEIVE_DAMAGE: 'after_receive_damage',
  BEFORE_PLAY_CARD: 'before_play_card',
  AFTER_PLAY_CARD: 'after_play_card'
} as const;

export type UnitEvent = Values<typeof UNIT_EVENTS>;

export type UnitEventMap = {
  [UNIT_EVENTS.START_TURN]: [];
  [UNIT_EVENTS.END_TURN]: [];
  [UNIT_EVENTS.BEFORE_MOVE]: [{ position: Vec3; destination: Vec3 }];
  [UNIT_EVENTS.AFTER_MOVE]: [{ position: Vec3; previousPosition: Vec3 }];
  [UNIT_EVENTS.BEFORE_DRAW]: [];
  [UNIT_EVENTS.AFTER_DRAW]: [{ cards: Card[] }];
  [UNIT_EVENTS.BEFORE_ATTACK]: [{ target: Point3D }];
  [UNIT_EVENTS.AFTER_ATTACK]: [{ target: Point3D }];
  [UNIT_EVENTS.BEFORE_DEAL_DAMAGE]: [{ targets: Unit[]; damage: Damage }];
  [UNIT_EVENTS.AFTER_DEAL_DAMAGE]: [{ targets: Unit[]; damage: Damage }];
  [UNIT_EVENTS.BEFORE_RECEIVE_DAMAGE]: [{ from: Unit; damage: Damage; amount: number }];
  [UNIT_EVENTS.AFTER_RECEIVE_DAMAGE]: [{ from: Unit; damage: Damage; amount: number }];
  [UNIT_EVENTS.BEFORE_PLAY_CARD]: [{ card: Card }];
  [UNIT_EVENTS.AFTER_PLAY_CARD]: [{ card: Card }];
};

export class Unit extends Entity implements Serializable<SerializedUnit> {
  private game: Game;

  readonly player: Player;

  private emitter = new TypedEventEmitter<UnitEventMap>();

  private cardManager: CardManagerComponent;

  private blueprint: UnitBlueprint;

  readonly ap: ActionPointComponent;

  readonly hp: HealthComponent;

  readonly movement: MovementComponent;

  readonly combat: CombatComponent;

  private interceptors = {
    canMove: new Interceptable<boolean>(),
    canAttack: new Interceptable<boolean>(),
    canPlayCardFromHand: new Interceptable<boolean>(),
    speed: new Interceptable<number>()
  };

  constructor(game: Game, options: UnitOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.player = options.player;
    this.blueprint = options.blueprint;
    this.cardManager = new CardManagerComponent(this.game, { deck: options.deck });
    this.ap = new ActionPointComponent({ maxAp: this.blueprint.maxAp });
    this.hp = new HealthComponent({ maxHp: this.blueprint.maxHp });
    this.combat = new CombatComponent(this.game, {
      baseStats: this.blueprint,
      unit: this,
      attackPattern: new MeleeTargetingPatternStrategy(
        this.game,
        this,
        TARGETING_TYPE.BOTH
      ),
      aoeShape: new PointAOEShape(this.game)
    });
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
    return this.interceptors.speed.getValue(this.blueprint.speed, {});
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

  get canMove(): boolean {
    return this.interceptors.canMove.getValue(true, {});
  }

  get canAttack(): boolean {
    return this.interceptors.canAttack.getValue(true, {});
  }

  get canPlayCardFromHand(): boolean {
    return this.interceptors.canPlayCardFromHand.getValue(true, {});
  }

  get isAt() {
    return this.movement.isAt;
  }

  get getCardAt() {
    return this.cardManager.getCardAt;
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

  isEnemy(unit: Unit) {
    return unit.player.isEnemy(unit.player);
  }

  isAlly(unit: Unit) {
    return !unit.player.isEnemy(unit.player);
  }

  canMoveTo(point: Point3D) {
    if (!this.canMove) return false;

    return this.movement.canMoveTo(point, this.ap.current);
  }

  move(to: Point3D) {
    const path = this.movement.move(to);
    if (!path) return;

    this.ap.remove(path.distance * this.game.config.AP_COST_PER_MOVEMENT);
  }

  dealDamage(targets: Unit[], damage: Damage) {
    this.emitter.emit(UNIT_EVENTS.BEFORE_DEAL_DAMAGE, { targets, damage });
    targets.forEach(target => {
      const amount = this.combat.getDamageDealt(damage);
      target.takeDamage(this, damage, amount);
    });
    this.emitter.emit(UNIT_EVENTS.AFTER_DEAL_DAMAGE, { targets, damage });
  }

  takeDamage(from: Unit, damage: Damage, amount: number) {
    const mitigatedAmount = this.combat.getDamageTaken(damage, amount, from);
    this.emitter.emit(UNIT_EVENTS.BEFORE_RECEIVE_DAMAGE, {
      from,
      damage,
      amount: mitigatedAmount
    });
    this.hp.remove(amount);
    this.emitter.emit(UNIT_EVENTS.AFTER_RECEIVE_DAMAGE, {
      from,
      damage,
      amount: mitigatedAmount
    });
  }

  canAttackAt(point: Point3D) {
    if (!this.canAttack) return;

    return this.combat.canAttackAt(point);
  }

  attack(target: Point3D) {
    this.emitter.emit(UNIT_EVENTS.BEFORE_ATTACK, { target });
    this.ap.remove(this.game.config.AP_COST_PER_ATTACK);
    this.combat.attackAt(target);
    this.emitter.emit(UNIT_EVENTS.AFTER_ATTACK, { target });
  }

  canPlayCardAt(index: number) {
    const card = this.getCardAt(index);

    return card.cost <= this.ap.current;
  }

  playCard(index: number, targets: Point3D[]) {
    const card = this.cardManager.getCardAt(index);
    if (!card) return;
    this.emitter.emit(UNIT_EVENTS.BEFORE_PLAY_CARD, { card });
    this.ap.remove(card.cost);
    card.play(targets);
    this.emitter.emit(UNIT_EVENTS.AFTER_PLAY_CARD, { card });
  }

  startTurn() {
    this.ap.refill();
    this.cardManager.draw(this.game.config.CARDS_DRAWN_PER_TURN);
    this.emitter.emit(UNIT_EVENTS.START_TURN);
  }

  endTurn() {
    this.emitter.emit(UNIT_EVENTS.END_TURN);
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
