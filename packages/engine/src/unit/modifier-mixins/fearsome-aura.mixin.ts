import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import { KEYWORDS } from '../keywords';
import { FearsomeModifier } from '../modifiers/fearsome.modifier';
import type { Unit } from '../unit.entity';
import { AuraModifierMixin } from './aura.mixin';

export class FearsomeAuraModifierMixin extends AuraModifierMixin {
  constructor(
    game: Game,
    private options: {
      isElligible: (unit: Unit) => boolean;
    }
  ) {
    super(game);
  }

  isElligible(unit: Unit): boolean {
    return this.options.isElligible(unit);
  }

  onGainAura(unit: Unit): void {
    unit.addModifier(new FearsomeModifier(this.game, this.modifier.target.card));
  }

  onLoseAura(unit: Unit): void {
    unit.removeModifier(createEntityId(KEYWORDS.FEARSOME.id));
  }
}
