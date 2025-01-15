import { isDefined, Vec3 } from '@game/shared';
import { Game } from '../../game/game';
import { PLAYER_EVENTS } from '../../player/player-enums';
import { UnitModifier } from '../unit-modifier.entity';
import type { Unit } from '../unit.entity';
import { UnitModifierMixin } from './unit-modifier-mixin';

type EnemyWithPath = {
  enemy: Unit;
  path: {
    distance: number;
    path: Vec3[];
  };
};

export class RageModifierMixin extends UnitModifierMixin {
  modifier!: UnitModifier;
  constructor(game: Game) {
    super(game);

    this.onTurnStart = this.onTurnStart.bind(this);
  }

  onTurnStart() {
    const attachedTo = this.modifier.target;

    const [closestAttackableEnemy] = attachedTo.player.enemyUnits
      .filter(enemy => attachedTo.canAttackAt(enemy.position))
      .map(unit => {
        return {
          unit,
          distance: this.game.boardSystem.getDistance(unit, attachedTo)
        };
      })
      .sort((a, b) => a.distance - b.distance);
    if (closestAttackableEnemy) {
      attachedTo.attack(closestAttackableEnemy.unit);

      return;
    }

    const [shortestPathToEnemy] = attachedTo.player.enemyUnits
      .map(enemy => {
        return this.game.boardSystem
          .getNeighbors3D(enemy.position)
          .filter(cell => cell.isWalkable && !cell.unit)
          .map(cell => {
            return {
              enemy,
              path: attachedTo.getPathTo(cell)
            };
          })
          .filter((element): element is EnemyWithPath => isDefined(element.path))
          .sort((a, b) => {
            return a.path!.path.length - b.path!.path.length;
          })
          .at(0);
      })
      .filter(isDefined)
      .sort((a, b) => {
        return a.path.path.length - b.path.path.length;
      });

    if (!shortestPathToEnemy) return;
    while (attachedTo.canMove && shortestPathToEnemy.path.path.length) {
      const point = shortestPathToEnemy.path.path.shift();
      if (point) attachedTo.move(point);
      if (attachedTo.canAttackAt(shortestPathToEnemy.enemy)) {
        attachedTo.attack(shortestPathToEnemy.enemy);
      }
    }
  }

  onApplied(unit: Unit, modifier: UnitModifier): void {
    this.modifier = modifier;
    unit.player.on(PLAYER_EVENTS.START_TURN, this.onTurnStart);
  }

  onRemoved(unit: Unit): void {
    unit.player.off(PLAYER_EVENTS.START_TURN, this.onTurnStart);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReapplied(): void {}
}
