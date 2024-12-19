import { Vec3, type Point3D } from '@game/shared';
import { createEntityId, Entity, type EntityId } from '../entity';
import { Card } from '../card/card.entity';
import { type Game } from '../game/game';
import { SolidBodyPathfindingStrategy } from '../pathfinding/strategies/solid-pathfinding.strategy';
import { Interceptable, type inferInterceptor } from '../utils/interceptable';
import { ActionPointComponent } from './components/action-point.component';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { HEALTH_EVENTS, HealthComponent } from './components/health.component';
import { MOVE_EVENTS, MovementComponent } from './components/movement.component';
import type { Player } from '../player/player.entity';
import { PointAOEShape, type AOEShape } from '../targeting/aoe-shapes';
import { Damage } from '../combat/damage/damage';
import { config } from '../config';
import { UnitModifierManager } from './components/modifier-manager.component';
import type { UnitModifier } from './unit-modifier.entity';
import type { TargetingStrategy } from '../targeting/targeting-strategy';
import type { UnitCard } from '../card/unit-card.entity';
import type { CardManagerComponent } from '../card/card-manager.component';
import { CARD_KINDS } from '../card/card-enums';
import type { GeneralCard } from '../card/general-card.entity';
import { UNIT_EVENTS } from './unit-enums';
import { COMBAT_EVENTS, CombatComponent } from '../combat/combat.component';
import { PathfinderComponent } from '../pathfinding/pathfinder.component';

export type UnitOptions = {
  id: string;
  position: Point3D;
  player: Player;
};

