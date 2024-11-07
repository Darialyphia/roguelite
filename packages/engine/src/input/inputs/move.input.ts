import { z } from 'zod';
import { defaultInputSchema, Input } from '../input';
import { GAME_PHASES } from '../../game-phase.system';
import { assert } from '@game/shared';

const schema = defaultInputSchema.extend({
  x: z.number(),
  y: z.number(),
  z: z.number()
});

export class MoveInput extends Input<typeof schema> {
  readonly name = 'move';

  readonly allowedPhases = [GAME_PHASES.BATTLE];

  protected payloadSchema = schema;

  impl() {
    assert(
      this.game.turnSystem.activeUnit.player.equals(this.player),
      'You are not the active player'
    );

    assert(
      this.game.turnSystem.activeUnit.canMoveTo(this.payload),
      `Cannot Move unit to ${this.payload.x}.${this.payload.y}.${this.payload.z}`
    );

    this.game.turnSystem.activeUnit.move(this.payload);
  }
}
