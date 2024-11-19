import { Game } from '../game/game';
import type { SerializedInput } from './input-system';

export class InputSimulator {
  readonly game: Game;
  readonly inputs: SerializedInput[];

  constructor(game: Game, inputs: SerializedInput[], id: number) {
    this.game = new Game({
      ...game.options,
      id: `simulation_${id}`,
      history: game.inputSystem.serialize()
    });
    this.inputs = inputs;
  }

  prepare(cb?: (game: Game) => void) {
    this.game.initialize();
    cb?.(this.game);
  }

  run({
    onBeforeInput,
    onAfterInput
  }: {
    onBeforeInput?: (game: Game, input: SerializedInput) => void;
    onAfterInput?: (game: Game, input: SerializedInput) => void;
  }) {
    for (const input of this.inputs) {
      onBeforeInput?.(this.game, input);
      this.game.dispatch(input);
      onAfterInput?.(this.game, input);
    }

    return this.game;
  }
}
