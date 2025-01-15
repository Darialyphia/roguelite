import { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class RushModifierMixin extends UnitModifierMixin {
  constructor(game: Game) {
    super(game);
    this.interceptor = this.interceptor.bind(this);
  }

  interceptor() {
    return false;
  }

  onApplied(unit: Unit): void {
    unit.addInterceptor('shouldDeactivateWhenSummoned', this.interceptor);
    unit.addKeyword(KEYWORDS.RUSH);
  }

  onRemoved(unit: Unit): void {
    unit.removeInterceptor('shouldDeactivateWhenSummoned', this.interceptor);
    unit.removeKeyword(KEYWORDS.RUSH);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
