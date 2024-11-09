<script lang="ts" setup>
import { ClientSession, ServerSession } from '@game/engine';
import { useBattleStore } from './battle.store';
import BoardCell from '@/board/components/BoardCell.vue';
import { config } from '@/utils/config';
import IsoWorld from '@/iso/components/IsoWorld.vue';
import IsoCamera from '@/iso/components/IsoCamera.vue';

definePage({
  name: 'Battle'
});

const serverSession = new ServerSession({
  rngSeed: 'test-seed',
  mapId: 'testMap1v1',
  teams: []
});
const clientSession = new ClientSession({
  rngValues: [...serverSession.game.rngSystem.values],
  mapId: 'testMap1v1',
  teams: []
});

const battleStore = useBattleStore();
battleStore.init(clientSession);
</script>

<template>
  <IsoWorld
    v-if="battleStore.session"
    :angle="0"
    :rotation-center="{
      x: Math.round(battleStore.session.game.boardSystem.width / 2),
      y: Math.round(battleStore.session.game.boardSystem.height / 2)
    }"
    :tile-size="config.TILE_SIZE"
  >
    <IsoCamera
      :width="battleStore.session.game.boardSystem.width"
      :height="battleStore.session.game.boardSystem.height"
    >
      <BoardCell v-for="cell in battleStore.state.cells" :key="cell.id" :cell />
    </IsoCamera>
  </IsoWorld>
</template>
