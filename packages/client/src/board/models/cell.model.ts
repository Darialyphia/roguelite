import type { Game } from '@game/engine';
import type { Terrain } from '@game/engine/src/board/board-utils';
import type { Cell } from '@game/engine/src/board/cell';
import type { EntityId } from '@game/engine/src/entity';

export type CellViewModel = {
  id: EntityId;
  terrain: Terrain;
  x: number;
  y: number;
  z: number;
  getCell(): Cell;
};

export const makeCellViewModel = (game: Game, cell: Cell): CellViewModel => {
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
