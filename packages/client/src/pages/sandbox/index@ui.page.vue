<script setup lang="ts">
import Fps from '@/shared/components/Fps.vue';
import { ClientSession, ServerSession } from '@game/engine';
import { GAME_EVENTS, type GameOptions } from '@game/engine/src/game/game';
import { useBattleEvent, useBattleStore } from '@/battle/stores/battle.store';
import BattleUi from '@/battle/components/BattleUi.vue';
import { premadeDecks } from '@/utils/premade-decks';
import UiButton from '@/ui/components/UiButton.vue';

definePage({
  name: 'Sandbox'
});

const battleStore = useBattleStore();

const decks = ref<any[]>([null, null]);
const isStarted = ref(false);

let serverSession: ServerSession;
let clientSession: ClientSession;
const start = () => {
  const options: Pick<GameOptions, 'mapId' | 'teams'> = {
    mapId: '1v1',
    teams: [
      [{ id: 'player1', name: 'Player 1', deck: decks.value[0].deck }],
      [{ id: 'player2', name: 'Player 2', deck: decks.value[1].deck }]
    ]
  };
  serverSession = new ServerSession({
    ...options,
    rngSeed: `sandbox_${Date.now()}`
  });
  serverSession.initialize();
  clientSession = new ClientSession(options);
  clientSession.initialize([...serverSession.game.rngSystem.values]);

  battleStore.init(
    clientSession,
    input => {
      serverSession.dispatch(input);
    },
    'player1'
  );
  serverSession.subscribe(async (input, opts) => {
    clientSession.dispatch(input, opts);
  });

  isStarted.value = true;
};

useBattleEvent(GAME_EVENTS.PLAYER_START_TURN, async ({ player }) => {
  battleStore.playerId = player.id;
});
useBattleEvent(GAME_EVENTS.PLAYER_MULLIGAN, async ({ player }) => {
  battleStore.playerId = player.opponents[0].id;
});
</script>

<template>
  <div v-if="!isStarted" class="pointer-events-auto">
    <fieldset>
      <legend>Player 1 deck</legend>
      <label v-for="deck in premadeDecks" :key="deck.name">
        <input type="radio" v-model="decks[0]" :value="deck" />
        {{ deck.name }}
      </label>
    </fieldset>
    <fieldset>
      <legend>Player 2 deck</legend>
      <label v-for="deck in premadeDecks" :key="deck.name">
        <input type="radio" v-model="decks[1]" :value="deck" />
        {{ deck.name }}
      </label>
    </fieldset>

    <UiButton
      :disabled="!decks[0] || !decks[1]"
      class="primary-button"
      @click="start"
    >
      Start
    </UiButton>
  </div>
  <template v-else>
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
</template>
