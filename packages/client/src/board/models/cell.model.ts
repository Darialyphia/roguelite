import {
  makePlayerViewModel,
  type PlayerViewModel
} from '@/player/player.model';
import { makeUnitViewModel, type UnitViewModel } from '@/unit/unit.model';
import { config } from '@/utils/config';
import type { Game } from '@game/engine';
import type { Terrain } from '@game/engine/src/board/board-utils';
import type { Cell } from '@game/engine/src/board/cell';
import type { CellLight } from '@game/engine/src/board/map';
import type { EntityId } from '@game/engine/src/entity';
import {
  isDefined,
  type AnyObject,
  type Nullable,
  type Point
} from '@game/shared';

export type CellViewModel = {
  id: EntityId;
  terrain: Terrain;
  spriteId: string;
  x: number;
  y: number;
  z: number;
  unit: Nullable<UnitViewModel>;
  light?: CellLight;
  screenPosition: Point;
  isWalkable: boolean;
  isOccupied: boolean;
  obstacle: {
    name: string;
    description: string;
    id: string;
    blueprintId: string;
    spriteId: string;
    iconId: string;
    player: PlayerViewModel | null;
    meta: AnyObject;
  } | null;
  getCell(): Cell;
};

export const makeCellViewModel = (game: Game, cell: Cell): CellViewModel => {
  return {
    id: cell.id,
    terrain: cell.terrain,
    spriteId: cell.spriteId,
    x: cell.x,
    y: cell.y,
    z: cell.z,
    light: cell.light,
    unit: cell.unit ? makeUnitViewModel(game, cell.unit) : null,
    screenPosition: {
      x: cell.hex.x,
      y: cell.hex.y - config.TILE_SIZE.z * cell.z
    },
    isWalkable: cell.isWalkable,
    isOccupied: isDefined(cell.unit),
    obstacle: cell.obstacle
      ? {
          id: cell.obstacle.id,
          blueprintId: cell.obstacle.blueprintId,
          name: cell.obstacle.name,
          description: cell.obstacle.description,
          iconId: cell.obstacle.iconId,
          spriteId: cell.obstacle.spriteId,
          meta: cell.obstacle.meta,
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
