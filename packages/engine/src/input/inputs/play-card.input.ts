import { z } from 'zod';
import { defaultInputSchema, Input } from '../input';

const schema = defaultInputSchema.extend({
  index: z.number(),
  targets: z.array(
    z.object({
      x: z.number(),
      y: z.number(),
      z: z.number()
    })
  )
});

export class PlayCardInput extends Input<typeof schema> {
  readonly name = 'playCard';

  protected payloadSchema = schema;

  impl() {
    if (!this.game.turnSystem.activeUnit.player.equals(this.player)) {
      throw new Error('You are not the active player.');
    }

    const card = this.game.turnSystem.activeUnit.getCardAt(this.payload.index);

    if (!card.canPlayAt(this.payload.targets)) {
      throw new Error(`Cannot play card at index ${this.payload.index}`);
    }

    this.game.turnSystem.activeUnit.playCard(this.payload.index, this.payload.targets);
  }
}
