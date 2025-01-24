import { isString, type Constructor } from '@game/shared';
import type { EntityId, Entity } from '../../entity';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { RageModifier } from '../modifiers/rage.modifier';

export class UnitModifierManager {
  private _modifiers: UnitModifier[] = [];

  constructor(private unit: Unit) {}

  has(modifierOrId: EntityId | UnitModifier | Constructor<UnitModifier>) {
    if (modifierOrId instanceof UnitModifier) {
      return this._modifiers.some(modifier => modifier.equals(modifierOrId));
    } else if (isString(modifierOrId)) {
      return this._modifiers.some(modifier =>
        modifier.equals({ id: modifierOrId } as Entity)
      );
    } else {
      return this._modifiers.some(
        modifier => modifier.constructor.name === RageModifier.name
      );
    }
  }

  get(id: EntityId) {
    return this._modifiers.find(mod => mod.id === id);
  }

  add(modifier: UnitModifier) {
    if (this.has(modifier)) {
      this.get(modifier.id)!.reapplyTo(this.unit, modifier.stacks);
    } else {
      this._modifiers.push(modifier);
      modifier.applyTo(this.unit);
    }
  }

  remove(modifierId: EntityId) {
    const idx = this._modifiers.findIndex(mod => mod.id === modifierId);
    if (idx < 0) return;

    const [modifier] = this._modifiers.splice(idx, 1);
    modifier.remove();
  }

  get modifiers() {
    return [...this._modifiers];
  }
}
