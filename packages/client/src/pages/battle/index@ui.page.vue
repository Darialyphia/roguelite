<script setup lang="ts">
import Fps from '@/shared/components/Fps.vue';
import { useBattleStore } from './battle.store';
import { ClientSession, ServerSession } from '@game/engine';
import type { GameOptions } from '@game/engine/src/game/game';
import TurnOrder from '@/unit/components/TurnOrder.vue';
import Hand from '@/card/Hand.vue';
import UnitStats from '@/unit/components/UnitStats.vue';
import PlayedCard from '@/card/PlayedCard.vue';

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
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'arcane-intellect' },
              { blueprintId: 'arcane-intellect' },
              { blueprintId: 'arcane-intellect' },
              { blueprintId: 'arcane-intellect' },
              { blueprintId: 'arcane-intellect' }
            ],
            spriteParts: {
              armor: 'tier3',
              helm: 'tier3',
              weapon: 'tier3',
              vfx: 'tier3'
            },
            position: { x: 1, y: 0, z: 0 }
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
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'magic-missile' },
              { blueprintId: 'arcane-intellect' },
              { blueprintId: 'arcane-intellect' },
              { blueprintId: 'arcane-intellect' },
              { blueprintId: 'arcane-intellect' },
              { blueprintId: 'arcane-intellect' }
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
  <div class="layout">
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
          <button
            @click="battleStore.dispatch({ type: 'endTurn', payload: {} })"
          >
            End turn
          </button>
        </li>
      </ul>
    </nav>
    <UnitStats
      :unit="battleStore.state.activeUnit"
      class="active-unit-stats pointer-events-auto"
      v-if="battleStore.state.activeUnit"
    />
    <TurnOrder class="turn-order pointer-events-auto" />
    <Hand class="hand pointer-events-auto" />
    <PlayedCard />
  </div>
</template>

<style scoped lang="postcss">
.layout {
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  user-select: none;
}

nav {
  grid-column: 1 / -1;
}

.active-unit-stats {
  grid-row: 2;
  justify-self: start;
  align-self: start;
  margin-block-start: var(--size-5);
  margin-inline-start: 0;
}
.turn-order {
  grid-row: 3;
  align-self: end;
}

.hand {
  grid-row: 3;
  max-width: 100%;
}
</style>
