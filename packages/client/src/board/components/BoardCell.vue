<script setup lang="ts">
import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import type { CellViewModel } from '@/pages/battle/battle.store';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import BoardCellSprite from './BoardCellSprite.vue';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';
import { config } from '@/utils/config';

const { cell } = defineProps<{ cell: CellViewModel }>();

const ui = useBattleUiStore();

const isHovered = computed(() => ui.hoveredCell?.equals(cell.getCell()));
</script>

<template>
  <AnimatedIsoPoint
    :pivot="[0, config.TILE_SIZE.z]"
    :position="cell"
    @pointerenter="
      () => {
        ui.hoverAt(cell);
      }
    "
    @pointerleave="ui.unHover()"
  >
    <BoardCellSprite :cell="cell" />
    <UiAnimatedSprite assetId="hovered-cell" v-if="isHovered" />
  </AnimatedIsoPoint>
</template>
