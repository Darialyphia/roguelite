<script setup lang="ts">
import { Teleport } from 'vue';
import {
  useActiveUnit,
  useBattleEvent,
  useGame
} from '@/pages/battle/battle.store';
import Card from './Card.vue';
import { waitFor, type Nullable, type Point } from '@game/shared';
import { useMouse, usePageLeave } from '@vueuse/core';
import { UI_MODES, useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { config } from '@/utils/config';
import { useApplication } from 'vue3-pixi';
import { makeCardViewModel, type CardViewModel } from './card.model';

const { card } = defineProps<{ card: CardViewModel }>();
const offset = defineModel<Point>('offset', { required: true });

const activeUnit = useActiveUnit();
const ui = useBattleUiStore();

const index = computed(
  () => activeUnit.value?.hand.findIndex(c => c.equals(card))!
);

const { x, y } = useMouse();
const app = useApplication();
const isOutOfScreen = usePageLeave();
const isDragging = ref(false);
const canPlay = computed(() => activeUnit.value?.canPlayCardAt(index.value));

const onMouseDown = (e: MouseEvent) => {
  if (!canPlay.value) return;

  ui.selectCardAtIndex(index.value);
  isDragging.value = true;
  const rect = (e.target as HTMLElement).getBoundingClientRect();
  offset.value = {
    x: rect.left - x.value,
    y: rect.top - y.value
  };

  const stopDragging = () => {
    nextTick(() => {
      isDragging.value = false;
    });
    document.body.removeEventListener('mouseup', onMouseup);
  };
  const onMouseup = (e: MouseEvent) => {
    if (app.value.view !== e.target) {
      ui.unselectCard();
    }

    stopDragging();
  };

  document.body.addEventListener('mouseup', onMouseup);
  const unwatch = watchEffect(() => {
    if (ui.mode !== UI_MODES.PLAY_CARD) {
      unwatch();
      return;
    }
    if (isOutOfScreen.value) {
      stopDragging();
      ui.unselectCard();
      unwatch();
    }
  });
};
</script>

<template>
  <li
    :class="{
      hoverable: !ui.selectedCard,
      disabled: !canPlay
    }"
    @mousedown="onMouseDown($event)"
  >
    <component :is="isDragging ? Teleport : 'div'" to="#dragged-card">
      <Transition appear>
        <Card :card="card" />
      </Transition>
    </component>
  </li>
</template>

<style scoped lang="postcss">
li {
  --disabled-filter: ;
  width: calc(1px * v-bind('config.CARD_WIDTH'));
  position: relative;
  z-index: calc(var(--hand-size) - var(--child-index));
  transform-origin: bottom right;
  transition:
    margin 0.3s var(--ease-out-2),
    filter 0.2s var(--ease-out-2),
    transform 0.15s var(--ease-in-4),
    z-index 0.15s var(--ease-in-4);
  transform: translateY(var(--size-11));
  filter: var(--disabled-filter) drop-shadow(15px 0 2px hsl(0 0 0 /0.5));
}

.hoverable:hover {
  transition:
    margin 0.3s var(--ease-out-2),
    z-index 0.15s var(--ease-in-4);
  filter: var(--disabled-filter);
  transform: scale(1.25);
  z-index: calc(var(--hand-size) + 1);
}

.disabled {
  --disabled-filter: grayscale(60%) brightness(0.7);
}

.card {
  &:is(.v-enter-active) {
    transition: all 0.3s;
    transition: all 0.3s;
  }

  &.v-enter-from {
    opacity: 0.5;
    transform: translateX(var(--size-7));
  }
}
</style>
