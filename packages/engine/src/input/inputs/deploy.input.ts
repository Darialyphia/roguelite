import { assert } from '@game/shared';
import { GAME_PHASES } from '../../game-phase.system';
import { defaultInputSchema, Input } from '../input';
import { z } from 'zod';

const schema = defaultInputSchema.extend({
  units: z.array(
    z.object({
      x: z.number(),
      y: z.number(),
      z: z.number()
    })
  )
});

export class DeployInput extends Input<typeof schema> {
  readonly name = 'deploy';

  readonly allowedPhases = [GAME_PHASES.DEPLOYMENT];

  protected payloadSchema = schema;

  impl() {
    assert(
      this.player.roster.units.length === this.payload.units.length,
      'Missing units for deployment'
    );

    this.player.commitDeployment(this.payload.units);
    if (this.game.playerSystem.players.every(player => player.isReady)) {
      this.game.gamePhaseSystem.startBattle();
    }
  }
}
