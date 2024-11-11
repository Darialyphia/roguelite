import type { BetterOmit, Nullable } from '@game/shared';
import { Game, type GameOptions } from './game/game';
import { ServerRngSystem } from './rng/server-rng.system';
import type { Input } from './input/input';
import type { SerializedInput } from './input/input-system';

export type ServerSessionOptions = BetterOmit<GameOptions, 'rngCtor' | 'id'>;

export class ServerSession {
  readonly game: Game;

  constructor(options: ServerSessionOptions) {
    this.game = new Game({
      id: 'SERVER',
      rngSeed: options.rngSeed,
      rngCtor: ServerRngSystem,
      mapId: options.mapId,
      teams: options.teams
    });
  }

  initialize() {
    return this.game.initialize();
  }

  subscribe(cb: (input: SerializedInput, opts: { rngValues: number[] }) => void) {
    let lastRngValueIndexSent = 0;
    let latestInput: Nullable<Input<any>> = null;

    this.game.on('game.input-queue-flushed', () => {
      const lastInput = this.game.inputSystem.getHistory().at(-1)!;
      // update for  this input has already been pushed
      if (latestInput === lastInput) return;

      cb(lastInput.serialize() as SerializedInput, {
        rngValues: this.game.rngSystem.values.slice(lastRngValueIndexSent)
      });
      lastRngValueIndexSent = this.game.rngSystem.values.length;
      latestInput = lastInput;
    });
  }

  get dispatch() {
    return this.game.dispatch.bind(this.game);
  }
}
