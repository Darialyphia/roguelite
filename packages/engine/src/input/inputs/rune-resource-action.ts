import { assert } from '@game/shared';
import { defaultInputSchema, Input } from '../input';
import { GAME_PHASES } from '../../game/game-phase.system';
import { z } from 'zod';

const schema = defaultInputSchema.extend({
  rune: z.enum(['RED', 'BLUE', 'YELLOW', 'PURPLE', 'GREEN'])
});

export class RuneResourceActionInput extends Input<typeof schema> {
  readonly name = 'runeResourceAction';

  readonly allowedPhases = [GAME_PHASES.BATTLE];

  protected payloadSchema = schema;

  impl() {
    assert(
      this.game.turnSystem.activeUnit.player.equals(this.player),
      'You are not the active player'
    );

    this.player.performResourceAction({
      type: 'rune',
      payload: { rune: this.payload.rune }
    });
  }
}
