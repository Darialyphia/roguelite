import type { Game } from '@game/engine';
import type { Unit } from '@game/engine/src/unit/unit.entity';
import { Vec3 } from '@game/shared';

export class UnitViewModel {
  private game: Game;

  private unit: Unit;

  id: string;

  spriteId: string;

  cosmetics: Record<string, string | null>;

  position: Vec3;

  currentAp: number;

  maxAp: number;

  currentHp: number;

  maxHp: number;

  constructor(game: Game, unit: Unit) {
    this.game = game;
    this.unit = unit;

    this.id = unit.id;
    this.spriteId = unit.spriteId;
    this.cosmetics = unit.cosmetics;
    this.position = Vec3.fromPoint3D(unit.position);
    this.currentAp = unit.ap.current;
    this.currentHp = unit.hp.current;
    this.maxAp = unit.ap.max;
    this.maxHp = unit.hp.max;
  }

  getUnit() {
    return this.unit;
  }

  isActive() {
    return this.game.turnSystem.activeUnit.equals(this.unit);
  }
}
