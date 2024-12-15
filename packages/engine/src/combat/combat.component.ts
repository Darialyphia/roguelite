import type { Point3D, Values } from '@game/shared';
import { config } from '../config';
import type { Game } from '../game/game';
import type { Unit } from '../unit/unit.entity';
import { Damage } from './damage/damage';
import { CombatScalingStrategy } from './damage/scaling/combat-scaling.strategy';
import type { Card } from '../card/card.entity';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { CombatMitigationStrategy } from './damage/mitigation/combat-mitigation-strategy';
import { PointAOEShape } from '../targeting/aoe-shapes';

export const COMBAT_EVENTS = {
  BEFORE_ATTACK: 'before_attack',
  AFTER_ATTACK: 'after_attack',
  BEFORE_COUNTERATTACK: 'before_counterattack',
  AFTER_COUNTERATTACK: 'after_counterattack',
  BEFORE_DEAL_DAMAGE: 'before_deal_damage',
  AFTER_DEAL_DAMAGE: 'after_deal_damage',
  BEFORE_RECEIVE_DAMAGE: 'before_receive_damage',
  AFTER_RECEIVE_DAMAGE: 'after_receive_damage'
} as const;

export type CombatEvent = Values<typeof COMBAT_EVENTS>;

export type CombatEventMap = {
  [COMBAT_EVENTS.BEFORE_ATTACK]: [{ target: Point3D; cost: number }];
  [COMBAT_EVENTS.AFTER_ATTACK]: [{ target: Point3D; cost: number }];
  [COMBAT_EVENTS.BEFORE_COUNTERATTACK]: [{ target: Point3D; cost: number }];
  [COMBAT_EVENTS.AFTER_COUNTERATTACK]: [{ target: Point3D; cost: number }];
  [COMBAT_EVENTS.BEFORE_DEAL_DAMAGE]: [{ targets: Unit[]; damage: Damage }];
  [COMBAT_EVENTS.AFTER_DEAL_DAMAGE]: [{ targets: Unit[]; damage: Damage }];
  [COMBAT_EVENTS.BEFORE_RECEIVE_DAMAGE]: [{ from: Card; damage: Damage }];
  [COMBAT_EVENTS.AFTER_RECEIVE_DAMAGE]: [{ from: Card; damage: Damage }];
};

export class CombatComponent {
  private attacksCount = 0;
  private counterAttacksCount = 0;
  private emitter = new TypedEventEmitter<CombatEventMap>();

  constructor(
    private game: Game,
    private unit: Unit
  ) {}

  get nextAttackApCost() {
    return this.unit.apCostPerAttack + config.AP_INCREASE_PER_ATTACK * this.attacksCount;
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

  canCounterAttackAt(position: Point3D) {
    if (this.counterAttacksCount >= this.unit.maxCounterattacksPerTurn) return false;
    return this.unit.attackTargettingPattern.canTargetAt(position);
  }

  resetAttackCount() {
    this.attacksCount = 0;
  }

  resetCounterAttackCount() {
    this.counterAttacksCount = 0;
  }

  counterAttack(attacker: Unit) {
    this.emitter.emit(COMBAT_EVENTS.BEFORE_COUNTERATTACK, {
      target: attacker,
      cost: this.unit.apCostPerAttack
    });
    const targets = new PointAOEShape(this.game).getUnits([attacker]);

    const damage = new Damage({
      baseAmount: 0,
      source: this.unit.card,
      scalings: [new CombatScalingStrategy()],
      mitigations: [new CombatMitigationStrategy()]
    });

    this.dealDamage(targets, damage);
    this.counterAttacksCount++;

    this.emitter.emit(COMBAT_EVENTS.AFTER_COUNTERATTACK, {
      target: attacker,
      cost: this.unit.apCostPerAttack
    });
  }

  attack(target: Point3D) {
    this.emitter.emit(COMBAT_EVENTS.BEFORE_ATTACK, {
      target,
      cost: this.unit.apCostPerAttack
    });
    const targets = this.unit.attackAOEShape.getUnits([target]);

    const damage = new Damage({
      baseAmount: 0,
      source: this.unit.card,
      scalings: [new CombatScalingStrategy()],
      mitigations: [new CombatMitigationStrategy()]
    });

    this.dealDamage(targets, damage);
    this.attacksCount++;

    this.emitter.emit(COMBAT_EVENTS.AFTER_ATTACK, {
      target,
      cost: this.unit.apCostPerAttack
    });

    const unit = this.game.unitSystem.getUnitAt(target)!;
    if (!unit) return; // means unit dies from attack
    if (unit.canCounterAttackAt(this.unit.position)) {
      unit.counterAttack(this.unit);
    }
  }

  dealDamage(targets: Unit[], damage: Damage) {
    this.emitter.emit(COMBAT_EVENTS.BEFORE_DEAL_DAMAGE, { targets, damage });
    targets.forEach(target => {
      target.takeDamage(this.unit.card, damage);
    });
    this.emitter.emit(COMBAT_EVENTS.AFTER_DEAL_DAMAGE, { targets, damage });
  }

  takeDamage(from: Card, damage: Damage) {
    this.emitter.emit(COMBAT_EVENTS.BEFORE_RECEIVE_DAMAGE, {
      from,
      damage
    });
    this.unit.hp.remove(damage.getMitigatedAmount(this.unit));
    this.emitter.emit(COMBAT_EVENTS.AFTER_RECEIVE_DAMAGE, {
      from,
      damage
    });

    if (this.unit.hp.isDead) {
      this.unit.destroy(from);
    }
  }

  shutdown() {
    this.emitter.removeAllListeners();
  }
}
