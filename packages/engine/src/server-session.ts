import type { Nullable } from '@game/shared';
import { Game } from './game/game';
import { ServerRngSystem } from './rng/server-rng.system';
import type { Input, SerializedInput } from './input/input';

export type ServerSessionOptions = {
  rngSeed: string;
};

export class ServerSession {
  readonly game: Game;

  constructor(options: ServerSessionOptions) {
    this.game = new Game({
      rngSeed: options.rngSeed,
      rngCtor: ServerRngSystem
    });
    this.game.initialize();
  }

  subscribe(cb: (input: SerializedInput, opts: { rngValues: number[] }) => void) {
    let lastRngValueIndexSent = 0;
    let latestInput: Nullable<Input<any>> = null;

    this.game.on('game.input-queue-flushed', () => {
      const lastInput = this.game.inputSystem.getHistory().at(-1)!;
      // update for  this input has already been pushed
      if (latestInput === lastInput) return;

      cb(lastInput.serialize(), {
        rngValues: this.game.rngSystem.values.slice(lastRngValueIndexSent)
      });
      lastRngValueIndexSent = this.game.rngSystem.values.length;
      latestInput = lastInput;
    });
  }

  get dispatch() {
    return this.game.dispatch;
  }
}
