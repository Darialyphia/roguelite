import { Game } from '../../game/game';
import { type Keyword } from '../keywords';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

export class KeywordModifierMixin extends UnitModifierMixin {
  constructor(
    game: Game,
    private keyword: Keyword
  ) {
    super(game);
  }

  onApplied(unit: Unit): void {
    unit.addKeyword(this.keyword);
  }

  onRemoved(unit: Unit): void {
    unit.removeKeyword(this.keyword);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
