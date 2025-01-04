import { createEntityId } from '../../entity';
import { Game } from '../../game/game';
import { RangedTargetingStrategy } from '../../targeting/ranged-targeting.strategy';
import { TARGETING_TYPE } from '../../targeting/targeting-strategy';
import { KEYWORDS } from '../keywords';
import { UNIT_EVENTS } from '../unit-enums';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class RushModifierMixin extends UnitModifierMixin {
  static modifierName = createEntityId('RUSH');

  private modifier!: UnitModifier;

  constructor(game: Game) {
    super(game);
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    unit.ap.add(unit.ap.max);

    unit.addKeyword(KEYWORDS.RUSH);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onRemoved() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied() {}
}
