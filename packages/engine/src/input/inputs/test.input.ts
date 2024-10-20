import { z } from 'zod';
import { defaultInputSchema, Input } from '../input';
import type { Game } from '../../game';

const schema = defaultInputSchema.extend({
  x: z.number(),
  y: z.number()
});
export class TestInput extends Input<typeof schema> {
  readonly name = 'test';

  protected payloadSchema = schema;

  impl(game: Game) {
    console.log('test', game);
  }
}
