import { Vec3, type Point3D } from '@game/shared';
import { createEntityId, Entity, type EntityId } from '../entity';
import { Card } from '../card/card.entity';
import { type Game } from '../game/game';
import { SolidBodyPathfindingStrategy } from '../pathfinding/strategies/solid-pathfinding.strategy';
import { Interceptable, type inferInterceptor } from '../utils/interceptable';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { HEALTH_EVENTS, HealthComponent } from './components/health.component';
import { MOVE_EVENTS, MovementComponent } from './components/movement.component';
import type { Player } from '../player/player.entity';
import { PointAOEShape, type AOEShape } from '../targeting/aoe-shapes';
import { Damage } from '../combat/damage/damage';
import { UnitModifierManager } from './components/modifier-manager.component';
import type { UnitModifier } from './unit-modifier.entity';
import type { TargetingStrategy } from '../targeting/targeting-strategy';
import type { UnitCard } from '../card/unit-card.entity';
import { CARD_KINDS, UNIT_TYPES } from '../card/card-enums';
import { UNIT_EVENTS } from './unit-enums';
import { COMBAT_EVENTS, CombatComponent } from '../combat/combat.component';
import { PathfinderComponent } from '../pathfinding/pathfinder.component';
import type { Obstacle } from '../obstacle/obstacle.entity';
import { KeywordManagerComponent } from './components/keyword-manager.component';
import { PLAYER_EVENTS } from '../player/player-enums';

export type UnitOptions = {
  id: string;
  position: Point3D;
  player: Player;
};

export type UnitEventMap = {
  [UNIT_EVENTS.CREATED]: [{ id: EntityId }];
  [UNIT_EVENTS.BEFORE_MOVE]: [{ position: Vec3; destination: Vec3 }];
  [UNIT_EVENTS.AFTER_MOVE]: [{ position: Vec3; previousPosition: Vec3 }];
  [UNIT_EVENTS.BEFORE_ATTACK]: [{ target: Point3D }];
  [UNIT_EVENTS.AFTER_ATTACK]: [{ target: Point3D }];
  [UNIT_EVENTS.BEFORE_COUNTERATTACK]: [{ target: Point3D }];
  [UNIT_EVENTS.AFTER_COUNTERATTACK]: [{ target: Point3D }];
  [UNIT_EVENTS.BEFORE_DEAL_DAMAGE]: [{ targets: Unit[]; damage: Damage }];
  [UNIT_EVENTS.AFTER_DEAL_DAMAGE]: [{ targets: Unit[]; damage: Damage }];
  [UNIT_EVENTS.BEFORE_RECEIVE_DAMAGE]: [{ from: Card; damage: Damage }];
  [UNIT_EVENTS.AFTER_RECEIVE_DAMAGE]: [{ from: Card; damage: Damage }];
  [UNIT_EVENTS.BEFORE_RECEIVE_HEAL]: [{ from: Unit; amount: number }];
  [UNIT_EVENTS.AFTER_RECEIVE_HEAL]: [{ from: Unit; amount: number }];
  [UNIT_EVENTS.BEFORE_DESTROY]: [{ source: Card }];
  [UNIT_EVENTS.AFTER_DESTROY]: [{ source: Card }];
};

export type UnitInterceptor = Unit['interceptors'];

export class Unit extends Entity {
  private game: Game;

  readonly player: Player;

  readonly card: UnitCard;

  private emitter = new TypedEventEmitter<UnitEventMap>();

  private modifierManager: UnitModifierManager;

  readonly hp: HealthComponent;

  readonly movement: MovementComponent;

  readonly keywordManager: KeywordManagerComponent;

  private readonly combat: CombatComponent;

  private interceptors = {
    canMove: new Interceptable<boolean>(),
    canMoveAfterAttacking: new Interceptable<boolean>(),
    canAttack: new Interceptable<boolean>(),
    canCounterAttack: new Interceptable<boolean>(),
    canBeAttackTarget: new Interceptable<boolean>(),
    canBeCardTarget: new Interceptable<boolean>(),
    canBeDestroyed: new Interceptable<boolean>(),
    canSummonUnitsNearby: new Interceptable<boolean>(),
    canCastSpells: new Interceptable<boolean>(),

    shouldDeactivateWhenSummoned: new Interceptable<boolean>(),

    attack: new Interceptable<number>(),
    attackTargetingPattern: new Interceptable<TargetingStrategy>(),
    attackAOEShape: new Interceptable<AOEShape>(),

    maxAttacksPerTurn: new Interceptable<number>(),
    maxMovementsPerTurn: new Interceptable<number>(),
    maxCounterattacksPerTurn: new Interceptable<number>(),

    damageDealt: new Interceptable<number, { attacker: Unit; defender?: Unit }>(),
    damageReceived: new Interceptable<number, { attacker: Unit; defender: Unit }>()
  };

