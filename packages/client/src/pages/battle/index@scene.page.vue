<script lang="ts" setup>
import { ClientSession, ServerSession } from '@game/engine';
import { useBattleStore } from './battle.store';
import BoardCell from '@/board/components/BoardCell.vue';
import { config } from '@/utils/config';
import IsoWorld from '@/iso/components/IsoWorld.vue';
import IsoCamera from '@/iso/components/IsoCamera.vue';
import { useKeyboardControl } from '@/shared/composables/useKeyboardControl';
import { useSettingsStore } from '@/shared/composables/useSettings';

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

const settingsStore = useSettingsStore();
const isoWorld = useTemplateRef('isoWorld');
useKeyboardControl(
  () => settingsStore.settings.bindings.rotateCW.control,
  () => isoWorld.value?.camera.rotateCW()
);
useKeyboardControl(
  () => settingsStore.settings.bindings.rotateCCW.control,
  () => isoWorld.value?.camera.rotateCCW()
);
</script>

<template>
  <IsoWorld
    ref="isoWorld"
    v-if="battleStore.session"
    :angle="0"
    :width="battleStore.session.game.boardSystem.width"
    :height="battleStore.session.game.boardSystem.height"
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
