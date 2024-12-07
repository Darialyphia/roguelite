import { Vec3, type Point3D, type Values } from '@game/shared';
import { createEntityId, Entity, type EntityId } from '../entity';
import { Card, type CardOptions } from '../card/card.entity';
import { GAME_EVENTS, type Game } from '../game/game';
import { SolidBodyPathfindingStrategy } from '../pathfinding/strategies/solid-pathfinding.strategy';
import type { UnitBlueprint } from './unit-blueprint';
import { Interceptable, type inferInterceptor } from '../utils/interceptable';
import { ActionPointComponent } from './components/action-point.component';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { HealthComponent } from './components/health.component';
import { MOVE_EVENTS, MovementComponent } from './components/movement.component';
import type { Player } from '../player/player.entity';
import { PointAOEShape } from '../targeting/aoe-shapes';
import { Damage } from '../combat/damage/damage';
import { config } from '../config';
import { UnitModifierManager } from './components/modifier-manager.component';
import type { UnitModifier } from './unit-modifier.entity';
import type { TargetingStrategy } from '../targeting/targeting-strategy';
import type { UnitCard } from '../card/unit-card.entity';
import { NoMitigationStrategy } from '../combat/damage/mitigation/no-mitigation.strategy';
import { CombatScalingStrategy } from '../combat/damage/scaling/combat-scaling.strategy';
import type { CardManagerComponent } from '../card/card-manager.component';

export type UnitOptions = {
  id: string;
  position: Point3D;
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
  BEFORE_RECEIVE_HEAL: 'before_receive_heal',
  AFTER_RECEIVE_HEAL: 'after_receive_heal',
  BEFORE_PLAY_CARD: 'before_play_card',
  AFTER_PLAY_CARD: 'after_play_card',
  BEFORE_DESTROY: 'before_destroy',
  AFTER_DESTROY: 'after_destroy'
} as const;

export type UnitEvent = Values<typeof UNIT_EVENTS>;

export type UnitEventMap = {
  [UNIT_EVENTS.START_TURN]: [{ id: EntityId }];
  [UNIT_EVENTS.END_TURN]: [{ id: EntityId }];
  [UNIT_EVENTS.BEFORE_MOVE]: [{ position: Vec3; destination: Vec3; cost: number }];
  [UNIT_EVENTS.AFTER_MOVE]: [{ position: Vec3; previousPosition: Vec3; cost: number }];
  [UNIT_EVENTS.BEFORE_DRAW]: [];
  [UNIT_EVENTS.AFTER_DRAW]: [{ cards: Card[] }];
  [UNIT_EVENTS.BEFORE_ATTACK]: [{ target: Point3D; cost: number }];
  [UNIT_EVENTS.AFTER_ATTACK]: [{ target: Point3D; cost: number }];
  [UNIT_EVENTS.BEFORE_DEAL_DAMAGE]: [{ targets: Unit[]; damage: Damage }];
  [UNIT_EVENTS.AFTER_DEAL_DAMAGE]: [{ targets: Unit[]; damage: Damage }];
  [UNIT_EVENTS.BEFORE_RECEIVE_DAMAGE]: [{ from: Unit; damage: Damage }];
  [UNIT_EVENTS.AFTER_RECEIVE_DAMAGE]: [{ from: Unit; damage: Damage }];
  [UNIT_EVENTS.BEFORE_RECEIVE_HEAL]: [{ from: Unit; amount: number }];
  [UNIT_EVENTS.AFTER_RECEIVE_HEAL]: [{ from: Unit; amount: number }];
  [UNIT_EVENTS.BEFORE_PLAY_CARD]: [{ card: Card }];
  [UNIT_EVENTS.AFTER_PLAY_CARD]: [{ card: Card }];
  [UNIT_EVENTS.BEFORE_DESTROY]: [{ source: Unit }];
  [UNIT_EVENTS.AFTER_DESTROY]: [{ source: Unit }];
};

type UnitInterceptor = Unit['interceptors'];

export class Unit extends Entity {
  private game: Game;

  readonly player: Player;

  private emitter = new TypedEventEmitter<UnitEventMap>();

  private modifierManager: UnitModifierManager;

  readonly ap: ActionPointComponent;

  readonly hp: HealthComponent;

  readonly movement: MovementComponent;

  private attacksPerformedThisTurn = 0;

