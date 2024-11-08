import { z } from 'zod';
import { defaultInputSchema, Input } from '../input';
import { assert } from '@game/shared';
import { GAME_PHASES } from '../../game/game-phase.system';

const schema = defaultInputSchema.extend({
  x: z.number(),
  y: z.number(),
  z: z.number()
});

export class AttackInput extends Input<typeof schema> {
  readonly name = 'attack';

  readonly allowedPhases = [GAME_PHASES.BATTLE];

  protected payloadSchema = schema;

  impl() {
    assert(
      this.game.turnSystem.activeUnit.player.equals(this.player),
      'You are not the active player'
    );

    assert(
      this.game.turnSystem.activeUnit.canAttackAt(this.payload),
      `Cannot Attack at position ${this.payload.x}.${this.payload.y}.${this.payload.z}`
    );

    this.game.turnSystem.activeUnit.attack(this.payload);
  }
}
