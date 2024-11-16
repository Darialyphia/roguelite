import type { EntityId } from '../entity';
import type { SerializedInput } from '../input/input-system';
import type { ServerSession } from '../server-session';
import { AiHeuristics } from './ai-heuristics';
import { AIPlayerAgent } from './ai-player.agent';

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

  async onUpdate() {
    const isActive = this.game.turnSystem.activeUnit.player.equals(this.player);
    if (!isActive) return;

    return this.evaluateNextAction();
  }

  private async evaluateNextAction(): Promise<SerializedInput> {
    const now = Date.now();
    const agent = new AIPlayerAgent(this.game, this.player, this.heuristics);
    const input = await agent.getNextInput();
    console.log(`AI input computed ${input.type} in ${Date.now() - now}`, input);

    return input;
  }
}
