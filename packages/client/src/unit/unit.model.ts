import { makeCardViewModel, type CardViewModel } from '@/card/card.model';
import {
  makePlayerViewModel,
  type PlayerViewModel
} from '@/player/player.model';
import { config } from '@/utils/config';
import type { Game } from '@game/engine';
import type { EntityId } from '@game/engine/src/entity';
import type { Keyword } from '@game/engine/src/unit/keywords';
import type { Unit } from '@game/engine/src/unit/unit.entity';
import { Vec3, type Point } from '@game/shared';

export type UnitViewModel = {
  id: EntityId;
  name: string;
  spriteId: string;
  iconId: string;
  position: Vec3;
  currentAp: number;
  currentHp: number;
  maxAp: number;
  maxHp: number;
  atk: number;
  modifierInfos: Unit['modifierInfos'];
  player: PlayerViewModel;
  card: CardViewModel;
  screenPosition: Point;
  keywords: Keyword[];
  getUnit(): Unit;
  equals(unit: UnitViewModel): boolean;
  canMoveTo: Unit['canMoveTo'];
  canAttackAt: Unit['canAttackAt'];
};

export const makeUnitViewModel = (game: Game, unit: Unit): UnitViewModel => {
  return {
    id: unit.id,
    name: unit.name,
    spriteId: unit.spriteId,
    iconId: unit.iconId,
    position: Vec3.fromPoint3D(unit.position),
    currentAp: unit.ap.current,
    currentHp: unit.hp.current,
    maxAp: unit.ap.max,
    maxHp: unit.hp.max,
    atk: unit.atk,
    modifierInfos: [...unit.modifierInfos],
    player: makePlayerViewModel(game, unit.player),
    card: makeCardViewModel(game, unit.card),
    screenPosition: {
      x: game.boardSystem.getCellAt(unit.position)!.hex.x,
      y:
        game.boardSystem.getCellAt(unit.position)!.hex.y -
        config.TILE_SIZE.z * unit.position.z
    },
    keywords: unit.keywords,
    canMoveTo: unit.canMoveTo.bind(unit),
    canAttackAt: unit.canAttackAt.bind(unit),
    getUnit() {
      return unit;
    },
    equals(unitVm: UnitViewModel) {
      return unitVm.getUnit().equals(unit);
    }
  };
};
