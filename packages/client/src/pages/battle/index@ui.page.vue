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
import { makePlayerViewModel } from '@/player/player.model';
import OpponentHand from '@/card/components/OpponentHand.vue';
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
            { blueprintId: 'lancer' },
            { blueprintId: 'lancer' },
            { blueprintId: 'lancer' },
            { blueprintId: 'emperor' },
            { blueprintId: 'emperor' },
            { blueprintId: 'emperor' },
            { blueprintId: 'shaman' },
            { blueprintId: 'shaman' },
            { blueprintId: 'shaman' },
            { blueprintId: 'dancer' },
            { blueprintId: 'dancer' },
            { blueprintId: 'dancer' },
            { blueprintId: 'apprentice' },
            { blueprintId: 'apprentice' },
            { blueprintId: 'apprentice' },
            { blueprintId: 'monk' },
            { blueprintId: 'monk' },
            { blueprintId: 'monk' },
            { blueprintId: 'kings-guard' },
            { blueprintId: 'kings-guard' },
            { blueprintId: 'kings-guard' },
            { blueprintId: 'treasure-hunter' },
            { blueprintId: 'treasure-hunter' },
            { blueprintId: 'treasure-hunter' },
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
            { blueprintId: 'lancer' },
            { blueprintId: 'lancer' },
            { blueprintId: 'lancer' },
            { blueprintId: 'emperor' },
            { blueprintId: 'emperor' },
            { blueprintId: 'emperor' },
            { blueprintId: 'shaman' },
            { blueprintId: 'shaman' },
            { blueprintId: 'shaman' },
            { blueprintId: 'dancer' },
            { blueprintId: 'dancer' },
            { blueprintId: 'dancer' },
            { blueprintId: 'apprentice' },
            { blueprintId: 'apprentice' },
            { blueprintId: 'apprentice' },
            { blueprintId: 'monk' },
            { blueprintId: 'monk' },
            { blueprintId: 'monk' },
            { blueprintId: 'kings-guard' },
            { blueprintId: 'kings-guard' },
            { blueprintId: 'kings-guard' },
            { blueprintId: 'treasure-hunter' },
            { blueprintId: 'treasure-hunter' },
            { blueprintId: 'treasure-hunter' },
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
  rngSeed: 'omegalul',
  ...options
});
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

  const handleAi = async (input: SerializedInput) => {
    const aiAction = await ai.onUpdate();
    if (!aiAction) return;

    await until(() => battleStore.isPlayingFx).not.toBeTruthy();

    if (aiAction.type === 'move') {
      await waitFor(100);
    } else {
      await waitFor(300);
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
    <PlayedCard />

    <ul class="fixed pointer-events-auto top-8 left-2">
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
      <div />
      <OpponentHand class="opponent-hand" />
      <PlayerBattleInfos
        :player="opponent"
        class="opponent-battle-infos"
        inverted
      />
    </header>

    <BattleLog class="pointer-events-auto" />

    <footer class="bottom-row">
      <PlayerBattleInfos :player="userPlayer" class="player-battle-infos" />
      <Hand class="hand" />
      <ActionWheel />
    </footer>
  </div>
</template>

<style scoped lang="postcss">
.layout {
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr auto;
  user-select: none;
}

header,
footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr);
}

footer {
  grid-row: 3;
}

.action-wheel {
  align-self: end;
  justify-self: end;
  margin-block-end: var(--size-6);
  margin-inline-end: var(--size-6);
  justify-self: end;
}

.hand,
.opponent-hand {
  max-width: 100%;
  justify-self: center;
}

.opponent-hand {
  margin-top: -380px;
}

.player-battle-infos {
  align-self: end;
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
