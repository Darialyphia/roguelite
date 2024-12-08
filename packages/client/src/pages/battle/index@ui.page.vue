<script setup lang="ts">
import Fps from '@/shared/components/Fps.vue';
import { AI_ID, PLAYER_ID, useBattleStore } from './battle.store';
import { ClientSession, ServerSession } from '@game/engine';
import type { GameOptions } from '@game/engine/src/game/game';
import ActionWheel from '@/player/ActionWheel.vue';
import Hand from '@/card/components/Hand.vue';
import UnitStats from '@/unit/components/UnitStats.vue';
import PlayedCard from '@/card/components/PlayedCard.vue';
import BattleLog from '@/player/BattleLog.vue';
import { AI } from '@game/engine/src/ai/ai';
import type { EntityId } from '@game/engine/src/entity';
import { waitFor } from '@game/shared';
import type { SerializedInput } from '@game/engine/src/input/input-system';
import { until } from '@vueuse/core';
import { useBattleUiStore } from './battle-ui.store';
import MulliganOverlay from '@/card/components/MulliganOverlay.vue';

definePage({
  name: 'Battle'
});

const options: Pick<GameOptions, 'mapId' | 'teams'> = {
  mapId: 'testMap1v1',
  teams: [
    [
      {
        id: PLAYER_ID,
        name: 'Daria',
        deck: {
          cards: [
            { blueprintId: 'testGeneral' },
            { blueprintId: 'testUnit' },
            { blueprintId: 'testUnit' },
            { blueprintId: 'testUnit' },
            { blueprintId: 'testUnit' },
            { blueprintId: 'testUnit' },
            { blueprintId: 'testSpell' },
            { blueprintId: 'testSpell' },
            { blueprintId: 'testSpell' },
            { blueprintId: 'testSpell' },
            { blueprintId: 'testSpell' }
          ]
        }
      }
    ],
    [
      {
        id: AI_ID,
        name: 'AI',
        deck: {
          cards: [
            { blueprintId: 'testGeneral' },
            { blueprintId: 'testUnit' },
            { blueprintId: 'testUnit' },
            { blueprintId: 'testUnit' },
            { blueprintId: 'testUnit' },
            { blueprintId: 'testUnit' },
            { blueprintId: 'testSpell' },
            { blueprintId: 'testSpell' },
            { blueprintId: 'testSpell' },
            { blueprintId: 'testSpell' },
            { blueprintId: 'testSpell' }
          ]
        }
      }
    ]
  ]
};
const serverSession = new ServerSession({
  rngSeed: '123',
  ...options
});
const clientSession = new ClientSession(options);

const battleStore = useBattleStore();
const uiStore = useBattleUiStore();

const start = () => {
  serverSession.initialize();
  clientSession.initialize([...serverSession.game.rngSystem.values]);
  const ai = new AI(serverSession, AI_ID as EntityId);

  const handleAi = async (input: SerializedInput) => {
    const aiAction = await ai.onUpdate();
    if (!aiAction) return;

    await until(() => battleStore.isPlayingFx).not.toBeTruthy();

    if (aiAction.type === 'move') {
      await waitFor(500);
    } else {
      await waitFor(500);
    }
    serverSession.dispatch(aiAction);
  };

  battleStore.init(clientSession, input => {
    serverSession.dispatch(input);
  });
  serverSession.subscribe((input, opts) => {
    clientSession.dispatch(input, opts);
    handleAi(input);
  });
};
start();
</script>

<template>
  <Fps />
  <div class="layout">
    <MulliganOverlay />
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
    <BattleLog class="pointer-events-auto" />
    <Transition>
      <UnitStats
        :unit="uiStore.selectedUnit"
        class="selected-unit-stats pointer-events-auto"
        v-if="uiStore.selectedUnit"
      />
    </Transition>
    <Hand class="hand" />
    <ActionWheel />
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

.selected-unit-stats {
  grid-row: 2;
  justify-self: end;
  align-self: start;
  margin-block-start: var(--size-5);
  margin-inline-start: 0;

  &:is(.v-enter-active, .v-leave-active) {
    transition: all 0.2s var(--ease-out-2);
  }

  &:is(.v-enter-from, .v-leave-to) {
    opacity: 0;
    transform: translateX(var(--size-9));
  }
}

.action-wheel {
  grid-row: 3;
  align-self: end;
  justify-self: end;
  margin-block-end: var(--size-9);
  margin-inline-end: var(--size-9);
}

.hand {
  grid-row: 3;
  max-width: 100%;
}
</style>
