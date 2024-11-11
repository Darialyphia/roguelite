<script lang="ts" setup>
import BoardCell from '@/board/components/BoardCell.vue';
import Unit from '@/unit/components/Unit.vue';
import { useBattleStore } from '@/pages/battle/battle.store';

const battleStore = useBattleStore();
</script>

<template>
  <BoardCell v-for="cell in battleStore.state.cells" :key="cell.id" :cell />

  <Unit v-for="unit in battleStore.state.units" :key="unit.id" :unit="unit" />
</template>
