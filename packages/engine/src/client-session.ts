import type { BetterOmit, Nullable } from '@game/shared';
import { Game, type GameOptions, type StarEvent } from './game/game';
import type { Input } from './input/input';
import { ClientRngSystem } from './rng/client-rng.system';
import type { SerializedInput } from './input/input-system';

export type ClientSessionOptions = BetterOmit<GameOptions, 'rngCtor' | 'rngSeed'> & {
  rngValues: number[];
};

export type ClientDispatchMeta = { rngValues: number[] };

export class ClientSession {
  readonly game: Game;
  private eventsSinceLastInput: StarEvent[] = [];

  constructor(options: ClientSessionOptions) {
    this.game = new Game({
      rngSeed: '',
      rngCtor: ClientRngSystem,
      mapId: options.mapId,
      teams: options.teams
    });
    this.game.rngSystem.values = options.rngValues;
    this.game.on('*', evt => {
      this.eventsSinceLastInput.push(evt);
    });
  }

  initialize() {
    return this.game.initialize();
  }

  async dispatch(input: SerializedInput, meta: ClientDispatchMeta) {
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
