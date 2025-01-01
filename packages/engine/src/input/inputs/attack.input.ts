import { z } from 'zod';
import { defaultInputSchema, Input } from '../input';
import { assert, isDefined } from '@game/shared';
import { GAME_PHASES } from '../../game/game-phase.system';
import { createEntityId } from '../../entity';

const schema = defaultInputSchema.extend({
  unitId: z.string(),
  x: z.number(),
  y: z.number(),
  z: z.number()
});

export class AttackInput extends Input<typeof schema> {
  readonly name = 'attack';

  readonly allowedPhases = [GAME_PHASES.BATTLE];

  protected payloadSchema = schema;

  private get unit() {
    return this.game.unitSystem.getUnitById(createEntityId(this.payload.unitId));
  }

  impl() {
    assert(
      this.game.turnSystem.activePlayer.equals(this.player),
      'You are not the active player'
    );
    assert(isDefined(this.unit), 'Unit not found');
    assert(
      this.unit.player.equals(this.game.turnSystem.activePlayer),
      'You do not own this unit'
    );
    assert(
      this.unit.canAttackAt(this.payload),
      `Cannot attack at position ${this.payload.x}.${this.payload.y}.${this.payload.z}`
    );

    this.unit.attack(this.payload);
  }
}