  constructor(game: Game, card: UnitCard, options: UnitOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.card = card;
    this.player = options.player;
    this.modifierManager = new UnitModifierManager(this);
    this.hp = new HealthComponent({ maxHp: this.card.maxHp });
    this.hp.on(HEALTH_EVENTS.CHANGE, this.checkHp.bind(this));
    this.keywordManager = new KeywordManagerComponent();
    this.movement = new MovementComponent({
      position: options.position,
      pathfinding: new PathfinderComponent(
        this.game,
        new SolidBodyPathfindingStrategy(this.game)
      )
    });
    this.combat = new CombatComponent(this.game, this);
    this.onTurnStart = this.onTurnStart.bind(this);
    this.player.on(PLAYER_EVENTS.START_TURN, this.onTurnStart);
    this.forwardEvents();
    if (this.isGeneral) {
      this.handleGeneralRewards();
    }
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

  get keywords() {
    return this.keywordManager.keywords;
  }

  get addKeyword() {
    return this.keywordManager.add.bind(this.keywordManager);
  }

  get removeKeyword() {
    return this.keywordManager.remove.bind(this.keywordManager);
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

  get isGeneral() {
    return this.card.unitType === UNIT_TYPES.GENERAL;
  }

  get canSummonUnitsNearby(): boolean {
    return this.interceptors.canSummonUnitsNearby.getValue(this.isGeneral, {});
  }

  get canCastSpells(): boolean {
    return this.interceptors.canCastSpells.getValue(this.isGeneral, {});
  }

  get canBeAttacked(): boolean {
    return this.interceptors.canBeAttackTarget.getValue(
      this.isGeneral ? !this.isDead : true,
      {}
    );
  }

  get canBeCardTarget(): boolean {
    return this.interceptors.canBeCardTarget.getValue(
      this.isGeneral ? !this.isDead : true,
      {}
    );
  }

  get shouldDeactivateWhenSummoned(): boolean {
    return this.interceptors.shouldDeactivateWhenSummoned.getValue(!this.isGeneral, {});
  }

  get enemiesInRange() {
    return this.player.enemyUnits.filter(unit =>
      this.attackTargettingPattern.canTargetAt(unit.position)
    );
  }

  get isExhausted() {
    if (this.player.isActive) {
      return (
        this.attacksPerformedThisTurn === this.maxAttacksPerTurn ||
        (this.movementsMadeThisTurn === this.maxMovementsPerTurn &&
          !this.enemiesInRange.length)
      );
    } else {
      return this.counterAttacksPerformedThisTurn === this.maxCounterattacksPerTurn;
    }
  }

  get isDead() {
    return this.hp.isDead;
  }

  get atk() {
    return this.interceptors.attack.getValue(this.card.atk, {});
  }

  get maxMovementsPerTurn() {
    return this.interceptors.maxMovementsPerTurn.getValue(
      this.game.config.MAX_MOVEMENT_PER_TURN,
      {}
    );
  }

  get maxAttacksPerTurn() {
    return this.interceptors.maxAttacksPerTurn.getValue(
      this.game.config.MAX_ATTACKS_PER_TURN,
      {}
    );
  }

  get maxCounterattacksPerTurn() {
    return this.interceptors.maxCounterattacksPerTurn.getValue(
      this.game.config.MAX_COUNTERATTACKS_PER_TURN,
      {}
    );
  }

  get attackTargettingPattern(): TargetingStrategy {
    return this.interceptors.attackTargetingPattern.getValue(this.card.attackPattern, {});
  }

  get attackAOEShape(): AOEShape {
    return this.interceptors.attackAOEShape.getValue(new PointAOEShape(this.game), {});
  }

  get attacksPerformedThisTurn() {
    return this.combat.attacksCount;
  }

  get counterAttacksPerformedThisTurn() {
    return this.combat.counterAttacksCount;
  }

  get movementsMadeThisTurn() {
    return this.movement.movementsCount;
  }

  get canMoveAfterAttacking() {
    return this.interceptors.canMoveAfterAttacking.getValue(false, {});
  }

  get canMove(): boolean {
    return this.interceptors.canMove.getValue(
      this.movementsMadeThisTurn < this.maxMovementsPerTurn &&
        (this.attacksPerformedThisTurn > 0 ? this.canMoveAfterAttacking : true),
      {}
    );
  }

  get canBeDestroyed(): boolean {
    return this.interceptors.canBeDestroyed.getValue(!this.isGeneral, {});
  }

  get canAttack(): boolean {
    const base = this.attacksPerformedThisTurn < this.maxAttacksPerTurn;
    return this.interceptors.canAttack.getValue(
      this.isGeneral ? base && !this.isDead : base,
      {}
    );
  }

  get canCounterAttack(): boolean {
    return this.interceptors.canCounterAttack.getValue(
      this.combat.counterAttacksCount < this.maxCounterattacksPerTurn,
      {}
    );
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
      this.emitter.emit(UNIT_EVENTS.BEFORE_MOVE, e);
    });
    this.movement.on(MOVE_EVENTS.AFTER_MOVE, e => {
      this.emitter.emit(UNIT_EVENTS.AFTER_MOVE, e);
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

  get remainingMovement() {
    return this.maxMovementsPerTurn - this.movementsMadeThisTurn;
  }

  addToBoard() {
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

    return this.movement.canMoveTo(point, this.remainingMovement);
  }

  get move() {
    return this.movement.move.bind(this.movement);
  }

  teleport(to: Point3D) {
    this.movement.position.x = to.x;
    this.movement.position.y = to.y;
    this.movement.position.z = to.z;
  }

  get getPathTo() {
    return this.movement.getPathTo.bind(this.movement);
  }

  getPossibleMoves() {
    if (!this.canMove) return [];
    return this.movement.getAllPossibleMoves(this.remainingMovement);
  }

  getDealtDamage(baseAmount: number, target?: Unit) {
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
    const cell = this.game.boardSystem.getCellAt(point)!;
    if (cell.obstacle?.isAttackable) {
      return this.attackObstacle(cell.obstacle);
    }

    this.attackUnit(point);
  }

  private attackObstacle(obstacle: Obstacle) {
    this.emitter.emit(UNIT_EVENTS.BEFORE_ATTACK, {
      target: obstacle.position
    });
    obstacle.attack(this);
    this.emitter.emit(UNIT_EVENTS.AFTER_ATTACK, {
      target: obstacle.position
    });
  }

  private attackUnit(point: Point3D) {
    this.combat.attack(point);
  }

  counterAttack(unit: Unit) {
    this.combat.counterAttack(unit);
  }

  canAttackAt(point: Point3D) {
    if (!this.canAttack) {
      return false;
    }
    if (this.position.equals(point)) {
      return false;
    }

    const cell = this.game.boardSystem.getCellAt(point)!;

    if (cell.obstacle?.isAttackable && cell.obstacle.player?.isEnemy(this.player)) {
      return true;
    }

    const target = cell.unit;
    if (target && !target.canBeAttacked) {
      return false;
    }

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
    return this.canCounterAttack && this.attackTargettingPattern.canTargetAt(point);
  }

  destroy(source: Card) {
    if (!this.canBeDestroyed) return;

    this.emitter.emit(UNIT_EVENTS.BEFORE_DESTROY, { source });
    for (const modifier of this.modifiers) {
      this.removeModifier(modifier.id);
    }
    this.game.unitSystem.removeUnit(this);
    this.emitter.emit(UNIT_EVENTS.AFTER_DESTROY, { source });
  }

  activate() {
    this.combat.resetAttackCount();
    this.movement.resetMovementsCount();
  }

  deactivate() {
    this.combat.setAttackCount(this.maxAttacksPerTurn);
    this.movement.setMovementCount(this.maxMovementsPerTurn);
  }

  onTurnStart() {
    this.activate();
  }

  get removeModifier() {
    return this.modifierManager.remove.bind(this.modifierManager);
  }

  get hasModifier() {
    return this.modifierManager.has.bind(this.modifierManager);
  }

  get getModifier() {
    return this.modifierManager.get.bind(this.modifierManager);
  }

  get modifiers() {
    return this.modifierManager.modifiers;
  }

  addModifier(modifier: UnitModifier) {
    this.modifierManager.add(modifier);

    return () => this.removeModifier(modifier.id);
  }

  private handleGeneralRewards() {
    const unsub = this.hp.on('CHANGE', () => {
      if (this.hp.current === 0) {
        this.player.triggerGeneralReward();
        unsub();
      }
    });
  }
}
