import { z } from 'zod';
import { defaultInputSchema, Input } from '../input';

const schema = defaultInputSchema.extend({
  x: z.number(),
  y: z.number(),
  z: z.number()
});

export class MoveInput extends Input<typeof schema> {
  readonly name = 'move';

  protected payloadSchema = schema;

  impl() {
    if (!this.game.turnSystem.activeUnit.player.equals(this.player)) {
      throw new Error('You are not the active player.');
    }

    if (!this.game.turnSystem.activeUnit.canMoveTo(this.payload)) {
      throw new Error(
        `Cannot Move unit to ${this.payload.x}.${this.payload.y}.${this.payload.z}`
      );
    }

    this.game.turnSystem.activeUnit.move(this.payload);
  }
}
