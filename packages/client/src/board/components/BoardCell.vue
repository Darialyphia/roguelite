<script setup lang="ts">
import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import BoardCellSprite from './BoardCellSprite.vue';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';
import BoardCellHighlights from './BoardCellHighlights.vue';
import type { CellViewModel } from '../models/cell.model';
import { useBattleStore } from '@/pages/battle/battle.store';

const { cell } = defineProps<{ cell: CellViewModel }>();

const ui = useBattleUiStore();
const battle = useBattleStore();

const isHovered = computed(() => ui.hoveredCell?.equals(cell.getCell()));

const move = () => {
  if (battle.state.activeUnit?.getUnit().canMoveTo(cell.getCell())) {
    battle.dispatch({
      type: 'move',
      payload: {
        x: cell.x,
        y: cell.y,
        z: cell.z
      }
    });
  }
};
</script>

<template>
  <AnimatedIsoPoint
    :position="cell"
    @pointerenter="ui.hoverAt(cell)"
    @pointerleave="ui.unHover()"
    @pointerup="move"
  >
    <BoardCellSprite :cell="cell" />
    <BoardCellHighlights :cell="cell" />
    <UiAnimatedSprite assetId="hovered-cell" v-if="isHovered" />
  </AnimatedIsoPoint>
</template>
