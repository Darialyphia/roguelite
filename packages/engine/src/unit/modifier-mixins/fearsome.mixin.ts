import type { Point3D } from '@game/shared';
import { createEntityId } from '../../entity';
import { Game } from '../../game/game';
import { UNIT_EVENTS } from '../unit-enums';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';
import { KEYWORDS } from '../keywords';

export class FearsomeModifierMixin extends UnitModifierMixin {
  static modifierName = createEntityId('FEARSOME');

  private modifier!: UnitModifier;

  constructor(game: Game) {
    super(game);
  }

  onBeforeAttack({ target }: { target: Point3D }) {
    const unit = this.game.unitSystem.getUnitAt(target);
    if (!unit) return;

    const unsub = unit.addInterceptor('canCounterAttack', () => false);
    this.modifier.target.once(UNIT_EVENTS.AFTER_ATTACK, unsub);
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    unit.on(UNIT_EVENTS.BEFORE_ATTACK, this.onBeforeAttack.bind(this));
    unit.addKeyword(KEYWORDS.FEARSOME);
  }

  onRemoved(unit: Unit) {
    unit.off(UNIT_EVENTS.BEFORE_ATTACK, this.onBeforeAttack.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied() {}
}