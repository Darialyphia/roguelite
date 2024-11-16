import type { EntityId } from '../entity';
import type { SerializedInput } from '../input/input-system';
import type { ServerSession } from '../server-session';
import { AIPlayerAgent } from './ai-player.agent';

export class AI {
  constructor(
    private session: ServerSession,
    private playerId: EntityId
  ) {}

  private get game() {
    return this.session.game;
  }

  get player() {
    return this.game.playerSystem.getPlayerById(this.playerId)!;
  }

  async onUpdate(action: SerializedInput) {
    await this.session.dispatch(action);

    const isActive = this.game.turnSystem.activeUnit.player.equals(this.player);
    if (!isActive) return;

    return this.evaluateNextAction();
  }

  async evaluateNextAction(): Promise<SerializedInput> {
    const now = Date.now();
    const agent = new AIPlayerAgent(this.game, this.player);
    const input = await agent.getNextInput();
    console.log(`AI input computed in ${Date.now() - now}`, input);

    return input?.input ?? { type: 'endTurn', payload: { playerId: this.playerId } };
  }
}
