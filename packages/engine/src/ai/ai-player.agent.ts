import type { Nullable } from '@game/shared';
import type { Game } from '../game/game';
import type { Player } from '../player/player.entity';
import type { AIAgent, ScoredInput } from './agent';

export class AIPlayerAgent implements AIAgent {
  constructor(
    private game: Game,
    private player: Player
  ) {}

  getNextInput(): Nullable<ScoredInput> {
    return null;
  }
}
