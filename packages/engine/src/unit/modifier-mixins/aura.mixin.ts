import { Game } from '../../game/game';
import { UNIT_EVENTS } from '../unit-enums';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';
import type { EntityId } from '../../entity';

export abstract class AuraModifierMixin extends UnitModifierMixin {
  protected modifier!: UnitModifier;

  private affectedUnitsIds = new Set<EntityId>();

  // we need to track this variable because of how the event emitter works
  // basically if we have an event that says "after unit moves, remove this aura modifier"
  // It will not clean up aura's "after unit move" event before all the current listeners have been ran
  // which would lead to removing the aura, THEN check and apply the aura anyways
  private isApplied = true;

  constructor(game: Game) {
    super(game);
  }

  abstract isElligible(unit: Unit): boolean;
  abstract onGainAura(unit: Unit): void;
  abstract onLoseAura(unit: Unit): void;

  private checkAura() {
    if (!this.isApplied) return;
    this.game.unitSystem.units.forEach(unit => {
      if (unit.equals(this.modifier.target)) return;
      const shouldGetAura = this.isElligible(unit);

      const hasAura = this.affectedUnitsIds.has(unit.id);

      if (!shouldGetAura && hasAura) {
        this.affectedUnitsIds.delete(unit.id);
        this.onLoseAura(unit);
        return;
      }

      if (shouldGetAura && !hasAura) {
        this.affectedUnitsIds.add(unit.id);
        this.onGainAura(unit);
        return;
      }
    });
  }

  private cleanup() {
    this.game.off('*', this.checkAura);

    this.affectedUnitsIds.forEach(id => {
      const unit = this.game.unitSystem.getUnitById(id);
      if (!unit) return;

      this.affectedUnitsIds.delete(id);
      this.onLoseAura(unit);
    });
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    this.isApplied = true;

    this.game.on('*', this.checkAura.bind(this));
    unit.once(UNIT_EVENTS.BEFORE_DESTROY, this.cleanup.bind(this));
  }

  onRemoved() {
    this.isApplied = false;
    this.cleanup();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied() {}
}
