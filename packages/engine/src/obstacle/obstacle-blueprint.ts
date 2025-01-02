import type { Game } from '../game/game';
import type { Unit } from '../unit/unit.entity';
import type { Obstacle } from './obstacle.entity';

export type ObstacleBlueprint = {
  id: string;
  name: string;
  description: string;
  spriteId: string;
  walkable: boolean;
  attackable: boolean;
  onCreated?: (game: Game, obstacle: Obstacle) => void;
  onDestroyed?: (game: Game, obstacle: Obstacle) => void;
  onAttacked?: (game: Game, obstacle: Obstacle, unit: Unit) => void;
  onEnter?: (game: Game, obstacle: Obstacle) => void;
  onLeave?: (game: Game, obstacle: Obstacle) => void;
};
