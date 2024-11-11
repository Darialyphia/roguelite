<script setup lang="ts">
import { PTransition } from 'vue3-pixi';
import { useActiveUnit, useBattleStore } from '@/pages/battle/battle.store';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import type { CellViewModel } from '../models/cell.model';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';

const { cell } = defineProps<{ cell: CellViewModel }>();

const battleStore = useBattleStore();
const activeUnit = useActiveUnit();
const ui = useBattleUiStore();

const canMove = computed(() => {
  return activeUnit.value?.getUnit().canMoveTo(cell);
});

const isOnPath = computed(() => {
  if (!activeUnit.value) return false;
  if (!ui.hoveredCell) return false;
  if (!activeUnit.value.getUnit().canMoveTo(ui.hoveredCell)) return false;

  const path = activeUnit.value.getUnit().getPathTo(ui.hoveredCell);

  return path?.path.some(point => point.equals(cell));
});

const tag = computed(() => {
  if (
    battleStore.state.phase !== GAME_PHASES.BATTLE ||
    battleStore.isPlayingFx
  ) {
    return null;
  }

  if (isOnPath.value) {
    return 'movement-path';
  }
  if (canMove.value) {
    return 'movement';
  }

  return null;
});
</script>

<template>
  <PTransition
    appear
    :duration="{ enter: 200, leave: 200 }"
    :before-enter="{ alpha: 0 }"
    :enter="{ alpha: 1 }"
    :leave="{ alpha: 0 }"
  >
    <UiAnimatedSprite v-if="tag" assetId="tile-highlights" :tag="tag" />
  </PTransition>
</template>
