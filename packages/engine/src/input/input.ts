import { z } from 'zod';
import { assert, type JSONValue, type Serializable } from '@game/shared';
import type { Game } from '../game';
import { createEntityId } from '../entity';
import type { GamePhase } from '../game-phase.system';

export const defaultInputSchema = z.object({
  playerId: z.string()
});
export type DefaultSchema = typeof defaultInputSchema;

export type SerializedInput = {
  type: string;
  payload: JSONValue;
};

export type AnyGameAction = Input<any>;

export abstract class Input<TSchema extends DefaultSchema>
  implements Serializable<z.infer<TSchema>>
{
  abstract readonly allowedPhases: GamePhase[];

  abstract readonly name: string;

  protected abstract payloadSchema: TSchema;

  protected payload!: z.infer<TSchema>;

  constructor(
    protected game: Game,
    protected rawPayload: JSONValue
  ) {}

  protected abstract impl(): void;

  private parsePayload() {
    const parsed = this.payloadSchema.safeParse(this.rawPayload);
    assert(parsed.success, parsed.error?.message);

    this.payload = parsed.data;
  }

  get player() {
    return this.game.playerSystem.getPlayerById(createEntityId(this.payload.playerId))!;
  }

  get isValidPhase() {
    return this.allowedPhases.includes(this.game.phase);
  }
  async execute() {
    this.parsePayload();

    assert(this.payload, 'input payload is required');
    assert(this.player, `Unknown player id: ${this.payload.playerId}`);
    assert(
      this.isValidPhase,
      `Cannot execute input ${this.name} during game phase ${this.game.phase}`
    );

    this.impl();
  }

  serialize() {
    return this.payload;
  }
}
