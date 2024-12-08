<script lang="ts" setup>
import { useBattleStore } from './battle.store';
import Board from '@/board/components/Board.vue';
import { config } from '@/utils/config';
import IsoWorld from '@/iso/components/IsoWorld.vue';
import IsoCamera from '@/iso/components/IsoCamera.vue';
import { useKeyboardControl } from '@/shared/composables/useKeyboardControl';
import { useSettingsStore } from '@/shared/composables/useSettings';
import { UI_MODES, useBattleUiStore } from './battle-ui.store';
import type { Layer } from '@pixi/layers';

definePage({
  name: 'Battle'
});

const battleStore = useBattleStore();
const settingsStore = useSettingsStore();
const uiStore = useBattleUiStore();
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
  () => settingsStore.settings.bindings.centerOnActiveUnit.control,
  () => {
    if (!battleStore.state.activeUnit) return;
    if (!isoWorld.value) return;

    const { x, y } = isoWorld.value?.grid.toIso(
      battleStore.state.activeUnit?.position
    );
    isoWorld.value.camera.viewport.value?.animate({
      position: {
        x: x + isoWorld.value.camera.offset.value.x,
        y: y + isoWorld.value.camera.offset.value.y
      },
      time: 250,
      ease: 'easeOutSine'
    });
  }
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
const ui = useBattleUiStore();
</script>

<template>
  <IsoWorld
    ref="isoWorld"
    v-if="battleStore.session && battleStore.isReady"
    :angle="0"
    :width="battleStore.session.game.boardSystem.width"
    :height="battleStore.session.game.boardSystem.height"
    :tile-size="config.TILE_SIZE"
    @pointerup="
      e => {
        if (e.target !== isoWorld?.camera.viewport.value) return;
        uiStore.unselectUnit();
        if (uiStore.mode !== UI_MODES.PLAY_CARD) return;
        uiStore.unselectCard();
      }
    "
  >
    <IsoCamera
      :width="battleStore.session.game.boardSystem.width"
      :height="battleStore.session.game.boardSystem.height"
      v-slot="{ worldSize }"
    >
      <Board :world-size="worldSize" />
    </IsoCamera>

    <Layer :ref="(layer: any) => ui.registerLayer(layer, 'scene')" />
    <Layer :ref="(layer: any) => ui.registerLayer(layer, 'fx')" />
    <Layer :ref="(layer: any) => ui.registerLayer(layer, 'ui')" />
  </IsoWorld>
</template>
