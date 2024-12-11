<script setup lang="ts">
import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import { UI_MODES, useBattleUiStore } from '@/pages/battle/battle-ui.store';
import BoardCellSprite from './BoardCellSprite.vue';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';
import BoardCellHighlights from './BoardCellHighlights.vue';
import type { CellViewModel } from '../models/cell.model';
import { useBattleStore, useGame } from '@/pages/battle/battle.store';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { match } from 'ts-pattern';
import { PTransition } from 'vue3-pixi';
import type { Container } from 'pixi.js';
import BoardCellLightVFX from './BoardCellLightVFX.vue';

const { cell } = defineProps<{ cell: CellViewModel }>();
const emit = defineEmits<{ ready: [] }>();
const ui = useBattleUiStore();
const battle = useBattleStore();

const isHovered = computed(() => ui.hoveredCell?.equals(cell.getCell()));

const camera = useIsoCamera();

const spawnAnimation = (container: Container) => {
  container.y = -400;
  container.alpha = 0;
  gsap.to(container, {
    y: 0,
    duration: 1,
    ease: Bounce.easeOut,
    delay: Math.random() * 0.5,
    onStart() {
      container.alpha = 1;
    },
    onComplete() {
      emit('ready');
    }
  });
};
</script>

<template>
  <AnimatedIsoPoint
    :position="cell"
    @pointerenter="ui.hoverAt(cell)"
    @pointerleave="ui.unHover()"
    @pointerup="
      e => {
        if (camera.isDragging.value) return;
        if (!ui.mode) return;

        const activeUnit = battle.state.activeUnit?.getUnit();
        if (!activeUnit) return;

        if (e.button === 2) {
          if (cell.unit) {
            ui.selectUnit(cell.unit);
          } else {
            ui.unselectUnit();
          }
          return;
        }

        match(ui.mode)
          .with(UI_MODES.BASIC, () => {
            if (activeUnit.canMoveTo(cell.getCell())) {
              return battle.dispatch({
                type: 'move',
                payload: {
                  x: cell.x,
                  y: cell.y,
                  z: cell.z
                }
              });
            }

            if (activeUnit.canAttackAt(cell.getCell())) {
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

              if (!ui.canPlayCard()) return;
              battle.dispatch({
                type: 'playCard',
                payload: {
                  index: ui.selectedCardIndex!,
                  targets: ui.cardTargets
                }
              });
            }

            ui.unselectCard();
            ui.unselectUnit();
          })
          .exhaustive();
      }
    "
  >
    <PTransition
      appear
      :duration="{ enter: 1000, leave: 0 }"
      @enter="spawnAnimation"
    >
      <container :ref="(container: any) => ui.assignLayer(container, 'scene')">
        <BoardCellSprite :cell="cell" />
        <BoardCellHighlights :cell="cell" />
        <container
          :ref="
            (obj: any) => {
              ui.assignLayer(obj, 'ui');
            }
          "
        >
          <UiAnimatedSprite assetId="hovered-cell" v-if="isHovered" />
        </container>
        <BoardCellLightVFX :cell="cell" />
      </container>
    </PTransition>
  </AnimatedIsoPoint>
</template>
