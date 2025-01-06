<script setup lang="ts">
import { UI_MODES, useBattleUiStore } from '@/pages/battle/battle-ui.store';
import BoardCellSprite from './BoardCellSprite.vue';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';
import BoardCellHighlights from './BoardCellHighlights.vue';
import type { CellViewModel } from '../models/cell.model';
import {
  useBattleStore,
  usePathHelpers,
  useUserPlayer
} from '@/pages/battle/battle.store';
import { match } from 'ts-pattern';
import { PTransition, External, type ContainerInst } from 'vue3-pixi';
import BoardCellLightVFX from './BoardCellLightVFX.vue';
import Card from '@/card/components/Card.vue';
import { useTimeoutFn } from '@vueuse/core';
import { config } from '@/utils/config';
import {
  autoPlacement,
  autoUpdate,
  shift,
  useFloating
} from '@floating-ui/vue';
import Obstacle from './Obstacle.vue';
import ObstacleCard from '@/card/components/ObstacleCard.vue';
import { useCamera } from '../composables/useCamera';

const { cell } = defineProps<{ cell: CellViewModel }>();
const emit = defineEmits<{ ready: [] }>();
const ui = useBattleUiStore();
const battle = useBattleStore();
const player = useUserPlayer();
const isHovered = computed(() => ui.hoveredCell?.equals(cell.getCell()));

const camera = useCamera();
const pathHelpers = usePathHelpers();

const spawnAnimation = (container: ContainerInst) => {
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
      x: cell.screenPosition.x + camera.offset.value.x,
      y: cell.screenPosition.y + camera.offset.value.y
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
  1000,
  {
    immediate: false
  }
);
watch(isHovered, hovered => {
  if (!hovered) {
    isCardDisplayed.value = false;
    showCardTimeout.stop();
  } else if (cell.unit || cell.obstacle) {
    showCardTimeout.start();
  }
});

const cellUiRoot = document.body;
</script>

<template>
  <container
    :x="cell.screenPosition.x"
    :y="cell.screenPosition.y"
    @pointerenter="ui.hoverAt(cell)"
    @pointerleave="ui.unHover()"
    @pointerup="
      () => {
        if (camera.isDragging.value) return;
        if (!ui.mode) return;

        match(ui.mode)
          .with(UI_MODES.BASIC, () => {
            const canSelect = cell.unit && cell.unit.player.equals(player);
            if (canSelect) {
              ui.selectUnit(cell.unit!);
              return;
            }

            if (!ui.selectedUnit) return;

            if (pathHelpers.canMoveTo(ui.selectedUnit, cell)) {
              return battle.dispatch({
                type: 'move',
                payload: {
                  x: cell.x,
                  y: cell.y,
                  z: cell.z,
                  unitId: ui.selectedUnit.id
                }
              });
            }

            if (ui.selectedUnit.canAttackAt(cell)) {
              return battle.dispatch({
                type: 'attack',
                payload: {
                  x: cell.x,
                  y: cell.y,
                  z: cell.z,
                  unitId: ui.selectedUnit.id
                }
              });
            }

            ui.unselectUnit();
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
        <Obstacle v-if="cell.obstacle" :obstacle="cell.obstacle" />
        <BoardCellLightVFX :cell="cell" />
      </container>
    </PTransition>
  </container>
  <External
    :root="cellUiRoot"
    v-if="(cell.unit || cell.obstacle) && isCardDisplayed"
  >
    <Transition appear>
      <div ref="floating" class="card-wrapper" :style="floatingCardStyle">
        <Card v-if="cell.unit" :card="cell.unit.card" />
        <ObstacleCard v-else-if="cell.obstacle" :obstacle="cell.obstacle" />
      </div>
    </Transition>
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
