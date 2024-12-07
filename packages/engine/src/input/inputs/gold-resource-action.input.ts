import { assert } from '@game/shared';
import { defaultInputSchema, Input } from '../input';
import { GAME_PHASES } from '../../game/game-phase.system';

const schema = defaultInputSchema;

export class GoldResourceActionInput extends Input<typeof schema> {
  readonly name = 'goldResourceAction';

  readonly allowedPhases = [GAME_PHASES.BATTLE];

  protected payloadSchema = schema;

  impl() {
    assert(
      this.game.turnSystem.activeUnit.player.equals(this.player),
      'You are not the active player'
    );

    this.player.performResourceAction({ type: 'gold', payload: {} });
  }
}
