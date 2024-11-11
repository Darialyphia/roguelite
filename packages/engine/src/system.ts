import type { Game } from './game/game';

export abstract class System<T> {
  protected name!: string;
  protected color!: string;

  constructor(protected game: Game) {}

  log(...args: any[]) {
    this.game.log(`%c[${this.name}]`, `color: ${this.color}`, ...args);
  }

  abstract initialize(options: T): void;
}
