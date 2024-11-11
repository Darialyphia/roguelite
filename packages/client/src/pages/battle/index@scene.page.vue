<script lang="ts" setup>
import { useBattleStore } from './battle.store';
import Board from '@/board/components/Board.vue';
import { config } from '@/utils/config';
import IsoWorld from '@/iso/components/IsoWorld.vue';
import IsoCamera from '@/iso/components/IsoCamera.vue';
import { useKeyboardControl } from '@/shared/composables/useKeyboardControl';
import { useSettingsStore } from '@/shared/composables/useSettings';

definePage({
  name: 'Battle'
});
const battleStore = useBattleStore();
const settingsStore = useSettingsStore();
const isoWorld = useTemplateRef('isoWorld');

useKeyboardControl(
  'keydown',
  () => settingsStore.settings.bindings.rotateCW.control,
  () => isoWorld.value?.camera.rotateCW()
);
useKeyboardControl(
  'keydown',
  () => settingsStore.settings.bindings.rotateCCW.control,
  () => isoWorld.value?.camera.rotateCCW()
);
useKeyboardControl(
  'keydown',
  () => settingsStore.settings.bindings.endTurn.control,
  () =>
    battleStore.dispatch({
      type: 'endTurn',
      payload: {}
    })
);
</script>

<template>
  <IsoWorld
    ref="isoWorld"
    v-if="battleStore.session && battleStore.isReady"
    :angle="0"
    :width="battleStore.session.game.boardSystem.width"
    :height="battleStore.session.game.boardSystem.height"
    :tile-size="config.TILE_SIZE"
  >
    <IsoCamera
      :width="battleStore.session.game.boardSystem.width"
      :height="battleStore.session.game.boardSystem.height"
    >
      <Board />
    </IsoCamera>
  </IsoWorld>
</template>
