<script setup lang="ts">
import Fps from '@/shared/components/Fps.vue';
import {
  AI_ID,
  PLAYER_ID,
  useBattleStore,
  useGame,
  useUserPlayer
} from './battle.store';
import { ClientSession, ServerSession } from '@game/engine';
import type { GameOptions } from '@game/engine/src/game/game';
import ActionWheel from '@/player/components/ActionWheel.vue';
import Hand from '@/card/components/Hand.vue';
import PlayedCard from '@/card/components/PlayedCard.vue';
import BattleLog from '@/player/components/BattleLog.vue';
import { AI } from '@game/engine/src/ai/ai';
import type { EntityId } from '@game/engine/src/entity';
import { waitFor } from '@game/shared';
import type { SerializedInput } from '@game/engine/src/input/input-system';
import { until } from '@vueuse/core';
import MulliganOverlay from '@/card/components/MulliganOverlay.vue';
import PlayerBattleInfos from '@/player/components/PlayerBattleInfos.vue';
import PlayerBattleInfosV2 from '@/player/components/PlayerBattleInfosV2.vue';
import { makePlayerViewModel } from '@/player/player.model';
import OpponentHand from '@/card/components/OpponentHand.vue';
import TurnIndicator from '@/player/components/TurnIndicator.vue';
import AIWorker from '@/ai.worker?worker';

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
            { blueprintId: 'red-combustion' },
            { blueprintId: 'red-combustion' },
            { blueprintId: 'red-combustion' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-berserk' },
            { blueprintId: 'red-berserk' },
            { blueprintId: 'red-berserk' },
            { blueprintId: 'red-avenger' },
            { blueprintId: 'red-avenger' },
            { blueprintId: 'red-avenger' },
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
        id: AI_ID,
        name: 'AI',
        deck: {
          cards: [
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-avenger' },
            { blueprintId: 'red-avenger' },
            { blueprintId: 'red-avenger' },
            { blueprintId: 'red-berserk' },
            { blueprintId: 'red-berserk' },
            { blueprintId: 'red-berserk' },
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
    ]
  ]
};
const SEED = 'Winners win';
const serverOptions = {
  rngSeed: SEED,
  ...options
};

const serverSession = new ServerSession(serverOptions);
const clientSession = new ClientSession(options);

const battleStore = useBattleStore();

const userPlayer = useUserPlayer();
const game = useGame();
const opponent = computed(() =>
  makePlayerViewModel(game.value, userPlayer.value.getPlayer().opponents[0])
);

const start = () => {
  serverSession.initialize();
  clientSession.initialize([...serverSession.game.rngSystem.values]);
  const ai = new AI(serverSession, AI_ID as EntityId);

  const aiWorker = new AIWorker();
  aiWorker.postMessage({
    type: 'init',
    payload: { options: serverOptions, playerId: AI_ID }
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

  battleStore.init(clientSession, input => {
    serverSession.dispatch(input);
  });
  serverSession.subscribe((input, opts) => {
    clientSession.dispatch(input, opts);
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
  <div class="layout">
    <MulliganOverlay />
    <PlayedCard />
    <TurnIndicator />
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

    <header>
      <PlayerBattleInfosV2 :player="userPlayer" class="player-battle-infos" />
      <OpponentHand class="opponent-hand" />
      <PlayerBattleInfosV2
        :player="opponent"
        class="opponent-battle-infos"
        inverted
      />
    </header>

    <BattleLog class="pointer-events-auto" />

    <footer class="bottom-row">
      <ActionWheel />
      <Hand class="hand" />
      <div />
    </footer>
  </div>
</template>

<style scoped lang="postcss">
.layout {
  display: grid;
  height: 100dvh;
  grid-template-rows: 1fr 1fr;
  user-select: none;
}

header,
footer {
  display: grid;
  grid-template-columns: minmax(0, 0.25fr) minmax(0, 0.5fr) minmax(0, 0.25fr);
}

header {
  padding-top: var(--size-3);
}

.action-wheel {
  align-self: end;
  margin-block-end: var(--size-6);
  margin-inline-start: var(--size-6);
}

.hand,
.opponent-hand {
  width: 100%;
  justify-self: center;
}

.opponent-hand {
  margin-top: -350px;
}

.player-battle-infos {
  align-self: start;
  justify-self: start;
  margin-block-end: var(--size-6);
  margin-inline-start: var(--size-6);
}

.opponent-battle-infos {
  justify-self: end;
  align-self: start;
  margin-inline-end: var(--size-6);
}
</style>
