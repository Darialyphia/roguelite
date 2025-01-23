import { makeCardViewModel, type CardViewModel } from '@/card/card.model';
import {
  makePlayerViewModel,
  type PlayerViewModel
} from '@/player/player.model';
import { config } from '@/utils/config';
import type { Game } from '@game/engine';
import type { EntityId } from '@game/engine/src/entity';
import type { Keyword } from '@game/engine/src/unit/keywords';
import type { UnitModifier } from '@game/engine/src/unit/unit-modifier.entity';
import type { Unit } from '@game/engine/src/unit/unit.entity';
import { Vec3, type Point, type Point3D } from '@game/shared';

export type UnitViewModel = {
  id: EntityId;
  name: string;
  spriteId: string;
  iconId: string;
  position: Vec3;
  currentHp: number;
  maxHp: number;
  atk: number;
  player: PlayerViewModel;
  card: CardViewModel;
  screenPosition: Point;
  keywords: Keyword[];
  isAltar: boolean;
  isDead: boolean;
  isExhausted: boolean;
  remainingMovement: number;
  possibleMoves: Point3D[];
  modifiers: Array<{
    iconId?: string;
    name?: string;
    description?: string;
    id: string;
    stacks?: number;
    sourcePlayer: PlayerViewModel;
  }>;
  getUnit(): Unit;
  equals(unit: UnitViewModel): boolean;
  canMoveTo: Unit['canMoveTo'];
  canAttackAt: Unit['canAttackAt'];
};

export const makeUnitViewModel = (game: Game, unit: Unit): UnitViewModel => {
  return {
    id: unit.id,
    name: unit.name,
    isAltar: unit.isAltar,
    spriteId: unit.spriteId,
    iconId: unit.iconId,
    position: Vec3.fromPoint3D(unit.position),
    currentHp: unit.hp.current,
    maxHp: unit.hp.max,
    atk: unit.atk,
    player: makePlayerViewModel(game, unit.player),
    card: makeCardViewModel(game, unit.card),
    isDead: unit.isDead,
    isExhausted: unit.isExhausted,
    screenPosition: {
      x: game.boardSystem.getCellAt(unit.position)!.hex.x,
      y:
        game.boardSystem.getCellAt(unit.position)!.hex.y -
        config.TILE_SIZE.z * unit.position.z
    },
    keywords: unit.keywords,
    remainingMovement: unit.remainingMovement,
    possibleMoves: unit.getPossibleMoves(),
    modifiers: unit.modifiers.map(mod => ({
      id: mod.id,
      name: mod.infos.name,
      description: mod.infos.description,
      iconId: mod.infos.iconId,
      stacks: mod.stacks,
      sourcePlayer: makePlayerViewModel(game, mod.source.player)
    })),
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
