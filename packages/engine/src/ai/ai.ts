import { match } from 'ts-pattern';
import type { EntityId } from '../entity';
import type { SerializedInput } from '../input/input-system';
import type { ServerSession } from '../server-session';
import { AiHeuristics } from './ai-heuristics';
import { AIPlayerAgent } from './ai-player.agent';
import { GAME_PHASES } from '../game/game-phase.system';

export class AI {
  private heuristics: AiHeuristics;

  constructor(
    private session: ServerSession,
    private playerId: EntityId
  ) {
    this.heuristics = new AiHeuristics(this.game);
  }

  private get game() {
    return this.session.game;
  }

  get player() {
    return this.game.playerSystem.getPlayerById(this.playerId)!;
  }

  onUpdate() {
    const isActive = match(this.game.phase)
      .with(GAME_PHASES.MULLIGAN, () => true)
      .with(GAME_PHASES.BATTLE, () =>
        this.game.turnSystem.activeUnit.player.equals(this.player)
      )
      .with(GAME_PHASES.END, () => false)
      .exhaustive();

    if (!isActive) return;

    return this.evaluateNextAction();
  }

  private evaluateNextAction(): SerializedInput {
    const now = Date.now();
    const agent = new AIPlayerAgent(this.game, this.player, this.heuristics);
    const input = agent.getNextInput();
    console.log(`AI input computed ${input.type} in ${Date.now() - now}`, input);

    return input;
  }
}