  private interceptors = {
    canMove: new Interceptable<boolean>(),
    canAttack: new Interceptable<boolean>(),
    canBeAttackTarget: new Interceptable<boolean>(),
    canBeCardTarget: new Interceptable<boolean>(),
    canPlayCardFromHand: new Interceptable<boolean>(),

    speed: new Interceptable<number>(),
    attack: new Interceptable<number>(),
    attackPattern: new Interceptable<TargetingStrategy>(),

    damageDealt: new Interceptable<number, { attacker: Unit; defender: Unit }>(),
    damageReceived: new Interceptable<number, { attacker: Unit; defender: Unit }>()
  };

  readonly card: UnitCard;

  constructor(game: Game, card: UnitCard, options: UnitOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.card = card;
    this.player = options.player;
    this.modifierManager = new UnitModifierManager(this);
    this.ap = new ActionPointComponent({ maxAp: config.UNIT_BASE_AP });
    this.hp = new HealthComponent({ maxHp: this.card.maxHp });
    this.movement = new MovementComponent(this.game, {
      position: options.position,
      pathfindingStrategy: new SolidBodyPathfindingStrategy(this.game)
    });

    this.game.on(GAME_EVENTS.TURN_START, this.onGameTurnStart.bind(this));
    this.forwardEvents();
  }

  get spriteId() {
    return this.card.spriteId;
  }

  get iconId() {
    return this.card.iconId;
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
    return this.emitter.on.bind(this.emitter);
  }

  get once() {
    return this.emitter.once.bind(this.emitter);
  }

  get off() {
    return this.emitter.off.bind(this.emitter);
  }

  get name() {
    return this.card.name;
  }

  get description() {
    return this.card.description;
  }

  get speed(): number {
    return this.interceptors.speed.getValue(this.card.speed, {});
  }

  get canBeAttacked(): boolean {
    return this.interceptors.canBeAttackTarget.getValue(true, {});
  }

  get canBeCardTarget(): boolean {
    return this.interceptors.canBeCardTarget.getValue(true, {});
  }

  get atk() {
    return this.interceptors.attack.getValue(this.card.atk, {});
  }

  get reward() {
    return this.card.reward;
  }

  get nextAttackApCost() {
    return (
      config.AP_COST_PER_ATTACK +
      config.AP_INCREASE_PER_ATTACK * this.attacksPerformedThisTurn
    );
  }

  get attackPattern() {
    return this.interceptors.attackPattern.getValue(this.card.attackPattern, {});
  }
  get canMove(): boolean {
    return this.interceptors.canMove.getValue(
      this.ap.current >= config.AP_COST_PER_MOVEMENT,
      {}
    );
  }

  get canAttack(): boolean {
    return this.interceptors.canAttack.getValue(
      this.ap.current >= this.nextAttackApCost,
      {}
    );
  }

  get canPlayCardFromHand(): boolean {
    return this.interceptors.canPlayCardFromHand.getValue(true, {});
  }

  get isAt() {
    return this.movement.isAt.bind(this.movement);
  }

  addInterceptor<T extends keyof UnitInterceptor>(
    key: T,
    interceptor: inferInterceptor<UnitInterceptor[T]>,
    priority?: number
  ) {
    this.interceptors[key].add(interceptor as any, priority);

    return () => this.removeInterceptor(key, interceptor);
  }

  removeInterceptor<T extends keyof UnitInterceptor>(
    key: T,
    interceptor: inferInterceptor<UnitInterceptor[T]>
  ) {
    this.interceptors[key].remove(interceptor as any);
  }

  get addApInterceptor() {
    return this.hp.addInterceptor.bind(this.ap);
  }

  get addHpInterceptor() {
    return this.hp.addInterceptor.bind(this.hp);
  }

  private forwardEvents() {
    this.movement.on(MOVE_EVENTS.BEFORE_MOVE, e => {
      this.emitter.emit(UNIT_EVENTS.BEFORE_MOVE, {
        ...e,
        cost: this.game.config.AP_COST_PER_MOVEMENT
      });
    });
    this.movement.on(MOVE_EVENTS.AFTER_MOVE, e => {
      this.emitter.emit(UNIT_EVENTS.AFTER_MOVE, {
        ...e,
        cost: this.game.config.AP_COST_PER_MOVEMENT
      });
    });
  }

  shutdown() {
    this.emitter.removeAllListeners();
    this.movement.shutdown();
  }

  isEnemy(unit: Unit) {
    return this.player.isEnemy(unit.player);
  }

