import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import {
  isValidTargetingType,
  type TargetingType
} from '../../targeting/targeting-strategy';
import { KEYWORDS } from '../keywords';
import { RageModifier } from '../modifiers/rage.modifier';
import type { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { AuraModifierMixin } from './aura.mixin';

export class RageAuraModifierMixin extends AuraModifierMixin {
  isElligible(unit: Unit): boolean {
    return !unit.isGeneral;
  }

  onGainAura(unit: Unit): void {
    unit.addModifier(new RageModifier(this.game, this.modifier.target.card));
  }

  onLoseAura(unit: Unit): void {
    unit.removeModifier(createEntityId(KEYWORDS.RAGE.id));
  }
}
