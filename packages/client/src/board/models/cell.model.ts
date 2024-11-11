import type { Game } from '@game/engine';
import type { Terrain } from '@game/engine/src/board/board-utils';
import type { Cell } from '@game/engine/src/board/cell';

export class CellViewModel {
  private game: Game;

  private cell: Cell;

  id: string;

  terrain: Terrain;

  x: number;

  y: number;

  z: number;

  constructor(game: Game, cell: Cell) {
    this.game = game;
    this.cell = cell;

    this.id = cell.id;
    this.terrain = cell.terrain;
    this.x = cell.x;
    this.y = cell.y;
    this.z = cell.z;
  }

  getCell() {
    return this.cell;
  }
}
