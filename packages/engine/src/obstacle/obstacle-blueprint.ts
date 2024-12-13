import type { Game } from '../game/game';
import type { Obstacle } from './obstacle.entity';

export type ObstacleBlueprint = {
  id: string;
  name: string;
  description: string;
  spriteId: string;
  walkable: boolean;
  onCreated?: (game: Game, obstacle: Obstacle) => void;
  onDestroyed?: (game: Game, obstacle: Obstacle) => void;
  onEnter?: (game: Game, obstacle: Obstacle) => void;
  onLeave?: (game: Game, obstacle: Obstacle) => void;
};
