import { z } from 'zod';
import { defaultInputSchema, Input } from '../input';

const schema = defaultInputSchema.extend({
  x: z.number(),
  y: z.number(),
  z: z.number()
});

export class AttackInput extends Input<typeof schema> {
  readonly name = 'attack';

  protected payloadSchema = schema;

  impl() {
    if (!this.game.turnSystem.activeUnit.player.equals(this.player)) {
      throw new Error('You are not the active player.');
    }

    if (!this.game.turnSystem.activeUnit.canAttackAt(this.payload)) {
      throw new Error(
        `Cannot Attack at position ${this.payload.x}.${this.payload.y}.${this.payload.z}`
      );
    }

    this.game.turnSystem.activeUnit.attack(this.payload);
  }
}
