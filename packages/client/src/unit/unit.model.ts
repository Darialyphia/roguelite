import { makeCardViewModel, type CardViewModel } from '@/card/card.model';
import {
  makePlayerViewModel,
  type PlayerViewModel
} from '@/player/player.model';
import type { Game } from '@game/engine';
import type { EntityId } from '@game/engine/src/entity';
import type { Unit } from '@game/engine/src/unit/unit.entity';
import { Vec3 } from '@game/shared';

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
    canMoveTo: unit.canMoveTo,
    canAttackAt: unit.canAttackAt,
    getUnit() {
      return unit;
    },
    equals(unitVm: UnitViewModel) {
      return unitVm.getUnit().equals(unit);
    }
  };
};
