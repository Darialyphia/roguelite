import { makeCardViewModel, type CardViewModel } from '@/card/card.model';
import type { Game } from '@game/engine';
import type { EntityId } from '@game/engine/src/entity';
import type { Unit } from '@game/engine/src/unit/unit.entity';
import { Vec3 } from '@game/shared';

export type UnitViewModel = {
  id: EntityId;
  name: string;
  spriteId: string;
  iconId: string;
  cosmetics: Record<string, string | null>;
  position: Vec3;
  currentAp: number;
  currentHp: number;
  maxAp: number;
  maxHp: number;
  pAtk: number;
  mAtk: number;
  pDef: number;
  mDef: number;
  speed: number;
  hand: CardViewModel[];
  deckSize: number;
  remainingCardsInDeck: number;
  modifierInfos: Unit['modifierInfos'];
  getUnit(): Unit;
  isActive(): boolean;
  equals(unit: UnitViewModel): boolean;
  canPlayCardAt(index: number): boolean;
};

export const makeUnitVModel = (game: Game, unit: Unit): UnitViewModel => {
  return {
    id: unit.id,
    name: unit.name,
    spriteId: unit.spriteId,
    iconId: unit.iconId,
    cosmetics: unit.cosmetics,
    position: Vec3.fromPoint3D(unit.position),
    currentAp: unit.ap.current,
    currentHp: unit.hp.current,
    maxAp: unit.ap.max,
    maxHp: unit.hp.max,
    pAtk: unit.pAtk,
    mAtk: unit.mAtk,
    pDef: unit.pDef,
    mDef: unit.mDef,
    speed: unit.speed,
    hand: unit.hand.map(card => makeCardViewModel(game, card)),
    deckSize: unit.deckSize,
    remainingCardsInDeck: unit.remainingCardsInDeck,
    modifierInfos: [...unit.modifierInfos],
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
      return unit.canPlayCardAt(index);
    }
  };
};
