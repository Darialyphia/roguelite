import { assert } from '@game/shared';
import { GAME_PHASES } from '../../game-phase.system';
import { defaultInputSchema, Input } from '../input';

const schema = defaultInputSchema;

export class PlayCardInput extends Input<typeof schema> {
  readonly name = 'playCard';

  readonly allowedPhases = [GAME_PHASES.BATTLE];

  protected payloadSchema = schema;

  impl() {
    assert(
      this.game.turnSystem.activeUnit.player.equals(this.player),
      'You are not the active player'
    );

    this.game.turnSystem.activeUnit.endTurn();
  }
}
