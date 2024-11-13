import { isDefined, type Point3D } from '@game/shared';
import type { Game } from '../game/game';
import type { Unit } from '../unit/unit.entity';

export const getUnitTargets = (game: Game, targets: Point3D[]) => {
  return targets.map(point => game.unitSystem.getUnitAt(point)).filter(isDefined);
};

export const getEnemyTargets = (game: Game, targets: Point3D[], source: Unit) => {
  return targets
    .map(point => game.unitSystem.getUnitAt(point))
    .filter(isDefined)
    .filter(unit => unit.isEnemy(source));
};

export const getAllyTargets = (game: Game, targets: Point3D[], source: Unit) => {
  return targets
    .map(point => game.unitSystem.getUnitAt(point))
    .filter(isDefined)
    .filter(unit => unit.isAlly(source));
};