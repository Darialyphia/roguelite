import type { EntityId } from '../../entity';
import type { Game } from '../../game/game';
import { DurationModifierMixin } from '../modifier-mixins/duration.mixin';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';

const MODIFIER_ID = 'UNIT_MODIFIER_FROZEN' as EntityId;

export class FrozenModifier extends UnitModifier {
  constructor(game: Game, duration: number) {
    super(MODIFIER_ID, game, {
      stackable: true,
      initialStacks: duration,
      mixins: [new DurationModifierMixin(game)],
      infos: {
        name: 'Frozen',
        description: 'This unit cannot move',
        iconId: 'modifier-frozen',
        spriteId: 'fx-frozen'
      }
    });
  }

  applyTo(unit: Unit): void {
    super.applyTo(unit);

    console.log(`${unit.name} is frozen solid !`);
  }

  remove(): void {
    super.remove();

    console.log(`${this.target.name} is no longer frozen`);
  }
}
