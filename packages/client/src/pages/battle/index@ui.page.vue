<script setup lang="ts">
import Fps from '@/shared/components/Fps.vue';
import { useBattleStore } from './battle.store';
import { ClientSession, ServerSession } from '@game/engine';
import type { GameOptions } from '@game/engine/src/game/game';

definePage({
  name: 'Battle'
});

const options: Pick<GameOptions, 'mapId' | 'teams'> = {
  mapId: 'testMap1v1',
  teams: [
    [
      {
        id: 'player',
        units: [
          {
            blueprintId: 'test-unit',
            deck: [
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' }
            ],
            spriteParts: {
              armor: 'tier3',
              helm: 'tier3',
              weapon: 'tier3',
              vfx: 'tier3'
            },
            position: { x: 6, y: 0, z: 0 }
          }
        ],
        roster: []
      }
    ],
    [
      {
        id: 'ai',
        roster: [],
        units: [
          {
            blueprintId: 'test-unit',
            deck: [
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' }
            ],
            spriteParts: {
              armor: 'tier4',
              helm: null,
              weapon: 'tier4',
              vfx: 'tier4'
            },
            position: { x: 7, y: 0, z: 0 }
          }
        ]
      }
    ]
  ]
};
const serverSession = new ServerSession({
  rngSeed: 'test-seed',
  ...options
});
const clientSession = new ClientSession(options);

const battleStore = useBattleStore();
const start = async () => {
  await serverSession.initialize();
  await clientSession.initialize([...serverSession.game.rngSystem.values]);

  battleStore.init(clientSession, input => {
    serverSession.dispatch(input);
  });
  serverSession.subscribe((input, opts) => {
    clientSession.dispatch(input, opts);
  });
};
start();
</script>

<template>
  <Fps />
  <nav class="ml-11 mt-4">
    <ul class="flex gap-2 pointer-events-auto">
      <li>
        <RouterLink :to="{ name: 'Home' }">Back to Home</RouterLink>
      </li>
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
      <li>
        <button @click="battleStore.dispatch({ type: 'endTurn', payload: {} })">
          End turn
        </button>
      </li>
    </ul>
  </nav>
  <div>{{ battleStore.state.phase }}</div>
</template>

<style scoped lang="postcss"></style>
