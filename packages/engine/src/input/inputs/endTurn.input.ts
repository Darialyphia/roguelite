import { defaultInputSchema, Input } from '../input';

const schema = defaultInputSchema;

export class PlayCardInput extends Input<typeof schema> {
  readonly name = 'playCard';

  protected payloadSchema = schema;

  impl() {
    if (!this.game.turnSystem.activeUnit.player.equals(this.player)) {
      throw new Error('You are not the active player.');
    }

    this.game.turnSystem.activeUnit.endTurn();
  }
}
