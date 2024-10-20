import { z } from 'zod';
import type { JSONValue, Serializable } from '@game/shared';
import type { Game } from '../game';

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

  constructor(protected rawPayload: JSONValue) {}

  protected abstract impl(game: Game): void;

  private parsePayload() {
    const parsed = this.payloadSchema.safeParse(this.rawPayload);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    this.payload = parsed.data;
  }

  async execute(game: Game) {
    this.parsePayload();
    if (!this.payload) return;

    this.impl(game);
  }

  serialize() {
    return this.payload;
  }
}
