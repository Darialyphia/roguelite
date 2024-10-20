import type { Game } from './game';

export abstract class System<T> {
  constructor(protected game: Game) {}

  abstract initialize(options: T): void;
}
