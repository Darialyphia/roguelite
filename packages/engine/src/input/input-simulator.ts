import { Game } from '../game/game';
import type { SerializedInput } from './input-system';

export class InputSimulator {
  private clonedGame: Game;
  private input: SerializedInput;

  constructor(game: Game, input: SerializedInput) {
    this.clonedGame = new Game({ ...game.options, id: 'simulation' });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.clonedGame.makeLogger = () => () => {};
    this.input = input;
  }

  async prepare(cb?: (game: Game) => void) {
    await this.clonedGame.initialize();
    cb?.(this.clonedGame);
  }

  run() {
    this.clonedGame.dispatch(this.input);

    return this.clonedGame;
  }
}
