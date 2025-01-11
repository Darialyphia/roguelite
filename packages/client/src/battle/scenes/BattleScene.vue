<script lang="ts" setup>
import Board from '@/board/scenes/Board.vue';
import { config } from '@/utils/config';
import { useKeyboardControl } from '@/shared/composables/useKeyboardControl';
import { useSettingsStore } from '@/shared/composables/useSettings';
import {
  UI_MODES,
  useBattleUiStore
} from '../../battle/stores/battle-ui.store';
import { until } from '@vueuse/core';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import Camera from '@/board/scenes/Camera.vue';
import { provideCamera } from '@/board/composables/useCamera';
import { useBattleStore } from '../stores/battle.store';

const battleStore = useBattleStore();
const settingsStore = useSettingsStore();
const uiStore = useBattleUiStore();

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
const camera = provideCamera();
until(() => battleStore.state.phase === GAME_PHASES.BATTLE)
  .toBeTruthy()
  .then(() => {
    camera.viewport.value?.animate({
      scale: config.INITIAL_ZOOM,
      time: 1500,
      ease(t: number, b: number, c: number, d: number) {
        if ((t /= d / 2) < 1) {
          return (c / 2) * t * t + b;
        } else {
          return (-c / 2) * (--t * (t - 2) - 1) + b;
        }
      }
    });
  });
</script>

<template>
  <container
    v-if="battleStore.session && battleStore.isReady"
    @pointerup="
      (e: any) => {
        if (e.target !== camera.viewport.value) return;
        uiStore.unselectUnit();
        if (uiStore.mode !== UI_MODES.PLAY_CARD) return;
        uiStore.unselectCard();
      }
    "
  >
    <Camera
      :width="battleStore.session.game.boardSystem.width"
      :height="battleStore.session.game.boardSystem.height"
      v-slot="{ worldSize }"
    >
      <Board :world-size="worldSize" />
    </Camera>

    <Layer :ref="(layer: any) => ui.registerLayer(layer, 'scene')" />
    <Layer :ref="(layer: any) => ui.registerLayer(layer, 'fx')" />
    <Layer :ref="(layer: any) => ui.registerLayer(layer, 'ui')" />
  </container>
</template>
