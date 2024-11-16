import type { Game } from './game/game';

export abstract class System<T> {
  protected log: (...args: any[]) => void;

  constructor(
    protected game: Game,
    name: string,
    color: string
  ) {
    this.log = this.game.makeLogger(name, color);
  }

  abstract initialize(options: T): void;

  abstract shutdown(): void;
}
