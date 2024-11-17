import { assert, type Values } from '@game/shared';
import { Entity, type EntityId } from '../entity';
import type { Game } from '../game/game';
import type { UnitModifierMixin } from './modifier-mixins/unit-modifier-mixin';
import type { Unit } from './unit.entity';
import { TypedEventEmitter } from '../utils/typed-emitter';

export type UnitModifierOptions = {
  mixins: [UnitModifierMixin, ...UnitModifierMixin[]];
} & (
  | {
      stackable: true;
      initialStacks: number;
    }
  | {
      stackable: false;
    }
);

export const UNIT_MODIFIER_EVENTS = {
  BEFORE_APPLIED: 'before_applied',
  AFTER_APPLIED: 'after_applied',
  BEFORE_REAPPLIED: 'before_reapplied',
  AFTER_REAPPLIED: 'after_reapplied',
  BEFORE_REMOVED: 'before_removed',
  AFTER_REMOVED: 'after_removed'
} as const;

export type UnitModifierEventMap = {
  [UNIT_MODIFIER_EVENTS.BEFORE_APPLIED]: [];
  [UNIT_MODIFIER_EVENTS.AFTER_APPLIED]: [];
  [UNIT_MODIFIER_EVENTS.BEFORE_REAPPLIED]: [];
  [UNIT_MODIFIER_EVENTS.AFTER_REAPPLIED]: [];
  [UNIT_MODIFIER_EVENTS.BEFORE_REMOVED]: [];
  [UNIT_MODIFIER_EVENTS.AFTER_REMOVED]: [];
};

export type UnitModifierEvent = Values<typeof UNIT_MODIFIER_EVENTS>;

export abstract class UnitModifier extends Entity {
  private emitter = new TypedEventEmitter<UnitModifierEventMap>();

  private mixins: UnitModifierMixin[];

  protected game: Game;

  protected stacks: number;

  protected stackable: boolean;

  protected target!: Unit;

  abstract infos?: {
    iconId?: string;
    spriteId?: string;
    name?: string;
    description?: string;
  };

  constructor(id: EntityId, game: Game, options: UnitModifierOptions) {
    super(id);
    this.game = game;
    this.mixins = options.mixins;
    this.stackable = options.stackable;
    this.stacks = options.stackable ? options.initialStacks : -1;
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

  addStacks(amount: number) {
    assert(this.stackable, `Modifier ${this.id} is not stackable`);
    this.stacks += amount;
  }

  removeStacks(amount: number) {
    assert(this.stackable, `Modifier ${this.id} is not stackable`);
    this.stacks -= amount;
    if (this.stacks === 0) {
      this.target.removeModifier(this.id);
    }
  }

  applyTo(unit: Unit) {
    this.emitter.emit(UNIT_MODIFIER_EVENTS.BEFORE_APPLIED);
    this.target = unit;
    this.mixins.forEach(mixin => {
      mixin.onApplied(unit, this);
    });
    this.emitter.emit(UNIT_MODIFIER_EVENTS.AFTER_APPLIED);
  }

  reapplyTo(unit: Unit, newStacks?: number) {
    this.emitter.emit(UNIT_MODIFIER_EVENTS.BEFORE_REAPPLIED);
    if (this.stackable) {
      this.stacks += newStacks ?? 1;
    }

    this.mixins.forEach(mixin => {
      mixin.onReapplied(unit, this);
    });
    this.emitter.emit(UNIT_MODIFIER_EVENTS.AFTER_REAPPLIED);
  }

  remove() {
    this.emitter.emit(UNIT_MODIFIER_EVENTS.BEFORE_REMOVED);
    this.mixins.forEach(mixin => {
      mixin.onRemoved(this.target, this);
    });
    this.emitter.emit(UNIT_MODIFIER_EVENTS.AFTER_REMOVED);
  }
}
