<script setup lang="ts">
import Fps from '@/shared/components/Fps.vue';
import { ClientSession, ServerSession } from '@game/engine';
import { GAME_EVENTS, type GameOptions } from '@game/engine/src/game/game';
import { useBattleEvent, useBattleStore } from '@/battle/stores/battle.store';
import BattleUi from '@/battle/components/BattleUi.vue';

definePage({
  name: 'Sandbox'
});

const options: Pick<GameOptions, 'mapId' | 'teams'> = {
  mapId: '1v1',
  teams: [
    [
      {
        id: 'player1',
        name: 'Daria',
        deck: {
          altar: { blueprintId: 'altar' },
          cards: [
            { blueprintId: 'red-master-at-arms' },
            { blueprintId: 'red-master-at-arms' },
            { blueprintId: 'red-master-at-arms' },
            { blueprintId: 'red-bloodlust' },
            { blueprintId: 'red-bloodlust' },
            { blueprintId: 'red-bloodlust' },
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
            { blueprintId: 'red-blood-cultist-devotee' },
            { blueprintId: 'red-blood-cultist-devotee' },
            { blueprintId: 'red-blood-cultist-devotee' },
            { blueprintId: 'red-fireball' },
            { blueprintId: 'red-fireball' },
            { blueprintId: 'red-fireball' }
          ]
        }
      }
    ],
    [
      {
        id: 'player2',
        name: 'Jane',
        deck: {
          altar: { blueprintId: 'altar' },
          cards: [
            { blueprintId: 'red-master-at-arms' },
            { blueprintId: 'red-master-at-arms' },
            { blueprintId: 'red-master-at-arms' },
            { blueprintId: 'red-bloodlust' },
            { blueprintId: 'red-bloodlust' },
            { blueprintId: 'red-bloodlust' },
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
            { blueprintId: 'red-fireball' }
          ]
        }
      }
    ]
  ]
};
const SEED = `sandbox_${Date.now()}`;
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
};
start();

useBattleEvent(GAME_EVENTS.PLAYER_START_TURN, async ({ player }) => {
  battleStore.playerId = player.id;
});
useBattleEvent(GAME_EVENTS.PLAYER_MULLIGAN, async ({ player }) => {
  battleStore.playerId = player.opponents[0].id;
});
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
