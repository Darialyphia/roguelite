<script setup lang="ts">
import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import { UI_MODES, useBattleUiStore } from '@/pages/battle/battle-ui.store';
import BoardCellSprite from './BoardCellSprite.vue';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';
import BoardCellHighlights from './BoardCellHighlights.vue';
import type { CellViewModel } from '../models/cell.model';
import {
  useBattleStore,
  useGame,
  usePathHelpers
} from '@/pages/battle/battle.store';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { match } from 'ts-pattern';
import { PTransition, External } from 'vue3-pixi';
import type { Container } from 'pixi.js';
import BoardCellLightVFX from './BoardCellLightVFX.vue';
import Card from '@/card/components/Card.vue';
import { useTimeoutFn } from '@vueuse/core';
import { config } from '@/utils/config';
import { useIsoPoint } from '@/iso/composables/useIsoPoint';
import {
  autoPlacement,
  autoUpdate,
  shift,
  useFloating
} from '@floating-ui/vue';

const { cell } = defineProps<{ cell: CellViewModel }>();
const emit = defineEmits<{ ready: [] }>();
const ui = useBattleUiStore();
const battle = useBattleStore();

const isHovered = computed(() => ui.hoveredCell?.equals(cell.getCell()));

const camera = useIsoCamera();
const pathHelpers = usePathHelpers();

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

const isCardDisplayed = ref(false);
const { isoPosition } = useIsoPoint({
  position: computed(() => cell)
});
const virtualEl = ref({
  getBoundingClientRect() {
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: 20,
      right: 20,
      width: 20,
      height: 20
    };
  }
});
const floating = useTemplateRef('floating');
const { x, y, strategy } = useFloating(virtualEl, floating, {
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [shift(), autoPlacement()]
});
const floatingCardStyle = computed(() => ({
  left: `${x.value ?? 0}px`,
  top: `${y.value ?? 0}px`,
  position: strategy.value
}));
const showCardTimeout = useTimeoutFn(
  () => {
    isCardDisplayed.value = true;
    const viewport = camera.viewport.value;
    if (!viewport) return;

    const position = viewport.toScreen({
      x: isoPosition.value.x + camera.offset.value.x,
      y: isoPosition.value.y + camera.offset.value.y
    });
    const width = config.TILE_SIZE.x;
    const height = config.TILE_SIZE.y + config.TILE_SIZE.z;

    virtualEl.value = {
      getBoundingClientRect() {
        return {
          x: position.x,
          y: position.y,
          top: position.y,
          left: position.x,
          bottom: position.y + height,
          right: position.x + width,
          width,
          height
        };
      }
    };
  },
  500,
  {
    immediate: false
  }
);
watch(isHovered, hovered => {
  if (!hovered) {
    isCardDisplayed.value = false;
    showCardTimeout.stop();
  } else if (cell.unit) {
    showCardTimeout.start();
  }
});
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
        <UiAnimatedSprite assetId="hovered-cell" v-if="isHovered" />
        <BoardCellLightVFX :cell="cell" />
      </container>
    </PTransition>
  </AnimatedIsoPoint>
  <External>
    <Teleport to="body">
      <Transition>
        <div
          ref="floating"
          class="card-wrapper"
          :style="floatingCardStyle"
          v-if="cell.unit && isCardDisplayed"
        >
          <Card :card="cell.unit.card" />
        </div>
      </Transition>
    </Teleport>
  </External>
</template>

<style lang="postcss" scoped>
.card-wrapper {
  z-index: 999;
  pointer-events: none;

  &.v-enter-active {
    transition: opacity 0.2s var(--ease-2);
  }

  &.v-enter-from {
    opacity: 0;
  }
}
</style>
