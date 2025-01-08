import { createEntityId } from '../../entity';
import type { Game } from '../../game/game';
import {
  isValidTargetingType,
  type TargetingType
} from '../../targeting/targeting-strategy';
import { KEYWORDS } from '../keywords';
import { BurnModifier } from '../modifiers/burn.modifier';
import type { Unit } from '../unit.entity';
import { AuraModifierMixin } from './aura.mixin';

export class BurnAuraModifierMixin extends AuraModifierMixin {
  constructor(
    game: Game,
    private options: {
      strength: number;
      targetingType: TargetingType;
    }
  ) {
    super(game);
  }

  isElligible(unit: Unit): boolean {
    return (
      unit.position.isNearby(this.modifier.target, this.game) &&
      isValidTargetingType(
        this.game,
        unit.position,
        this.modifier.target.player,
        this.options.targetingType
      )
    );
  }

  onGainAura(unit: Unit): void {
    unit.addModifier(
      new BurnModifier(this.game, {
        source: this.modifier.target.card,
        initialStacks: this.options.strength
      })
    );
  }

  onLoseAura(unit: Unit): void {
    unit.removeModifier(createEntityId(KEYWORDS.BURN.id));
  }
}
