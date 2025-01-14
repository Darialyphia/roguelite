<script setup lang="ts">
import Fps from '@/shared/components/Fps.vue';
import { ClientSession, ServerSession } from '@game/engine';
import type { GameOptions } from '@game/engine/src/game/game';
import { AI } from '@game/engine/src/ai/ai';
import type { EntityId } from '@game/engine/src/entity';
import { waitFor } from '@game/shared';
import type { SerializedInput } from '@game/engine/src/input/input-system';
import { until } from '@vueuse/core';
import AIWorker from '@/ai.worker?worker';
import { useBattleStore } from '@/battle/stores/battle.store';
import BattleUi from '@/battle/components/BattleUi.vue';

definePage({
  name: 'Battle'
});

const options: Pick<GameOptions, 'mapId' | 'teams'> = {
  mapId: '1v1',
  teams: [
    [
      {
        id: 'player',
        name: 'Daria',
        deck: {
          general: { blueprintId: 'red-general-flame-lord' },
          cards: [
            { blueprintId: 'red-crazed-blood-cultist' },
            { blueprintId: 'red-crazed-blood-cultist' },
            { blueprintId: 'red-crazed-blood-cultist' },
            { blueprintId: 'red-burning-blade' },
            { blueprintId: 'red-burning-blade' },
            { blueprintId: 'red-burning-blade' },
            { blueprintId: 'red-combustion' },
            { blueprintId: 'red-combustion' },
            { blueprintId: 'red-combustion' },
            { blueprintId: 'red-will-o-wisp' },
            { blueprintId: 'red-will-o-wisp' },
            { blueprintId: 'red-will-o-wisp' },
            { blueprintId: 'red-warleader' },
            { blueprintId: 'red-warleader' },
            { blueprintId: 'red-warleader' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-fire-elemental' },
            { blueprintId: 'red-fire-elemental' },
            { blueprintId: 'red-fire-elemental' },
            { blueprintId: 'red-berserk' },
            { blueprintId: 'red-berserk' },
            { blueprintId: 'red-berserk' },
            { blueprintId: 'red-avenger' },
            { blueprintId: 'red-avenger' },
            { blueprintId: 'red-avenger' },
            { blueprintId: 'red-exorcist' },
            { blueprintId: 'red-exorcist' },
            { blueprintId: 'red-exorcist' },
            { blueprintId: 'red-archer' },
            { blueprintId: 'red-archer' },
            { blueprintId: 'red-archer' },
            { blueprintId: 'red-emperor' },
            { blueprintId: 'red-emperor' },
            { blueprintId: 'red-emperor' },
            { blueprintId: 'red-fireball' },
            { blueprintId: 'red-fireball' },
            { blueprintId: 'red-fireball' },
            { blueprintId: 'test-quest' },
            { blueprintId: 'test-quest' },
            { blueprintId: 'test-quest' }
          ]
        }
      }
    ],
    [
      {
        id: 'ai',
        name: 'AI',
        deck: {
          general: { blueprintId: 'red-general-flame-lord' },
          cards: [
            { blueprintId: 'red-crazed-blood-cultist' },
            { blueprintId: 'red-crazed-blood-cultist' },
            { blueprintId: 'red-crazed-blood-cultist' },
            { blueprintId: 'red-burning-blade' },
            { blueprintId: 'red-burning-blade' },
            { blueprintId: 'red-burning-blade' },
            { blueprintId: 'red-combustion' },
            { blueprintId: 'red-combustion' },
            { blueprintId: 'red-combustion' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-will-o-wisp' },
            { blueprintId: 'red-will-o-wisp' },
            { blueprintId: 'red-will-o-wisp' },
            { blueprintId: 'red-warleader' },
            { blueprintId: 'red-warleader' },
            { blueprintId: 'red-warleader' },
            { blueprintId: 'red-berserk' },
            { blueprintId: 'red-berserk' },
            { blueprintId: 'red-berserk' },
            { blueprintId: 'red-fire-elemental' },
            { blueprintId: 'red-fire-elemental' },
            { blueprintId: 'red-fire-elemental' },
            { blueprintId: 'red-avenger' },
            { blueprintId: 'red-avenger' },
            { blueprintId: 'red-avenger' },
            { blueprintId: 'red-exorcist' },
            { blueprintId: 'red-exorcist' },
            { blueprintId: 'red-exorcist' },
            { blueprintId: 'test-quest' },
            { blueprintId: 'test-quest' },
            { blueprintId: 'test-quest' },
            { blueprintId: 'red-archer' },
            { blueprintId: 'red-archer' },
            { blueprintId: 'red-archer' },
            { blueprintId: 'red-emperor' },
            { blueprintId: 'red-emperor' },
            { blueprintId: 'red-emperor' },
            { blueprintId: 'red-fireball' },
            { blueprintId: 'red-fireball' },
            { blueprintId: 'red-fireball' }
          ]
        }
      }
    ]
  ]
};
const SEED = "I'm wrong ? What did I say that was wrong ?";
const serverOptions = {
  rngSeed: SEED,
  ...options
};

const serverSession = new ServerSession(serverOptions);
const clientSession = new ClientSession(options);

const battleStore = useBattleStore();

const start = () => {
  serverSession.initialize();
  clientSession.initialize([...serverSession.game.rngSystem.values]);
  const ai = new AI(serverSession, 'ai' as EntityId);

  const aiWorker = new AIWorker();
  aiWorker.postMessage({
    type: 'init',
    payload: { options: serverOptions, playerId: 'ai' }
  });

  aiWorker.addEventListener('message', async event => {
    const aiAction = event.data as SerializedInput | undefined;
    if (!aiAction) return;

    await until(() => battleStore.isPlayingFx).not.toBeTruthy();

    if (aiAction.type === 'move') {
      await waitFor(100);
    } else {
      await waitFor(300);
    }
    serverSession.dispatch(aiAction);
  });

  battleStore.init(
    clientSession,
    input => {
      serverSession.dispatch(input);
    },
    'player'
  );
  serverSession.subscribe(async (input, opts) => {
    clientSession.dispatch(input, opts);
    if (
      input.payload.playerId === 'ai' &&
      (input.type === 'drawResourceAction' ||
        input.type === 'runeResourceAction' ||
        input.type === 'goldResourceAction')
    ) {
      await waitFor(1000);
    }
    aiWorker.postMessage({
      type: 'compute',
      payload: { action: JSON.parse(JSON.stringify(input)) }
    });
  });
};
start();
</script>

<template>
  <Fps />
  <ul class="fixed pointer-events-auto bottom-8 right-2">
    <li>
      <button @click="() => console.log(serverSession)">
        Debug server session
      </button>
    </li>
    <li>
      <button @click="() => console.log(clientSession)">
        Debug client session
      </button>
    </li>
  </ul>

  <BattleUi />
</template>