export type UnitEventMap = {
  [UNIT_EVENTS.CREATED]: [{ id: EntityId }];
  [UNIT_EVENTS.START_TURN]: [{ id: EntityId }];
  [UNIT_EVENTS.END_TURN]: [{ id: EntityId }];
  [UNIT_EVENTS.BEFORE_MOVE]: [{ position: Vec3; destination: Vec3; cost: number }];
  [UNIT_EVENTS.AFTER_MOVE]: [{ position: Vec3; previousPosition: Vec3; cost: number }];
  [UNIT_EVENTS.BEFORE_ATTACK]: [{ target: Point3D; cost: number }];
  [UNIT_EVENTS.AFTER_ATTACK]: [{ target: Point3D; cost: number }];
  [UNIT_EVENTS.BEFORE_COUNTERATTACK]: [{ target: Point3D }];
  [UNIT_EVENTS.AFTER_COUNTERATTACK]: [{ target: Point3D }];
  [UNIT_EVENTS.BEFORE_DEAL_DAMAGE]: [{ targets: Unit[]; damage: Damage }];
  [UNIT_EVENTS.AFTER_DEAL_DAMAGE]: [{ targets: Unit[]; damage: Damage }];
  [UNIT_EVENTS.BEFORE_RECEIVE_DAMAGE]: [{ from: Card; damage: Damage }];
  [UNIT_EVENTS.AFTER_RECEIVE_DAMAGE]: [{ from: Card; damage: Damage }];
  [UNIT_EVENTS.BEFORE_RECEIVE_HEAL]: [{ from: Unit; amount: number }];
  [UNIT_EVENTS.AFTER_RECEIVE_HEAL]: [{ from: Unit; amount: number }];
  [UNIT_EVENTS.BEFORE_PLAY_CARD]: [{ card: Card }];
  [UNIT_EVENTS.AFTER_PLAY_CARD]: [{ card: Card }];
  [UNIT_EVENTS.BEFORE_DESTROY]: [{ source: Card }];
  [UNIT_EVENTS.AFTER_DESTROY]: [{ source: Card }];
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

  private readonly combat: CombatComponent;

  private interceptors = {
    canMove: new Interceptable<boolean>(),
    canAttack: new Interceptable<boolean>(),
    canBeAttackTarget: new Interceptable<boolean>(),
    canBeCardTarget: new Interceptable<boolean>(),
    canPlayCardFromHand: new Interceptable<boolean>(),

    speed: new Interceptable<number>(),
    attack: new Interceptable<number>(),
    attackTargetingPattern: new Interceptable<TargetingStrategy>(),
    attackAOEShape: new Interceptable<AOEShape>(),

    apCostPerAttack: new Interceptable<number>(),
    apCostPerMovement: new Interceptable<number>(),
    maxCounterattacksPerTurn: new Interceptable<number>(),

    damageDealt: new Interceptable<number, { attacker: Unit; defender: Unit }>(),
    damageReceived: new Interceptable<number, { attacker: Unit; defender: Unit }>()
  };

  readonly card: UnitCard | GeneralCard;

  constructor(game: Game, card: UnitCard | GeneralCard, options: UnitOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.card = card;
    this.player = options.player;
    this.modifierManager = new UnitModifierManager(this);
    this.ap = new ActionPointComponent({ maxAp: config.UNIT_BASE_AP });
    this.hp = new HealthComponent({ maxHp: this.card.maxHp });
    this.hp.on(HEALTH_EVENTS.CHANGE, this.checkHp.bind(this));
    this.movement = new MovementComponent({
      position: options.position,
      pathfinding: new PathfinderComponent(
        this.game,
        new SolidBodyPathfindingStrategy(this.game)
      )
    });
    this.combat = new CombatComponent(this.game, this);
    this.game.on('turn.turn_start', this.onGameTurnStart.bind(this));
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

  get isGeneral() {
    return this.card.kind === CARD_KINDS.GENERAL;
  }

  get isUnit() {
    return this.card.kind === CARD_KINDS.UNIT;
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

  get apCostPerMovement() {
    return this.interceptors.apCostPerMovement.getValue(
      this.game.config.AP_COST_PER_MOVEMENT,
      {}
    );
  }

  get apCostPerAttack() {
    return this.interceptors.apCostPerAttack.getValue(
      this.game.config.AP_COST_PER_ATTACK,
      {}
    );
  }

  get maxCounterattacksPerTurn() {
    return this.interceptors.maxCounterattacksPerTurn.getValue(
      this.game.config.MAX_COUNTERATTACKS_PER_TURN,
      {}
    );
  }

  get attackTargettingPattern() {
    return this.interceptors.attackTargetingPattern.getValue(this.card.attackPattern, {});
  }

  get attackAOEShape(): AOEShape {
    return this.interceptors.attackAOEShape.getValue(new PointAOEShape(this.game), {});
  }

  get canMove(): boolean {
    return this.interceptors.canMove.getValue(
      this.ap.current >= this.apCostPerMovement,
      {}
    );
  }

  get canAttack(): boolean {
    return this.interceptors.canAttack.getValue(
      this.ap.current >= this.combat.nextAttackApCost,
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

  private checkHp({ source }: { source: Card }) {
    if (this.hp.current <= 0) {
      this.game.inputSystem.schedule(() => {
        this.destroy(source);
      });
    }
  }

  private forwardEvents() {
    this.movement.on(MOVE_EVENTS.BEFORE_MOVE, e => {
      this.emitter.emit(UNIT_EVENTS.BEFORE_MOVE, {
        ...e,
        cost: this.apCostPerMovement
      });
    });
    this.movement.on(MOVE_EVENTS.AFTER_MOVE, e => {
      this.emitter.emit(UNIT_EVENTS.AFTER_MOVE, {
        ...e,
        cost: this.apCostPerMovement
      });
    });
    this.combat.on(COMBAT_EVENTS.BEFORE_ATTACK, e =>
      this.emitter.emit(UNIT_EVENTS.BEFORE_ATTACK, e)
    );
    this.combat.on(COMBAT_EVENTS.AFTER_ATTACK, e =>
      this.emitter.emit(UNIT_EVENTS.AFTER_ATTACK, e)
    );
    this.combat.on(COMBAT_EVENTS.BEFORE_COUNTERATTACK, e =>
      this.emitter.emit(UNIT_EVENTS.BEFORE_COUNTERATTACK, e)
    );
    this.combat.on(COMBAT_EVENTS.AFTER_COUNTERATTACK, e =>
      this.emitter.emit(UNIT_EVENTS.AFTER_COUNTERATTACK, e)
    );
    this.combat.on(COMBAT_EVENTS.BEFORE_DEAL_DAMAGE, e =>
      this.emitter.emit(UNIT_EVENTS.BEFORE_DEAL_DAMAGE, e)
    );
    this.combat.on(COMBAT_EVENTS.AFTER_DEAL_DAMAGE, e =>
      this.emitter.emit(UNIT_EVENTS.AFTER_DEAL_DAMAGE, e)
    );
    this.combat.on(COMBAT_EVENTS.BEFORE_RECEIVE_DAMAGE, e =>
      this.emitter.emit(UNIT_EVENTS.BEFORE_RECEIVE_DAMAGE, e)
    );
    this.combat.on(COMBAT_EVENTS.AFTER_RECEIVE_DAMAGE, e =>
      this.emitter.emit(UNIT_EVENTS.AFTER_RECEIVE_DAMAGE, e)
    );
  }

  onAddedToBoard() {
    this.emitter.emit(UNIT_EVENTS.CREATED, { id: this.id });
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

    return this.movement.canMoveTo(point, this.ap.current / this.apCostPerMovement);
  }

  canSpendAp(amount: number) {
    return this.ap.current >= amount;
  }

  move(to: Point3D) {
    const path = this.movement.move(to);
    if (!path) return;

    this.ap.remove(path.distance * this.apCostPerMovement);
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

  get dealDamage() {
    return this.combat.dealDamage.bind(this.combat);
  }

  get takeDamage() {
    return this.combat.takeDamage.bind(this.combat);
  }

  attack(point: Point3D) {
    this.ap.remove(this.combat.nextAttackApCost);
    this.combat.attack(point);
  }

  counterAttack(unit: Unit) {
    this.combat.counterAttack(unit);
  }

  canAttackAt(point: Point3D) {
    if (!this.canAttack) return;

    if (this.position.equals(point)) return false;
    const target = this.game.unitSystem.getUnitAt(point);
    if (target && !target.canBeAttacked) return false;

    return this.attackTargettingPattern.canTargetAt(point);
  }

  canAttackFromSimulatedPosition(point: Point3D, position: Point3D) {
    const copy = this.position.clone();
    this.movement.position.x = position.x;
    this.movement.position.y = position.y;
    this.movement.position.z = position.z;
    const canAttack = this.attackTargettingPattern.isWithinRange(point);
    this.movement.position = copy;
    return canAttack;
  }

  canCounterAttackAt(point: Point3D) {
    return this.combat.canCounterAttackAt(point);
  }

  destroy(source: Card) {
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
    this.combat.resetAttackCount();
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
