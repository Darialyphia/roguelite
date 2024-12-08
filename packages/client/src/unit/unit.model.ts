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
  speed: number;
  hand: CardViewModel[];
  deckSize: number;
  remainingCardsInDeck: number;
  modifierInfos: Unit['modifierInfos'];
  player: PlayerViewModel;
  getUnit(): Unit;
  isActive(): boolean;
  equals(unit: UnitViewModel): boolean;
  canPlayCardAt(index: number): boolean;
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
    speed: unit.speed,
    hand: unit.player.hand.map(card => makeCardViewModel(game, card)),
    deckSize: unit.player.deckSize,
    remainingCardsInDeck: unit.player.remainingCardsInDeck,
    modifierInfos: [...unit.modifierInfos],
    player: makePlayerViewModel(game, unit.player),
    getUnit() {
      return unit;
    },
    isActive() {
      return game.turnSystem.activeUnit.equals(unit);
    },
    equals(unitVm: UnitViewModel) {
      return unitVm.getUnit().equals(unit);
    },
    canPlayCardAt(index) {
      return unit.player.canPlayCardAt(index);
    }
  };
};
