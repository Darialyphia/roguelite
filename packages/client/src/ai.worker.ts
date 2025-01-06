/// <reference lib="webworker" />
import { AI } from '@game/engine/src/ai/ai';
import { createEntityId } from '@game/engine/src/entity';
import type { SerializedInput } from '@game/engine/src/input/input-system';
import {
  ServerSession,
  type ServerSessionOptions
} from '@game/engine/src/server-session';
import { match } from 'ts-pattern';

type AIWorkerEvent =
  | {
      type: 'init';
      payload: {
        options: ServerSessionOptions;
        playerId: string;
      };
    }
  | { type: 'compute'; payload: { action: SerializedInput } };

let ai: AI;
self.addEventListener('message', ({ data }) => {
  const options = data as AIWorkerEvent;

  match(options)
    .with({ type: 'init' }, ({ payload }) => {
      const session = new ServerSession({ ...payload.options, id: 'AI' });
      session.initialize();
      ai = new AI(session, createEntityId(payload.playerId));
    })
    .with({ type: 'compute' }, async ({ payload }) => {
      const nextAction = await ai.onUpdate(payload.action);

      self.postMessage(nextAction);
    })
    .exhaustive();
});
