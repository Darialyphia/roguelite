import type { Game } from '@game/engine';
import type { Cell } from '@game/engine/src/board/cell';

export type CellViewModel = ReturnType<typeof makeCellVModel>;

export const makeCellVModel = (game: Game, cell: Cell) => {
  return {
    id: cell.id,
    terrain: cell.terrain,
    x: cell.x,
    y: cell.y,
    z: cell.z,
    getCell() {
      return cell;
    }
  };
};
