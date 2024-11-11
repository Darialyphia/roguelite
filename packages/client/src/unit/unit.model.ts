import type { Game } from '@game/engine';
import type { Unit } from '@game/engine/src/unit/unit.entity';
import { Vec3 } from '@game/shared';

export type UnitViewModel = ReturnType<typeof makeUnitVModel>;

export const makeUnitVModel = (game: Game, unit: Unit) => {
  return {
    id: unit.id,
    spriteId: unit.spriteId,
    cosmetics: unit.cosmetics,
    position: Vec3.fromPoint3D(unit.position),
    currentAp: unit.ap.current,
    currentHp: unit.hp.current,
    maxAp: unit.ap.max,
    maxHp: unit.hp.max,
    getUnit() {
      return unit;
    },
    isActive() {
      return game.turnSystem.activeUnit.equals(unit);
    }
  };
};
