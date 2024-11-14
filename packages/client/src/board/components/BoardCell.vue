<script setup lang="ts">
import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import { UI_MODES, useBattleUiStore } from '@/pages/battle/battle-ui.store';
import BoardCellSprite from './BoardCellSprite.vue';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';
import BoardCellHighlights from './BoardCellHighlights.vue';
import type { CellViewModel } from '../models/cell.model';
import { useBattleStore } from '@/pages/battle/battle.store';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { match } from 'ts-pattern';

const { cell } = defineProps<{ cell: CellViewModel }>();

const ui = useBattleUiStore();
const battle = useBattleStore();

const isHovered = computed(() => ui.hoveredCell?.equals(cell.getCell()));

const camera = useIsoCamera();
</script>

<template>
  <AnimatedIsoPoint
    :position="cell"
    @pointerenter="ui.hoverAt(cell)"
    @pointerleave="ui.unHover()"
    @pointerup="
      () => {
        if (camera.isDragging.value) return;
        if (!ui.mode) return;

        const _unit = battle.state.activeUnit?.getUnit();
        if (!_unit) return;

        match(ui.mode)
          .with(UI_MODES.BASIC, () => {
            if (_unit.canMoveTo(cell.getCell())) {
              return battle.dispatch({
                type: 'move',
                payload: {
                  x: cell.x,
                  y: cell.y,
                  z: cell.z
                }
              });
            }

            if (_unit.canAttackAt(cell.getCell())) {
              battle.dispatch({
                type: 'attack',
                payload: {
                  x: cell.x,
                  y: cell.y,
                  z: cell.z
                }
              });
            }
          })
          .with(UI_MODES.PLAY_CARD, () => {
            if (ui.isTargetValid(cell)) {
              ui.addCardTarget({ x: cell.x, y: cell.y, z: cell.z });
              if (ui.canPlayCard()) {
                battle.dispatch({
                  type: 'playCard',
                  payload: {
                    index: ui.selectedCardIndex,
                    targets: ui.cardTargets
                  }
                });
                ui.unselectCard();
              }
            } else {
              ui.unselectCard();
            }
          })
          .exhaustive();
      }
    "
  >
    <BoardCellSprite :cell="cell" />
    <BoardCellHighlights :cell="cell" />
    <UiAnimatedSprite assetId="hovered-cell" v-if="isHovered" />
  </AnimatedIsoPoint>
</template>
