<script lang="ts" setup>
import BoardCell from '@/board/scenes/BoardCell.vue';
import Unit from '@/unit/scenes/Unit.vue';
import { until } from '@vueuse/core';
import { useBattleUiStore } from '@/battle/stores/battle-ui.store';
import AmbientLight from '@/board/scenes/AmbientLight.vue';
import { providePointLights } from '@/vfx/usePointLight';
// import DangerArrows from '@/unit/components/DangerArrows.vue';
import { useCamera } from '../composables/useCamera';
import { useBattleStore } from '@/battle/stores/battle.store';

const { worldSize } = defineProps<{
  worldSize: { width: number; height: number };
}>();
const battleStore = useBattleStore();
const ui = useBattleUiStore();
const readyCells = ref(0);
const camera = useCamera();
providePointLights(camera);

until(computed(() => readyCells.value === battleStore.state.cells.length))
  .toBeTruthy()
  .then(() => {
    setTimeout(() => {
      ui.isBoardAppearAnimationDone = true;
    }, 300);
  });
</script>

<template>
  <BoardCell
    v-for="cell in battleStore.state.cells"
    :key="cell.id"
    :cell
    @ready="readyCells++"
  />

  <template v-if="ui.isBoardAppearAnimationDone">
    <Unit v-for="unit in battleStore.state.units" :key="unit.id" :unit="unit" />
  </template>

  <AmbientLight :world-size="worldSize" />
</template>
