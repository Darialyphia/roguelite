<script setup lang="ts">
import Fps from '@/shared/components/Fps.vue';
import { useBattleStore, useUserPlayer } from './battle.store';
import { ClientSession, ServerSession } from '@game/engine';
import type { GameOptions } from '@game/engine/src/game/game';
import UnitIcon from '@/unit/components/UnitIcon.vue';
import { useBattleUiStore } from './battle-ui.store';

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

const ui = useBattleUiStore();
const userPlayer = useUserPlayer();
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

    <section class="turn-order">
      <UnitIcon
        v-for="unit in battleStore.state.turnOrderUnits"
        :key="unit.id"
        :unit="unit"
        class="pointer-events-auto"
        :class="{
          highlighted: ui.highlightedUnit?.equals(unit),
          ally: unit.getUnit().player.isAlly(userPlayer.getPlayer()),
          enemy: unit.getUnit().player.isEnemy(userPlayer.getPlayer())
        }"
        @mouseenter="ui.highlightUnit(unit)"
        @mouseleave="ui.unhighlight()"
      />
    </section>
  </div>
</template>

<style scoped lang="postcss">
.layout {
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr auto;
}

.turn-order {
  grid-row: 3;
  display: flex;
  gap: var(--size-1);
  align-items: flex-end;
  margin: var(--size-3);

  & > :not(:first-of-type) {
    --unit-icon-size: calc(96px * 0.75);
  }

  .ally {
    --unit-icon-bg: linear-gradient(135deg, #004ea6, #00bcff);
  }

  .enemy {
    --unit-icon-bg: linear-gradient(135deg, #56002d, #a2005b);
  }

  .highlighted {
    outline: solid 1px white;
    box-shadow: 0 0 8px 2px hsl(0 0 100% / 0.4);
    filter: brightness(125%) contrast(110%);
  }
}
</style>
