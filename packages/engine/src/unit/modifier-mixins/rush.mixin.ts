import { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class RushModifierMixin extends UnitModifierMixin {
  constructor(game: Game) {
    super(game);
  }

  onApplied(unit: Unit): void {
    unit.ap.add(unit.ap.max);

    unit.addKeyword(KEYWORDS.RUSH);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onRemoved() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied() {}
}
