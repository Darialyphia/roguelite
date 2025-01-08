import { createEntityId } from '../../entity';
import { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class SpellCasterModifierMixin extends UnitModifierMixin {
  static modifierName = createEntityId('SPELLCASTER');

  constructor(game: Game) {
    super(game);
  }

  interceptor() {
    return true;
  }

  onApplied(unit: Unit): void {
    unit.addInterceptor('canCastSpells', this.interceptor.bind(this));
    unit.addKeyword(KEYWORDS.COMMANDER);
  }

  onRemoved(unit: Unit): void {
    unit.removeKeyword(KEYWORDS.COMMANDER);
    unit.removeInterceptor('canCastSpells', this.interceptor.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
