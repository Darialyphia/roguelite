<script lang="ts" setup>
import BoardCell from '@/board/components/BoardCell.vue';
import Unit from '@/unit/components/Unit.vue';
import { useBattleStore } from '@/pages/battle/battle.store';
import { until } from '@vueuse/core';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import AmbientLight from '@/board/components/AmbientLight.vue';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { providePointLights } from '@/vfx/usePointLight';

const { worldSize } = defineProps<{
  worldSize: { width: number; height: number };
}>();
const battleStore = useBattleStore();
const ui = useBattleUiStore();
const readyCells = ref(0);
const camera = useIsoCamera();
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

  <Unit v-for="unit in battleStore.state.units" :key="unit.id" :unit="unit" />

  <AmbientLight :world-size="worldSize" />
</template>
