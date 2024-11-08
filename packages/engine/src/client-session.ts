import type { Nullable } from '@game/shared';
import { Game, type StarEvent } from './game/game';
import type { Input, SerializedInput } from './input/input';
import { ClientRngSystem } from './rng/client-rng.system';

export type ClientSessionOptions = {
  rngValues: number[];
};

export class ClientSession {
  readonly game: Game;
  private eventsSinceLastInput: StarEvent[] = [];

  constructor(options: ClientSessionOptions) {
    this.game = new Game({
      rngSeed: '',
      rngCtor: ClientRngSystem
    });
    this.game.rngSystem.values = options.rngValues;
    this.game.on('*', evt => {
      this.eventsSinceLastInput.push(evt);
    });
    this.game.initialize();
  }

  async dispatch(
    input: SerializedInput,
    meta: { rngValues: number[] } = { rngValues: [] }
  ) {
    try {
      this.game.rngSystem.values.push(...meta.rngValues);

      this.game.dispatch(input);
      this.eventsSinceLastInput = [];
    } catch (err) {
      console.error(err);
    }
  }

  subscribe(cb: (input: SerializedInput, events: StarEvent[]) => void) {
    let latestInput: Nullable<Input<any>> = null;

    this.game.on('game.input-queue-flushed', () => {
      const lastInput = this.game.inputSystem.getHistory().at(-1)!;
      // update for  this input has already been pushed
      if (latestInput === lastInput) return;

      cb(lastInput.serialize(), this.eventsSinceLastInput);
      latestInput = lastInput;
    });
  }
}
