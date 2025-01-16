import { defaultInputSchema, Input } from '../input';
import { GAME_PHASES } from '../../game/game-phase.system';
import { z } from 'zod';

const schema = defaultInputSchema.extend({
  indices: z.number().array()
});

export class MulliganInput extends Input<typeof schema> {
  readonly name = 'mulligan';

  readonly allowedPhases = [GAME_PHASES.MULLIGAN];

  protected payloadSchema = schema;

  impl() {
    this.player.commitMulliganIndices(this.payload.indices);

    if (this.game.playerSystem.players.every(p => p.hasMulliganed)) {
      this.game.gamePhaseSystem.startBattle();
    }
  }
}
