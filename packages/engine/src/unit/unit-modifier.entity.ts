import { assert } from '@game/shared';
import { Entity, type EntityId } from '../entity';
import type { Game } from '../game/game';
import type { UnitModifierMixin } from './modifier-mixins/unit-modifier-mixin';
import type { Unit } from './unit.entity';

export type UnitModifierOptions = {
  mixins: [UnitModifierMixin, ...UnitModifierMixin[]];
  infos?: {
    iconId?: string;
    spriteId?: string;
    name?: string;
    description?: string;
  };
} & (
  | {
      stackable: true;
      initialStacks: number;
    }
  | {
      stackable: false;
    }
);

export class UnitModifier extends Entity {
  private mixins: UnitModifierMixin[];

  protected game: Game;

  protected stacks: number;

  protected stackable: boolean;

  protected target!: Unit;

  readonly infos?: {
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
    this.infos = options.infos;
  }

  addStacks(amount: number) {
    assert(this.stackable, `Modifier ${this.id} is not stackable`);
    this.stacks += amount;
  }

  removeStacks(amount: number) {
    assert(this.stackable, `Modifier ${this.id} is not stackable`);
    this.stacks -= amount;
    if (this.stacks === 0) {
      this.remove();
    }
  }

  applyTo(unit: Unit) {
    this.target = unit;
    this.mixins.forEach(mixin => {
      mixin.onApplied(unit, this);
    });
  }

  reapplyTo(unit: Unit, newStacks?: number) {
    if (this.stackable) {
      this.stacks += newStacks ?? 1;
    }

    this.mixins.forEach(mixin => {
      mixin.onReapplied(unit, this);
    });
  }

  remove() {
    this.mixins.forEach(mixin => {
      mixin.onRemoved(this.target, this);
    });
  }
}
