import { Game } from '../game/game';
import type { SerializedInput } from './input-system';

let nextSimulationId = 0;
export class InputSimulator {
  private clonedGame: Game;
  private inputs: SerializedInput[];

  constructor(game: Game, inputs: SerializedInput[]) {
    this.clonedGame = new Game({
      ...game.options,
      id: `simulation_${nextSimulationId++}`,
      history: game.inputSystem.serialize()
    });
    this.inputs = inputs;
  }

  async prepare(cb?: (game: Game) => void) {
    await this.clonedGame.initialize();
    cb?.(this.clonedGame);
  }

  run(cb?: (game: Game) => void) {
    for (const input of this.inputs) {
      this.clonedGame.dispatch(input);
      cb?.(this.clonedGame);
    }

    return this.clonedGame;
  }
}
