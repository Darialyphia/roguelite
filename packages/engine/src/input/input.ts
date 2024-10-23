import { z } from 'zod';
import type { JSONValue, Serializable } from '@game/shared';
import type { Game } from '../game';
import { createEntityId } from '../entity';

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
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    this.payload = parsed.data;
  }

  get player() {
    return this.game.playerSystem.getPlayerById(createEntityId(this.payload.playerId))!;
  }

  async execute() {
    this.parsePayload();
    if (!this.payload) return;

    if (!this.player) {
      throw new Error(`Unknown player id: ${this.payload.playerId}`);
    }

    this.impl();
  }

  serialize() {
    return this.payload;
  }
}
