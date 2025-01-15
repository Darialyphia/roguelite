import { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class CommanderModifierMixin extends UnitModifierMixin {
  constructor(game: Game) {
    super(game);
    this.interceptor = this.interceptor.bind(this);
  }

  interceptor() {
    return true;
  }

  onApplied(unit: Unit): void {
    unit.addInterceptor('canSummonUnitsNearby', this.interceptor);
    unit.addKeyword(KEYWORDS.COMMANDER);
  }

  onRemoved(unit: Unit): void {
    unit.removeKeyword(KEYWORDS.COMMANDER);
    unit.removeInterceptor('canSummonUnitsNearby', this.interceptor);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
