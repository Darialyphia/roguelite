import { makeUnitViewModel, type UnitViewModel } from '@/unit/unit.model';
import type { Game } from '@game/engine';
import type { Terrain } from '@game/engine/src/board/board-utils';
import type { Cell } from '@game/engine/src/board/cell';
import type { EntityId } from '@game/engine/src/entity';
import type { Nullable } from '@game/shared';

export type CellViewModel = {
  id: EntityId;
  terrain: Terrain;
  x: number;
  y: number;
  z: number;
  unit: Nullable<UnitViewModel>;
  getCell(): Cell;
};

export const makeCellViewModel = (game: Game, cell: Cell): CellViewModel => {
  return {
    id: cell.id,
    terrain: cell.terrain,
    x: cell.x,
    y: cell.y,
    z: cell.z,
    unit: cell.unit ? makeUnitViewModel(game, cell.unit) : null,
    getCell() {
      return cell;
    }
  };
};
