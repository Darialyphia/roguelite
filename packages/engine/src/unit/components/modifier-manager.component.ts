import type { EntityId, Entity } from '../../entity';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';

export class UnitModifierManager {
  private modifiers: UnitModifier[] = [];

  constructor(private unit: Unit) {}

  has(modifierOrId: EntityId | UnitModifier) {
    if (modifierOrId instanceof UnitModifier) {
      return this.modifiers.some(modifier => modifier.equals(modifierOrId));
    } else {
      return this.modifiers.some(modifier =>
        modifier.equals({ id: modifierOrId } as Entity)
      );
    }
  }

  get(id: EntityId) {
    return this.modifiers.find(mod => mod.id === id);
  }

  add(modifier: UnitModifier) {
    if (this.has(modifier)) {
      modifier.reapplyTo(this.unit);
    } else {
      this.modifiers.push(modifier);
      modifier.applyTo(this.unit);
    }
  }

  remove(modifierId: EntityId) {
    const idx = this.modifiers.findIndex(mod => mod.id === modifierId);
    if (idx < 0) return;

    const [modifier] = this.modifiers.splice(idx, 1);
    modifier.remove();
  }

  get modifierInfos() {
    return this.modifiers.map(m => m.infos);
  }
}
