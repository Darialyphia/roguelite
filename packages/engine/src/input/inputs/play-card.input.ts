import { z } from 'zod';
import { defaultInputSchema, Input } from '../input';
import { GAME_PHASES } from '../../game/game-phase.system';

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

  readonly allowedPhases = [GAME_PHASES.BATTLE];

  protected payloadSchema = schema;

  impl() {
    if (!this.game.turnSystem.activePlayer.equals(this.player)) {
      throw new Error('You are not the active player.');
    }

    const card = this.player.getCardAt(this.payload.index);
    if (!card.canPlayAt(this.payload.targets)) {
      throw new Error(`Cannot play card at index ${this.payload.index}`);
    }

    this.player.playCard(this.payload.index, this.payload.targets);
  }
}
