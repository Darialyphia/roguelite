import type { Nullable } from '@game/shared';
import { Game } from './game';
import { ClientRngSystem, ServerRngSystem } from './rng/rng-system';
import type { Input, SerializedInput } from './input/input';

export type ClientSessionOptions = {
  rngValues: number[];
};

export class ClientSession {
  readonly game: Game;

  constructor(options: ClientSessionOptions) {
    this.game = new Game({
      rngSeed: '',
      rngCtor: ClientRngSystem
    });
    this.game.rngSystem.values = options.rngValues;
    this.game.initialize();
  }

  async dispatch(
    input: SerializedInput,
    meta: { rngValues: number[] } = { rngValues: [] }
  ) {
    try {
      this.game.rngSystem.values.push(...meta.rngValues);

      return this.game.dispatch(input);
    } catch (err) {
      console.error(err);
    }
  }
}