  isAlly(unit: Unit) {
    return !this.player.isEnemy(unit.player);
  }

  canMoveTo(point: Point3D) {
    if (!this.canMove) return false;

    return this.movement.canMoveTo(
      point,
      this.ap.current / this.game.config.AP_COST_PER_MOVEMENT
    );
  }

  canSpendAp(amount: number) {
    return this.ap.current >= amount;
  }

  move(to: Point3D) {
    const path = this.movement.move(to);
    if (!path) return;

    this.ap.remove(path.distance * this.game.config.AP_COST_PER_MOVEMENT);
  }

  getPathTo(to: Point3D) {
    return this.movement.getPathTo(to);
  }

  getDealtDamage(baseAmount: number, target: Unit) {
    return this.interceptors.damageDealt.getValue(baseAmount + this.atk, {
      attacker: this,
      defender: target
    });
  }

  getReceivedDamage(baseAmount: number, from: Unit) {
    return this.interceptors.damageReceived.getValue(baseAmount, {
      attacker: from,
      defender: this
    });
  }

  dealDamage(targets: Unit[], damage: Damage) {
    this.emitter.emit(UNIT_EVENTS.BEFORE_DEAL_DAMAGE, { targets, damage });
    targets.forEach(target => {
      target.takeDamage(this, damage);
    });
    this.emitter.emit(UNIT_EVENTS.AFTER_DEAL_DAMAGE, { targets, damage });
  }

  takeDamage(from: Unit, damage: Damage) {
    this.emitter.emit(UNIT_EVENTS.BEFORE_RECEIVE_DAMAGE, {
      from,
      damage
    });
    this.hp.remove(damage.getMitigatedAmount(this));
    this.emitter.emit(UNIT_EVENTS.AFTER_RECEIVE_DAMAGE, {
      from,
      damage
    });

    if (this.hp.isDead) {
      this.destroy(from);
    }
  }

  canAttackAt(point: Point3D) {
    if (!this.canAttack) return;

    if (this.position.equals(point)) return false;
    const target = this.game.unitSystem.getUnitAt(point);
    if (target && !target.canBeAttacked) return false;

    return this.attackPattern.canTargetAt(point);
  }

  attack(target: Point3D) {
    this.emitter.emit(UNIT_EVENTS.BEFORE_ATTACK, {
      target,
      cost: this.game.config.AP_COST_PER_ATTACK
    });
    this.ap.remove(this.game.config.AP_COST_PER_ATTACK);
    const targets = new PointAOEShape(this.game, target).getUnits();

    const damage = new Damage({
      baseAmount: config.ATTACK_BASE_DAMAGE,
      source: this.card,
      scalings: [new CombatScalingStrategy()],
      mitigation: new NoMitigationStrategy()
    });

    this.dealDamage(targets, damage);
    this.emitter.emit(UNIT_EVENTS.AFTER_ATTACK, {
      target,
      cost: this.game.config.AP_COST_PER_ATTACK
    });
  }

  destroy(source: Unit) {
    this.emitter.emit(UNIT_EVENTS.BEFORE_DESTROY, { source });
    this.game.unitSystem.removeUnit(this);
    this.emitter.emit(UNIT_EVENTS.AFTER_DESTROY, { source });
  }

  playCard(card: Card, targets: Point3D[], manager: CardManagerComponent) {
    this.emitter.emit(UNIT_EVENTS.BEFORE_PLAY_CARD, { card });
    manager.play(card, targets);
    this.emitter.emit(UNIT_EVENTS.AFTER_PLAY_CARD, { card });
  }

  onGameTurnStart() {
    this.ap.refill();
    this.attacksPerformedThisTurn = 0;
  }

  startTurn() {
    this.emitter.emit(UNIT_EVENTS.START_TURN, { id: this.id });
  }

  endTurn() {
    this.emitter.emit(UNIT_EVENTS.END_TURN, { id: this.id });
  }

  get removeModifier() {
    return this.modifierManager.remove.bind(this.modifierManager);
  }

  get hasModifier() {
    return this.modifierManager.has.bind(this.modifierManager);
  }

  get getModifier() {
    return this.modifierManager.getById.bind(this.modifierManager);
  }

  get modifierInfos() {
    return this.modifierManager.modifierInfos;
  }

  addModifier(modifier: UnitModifier) {
    this.modifierManager.add(modifier);

    return () => this.removeModifier(modifier.id);
  }
}
