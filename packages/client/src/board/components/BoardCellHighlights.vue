<script setup lang="ts">
import { PTransition } from 'vue3-pixi';
import { useActiveUnit, useBattleStore } from '@/pages/battle/battle.store';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import type { CellViewModel } from '../models/cell.model';
import { UI_MODES, useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { isDefined } from '@game/shared';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';

const { cell } = defineProps<{ cell: CellViewModel }>();

const battleStore = useBattleStore();
const activeUnit = useActiveUnit();
const camera = useIsoCamera();
const ui = useBattleUiStore();

const isWithinCardRange = computed(() => {
  if (!ui.selectedCard) return;

  return ui.selectedCard.isWithinRange(cell, ui.cardTargets.length);
});

const canTarget = computed(() => {
  if (!ui.selectedCard) return;

  return ui.isTargetValid(cell);
});

const canMove = computed(() => {
  return (
    ui.mode === UI_MODES.BASIC && activeUnit.value?.getUnit().canMoveTo(cell)
  );
});

const canAttack = computed(() => {
  return (
    ui.mode === UI_MODES.BASIC &&
    isDefined(cell.getCell().unit) &&
    activeUnit.value?.getUnit().canAttackAt(cell)
  );
});

const isOnPath = computed(() => {
  if (ui.mode !== UI_MODES.BASIC) return false;
  if (camera.isDragging.value) return false;
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

  if (canTarget.value) {
    return 'targeting-valid';
  }
  if (isWithinCardRange.value) {
    return 'targeting';
  }
  if (canAttack.value) {
    return 'danger';
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
    <UiAnimatedSprite
      v-if="tag"
      assetId="tile-highlights"
      :tag="tag"
      :anchor="0.5"
    />
  </PTransition>
</template>
