import {
  makePlayerViewModel,
  type PlayerViewModel
} from '@/player/player.model';
import { makeUnitViewModel, type UnitViewModel } from '@/unit/unit.model';
import type { Game } from '@game/engine';
import type { Terrain } from '@game/engine/src/board/board-utils';
import type { Cell } from '@game/engine/src/board/cell';
import type { CellLight } from '@game/engine/src/board/map';
import type { EntityId } from '@game/engine/src/entity';
import type { Nullable } from '@game/shared';

export type CellViewModel = {
  id: EntityId;
  terrain: Terrain;
  x: number;
  y: number;
  z: number;
  unit: Nullable<UnitViewModel>;
  light?: CellLight;
  obstacle: {
    name: string;
    id: string;
    spriteId: string;
    player: PlayerViewModel | null;
  } | null;
  getCell(): Cell;
};

export const makeCellViewModel = (game: Game, cell: Cell): CellViewModel => {
  return {
    id: cell.id,
    terrain: cell.terrain,
    x: cell.x,
    y: cell.y,
    z: cell.z,
    light: cell.light,
    unit: cell.unit ? makeUnitViewModel(game, cell.unit) : null,
    obstacle: cell.obstacle
      ? {
          id: cell.obstacle.id,
          name: cell.obstacle.name,
          spriteId: cell.obstacle.spriteId,
          player: cell.obstacle.player
            ? makePlayerViewModel(game, cell.obstacle.player)
            : null
        }
      : null,
    getCell() {
      return cell;
    }
  };
};
