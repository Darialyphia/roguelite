<script setup lang="ts">
import { Teleport } from 'vue';
import { useActiveUnit } from '@/pages/battle/battle.store';
import Card from './Card.vue';
import type { Nullable } from '@game/shared';
import { useMouse } from '@vueuse/core';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { config } from '@/utils/config';
import { useApplication } from 'vue3-pixi';

const unit = useActiveUnit();
const ui = useBattleUiStore();

const root = useTemplateRef('root');
const margin = ref(0);

const computeMargin = () => {
  if (!root.value) return 0;
  if (!unit.value) return 0;
  if (!unit.value?.hand.length) return 0;

  const allowedWidth = root.value.clientWidth;
  const totalWidth = unit.value.hand.length * config.CARD_WIDTH;

  const excess = totalWidth - allowedWidth;
  return -excess / (unit.value.hand.length - 1); // last child has no margin
};

watch(
  [root, computed(() => unit.value?.hand.length)],
  async () => {
    await nextTick();
    margin.value = computeMargin();
  },
  { immediate: true }
);

const draggedIndex = ref<Nullable<number>>();
const { x, y } = useMouse();
const offset = ref({ x: 0, y: 0 });

const app = useApplication();
const onMouseDown = (e: MouseEvent, index: number) => {
  ui.selectCardAtIndex(index);

  const rect = (e.target as HTMLElement).getBoundingClientRect();
  offset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  draggedIndex.value = index;

  const stopDragging = (e: MouseEvent) => {
    if (app.value.view !== e.target) {
      ui.unselectCard();
    }
    offset.value = { x: 0, y: 0 };
    nextTick(() => {
      draggedIndex.value = null;
    });
    document.body.removeEventListener('mouseup', stopDragging);
  };
  document.body.addEventListener('mouseup', stopDragging);
};
</script>

<template>
  <ul class="hand" v-if="unit" ref="root" v-bind="$attrs">
    <Teleport to="body">
      <div
        id="dragged-card"
        :style="{
          '--x': `${x}px`,
          '--y': `${y}px`,
          opacity: ui.hoveredCell ? 0.75 : 1
        }"
      />
    </Teleport>
    <li
      v-for="(card, index) in unit.hand"
      :key="card.id"
      :class="!ui.selectedCard && 'hoverable'"
      @mousedown="onMouseDown($event, index)"
    >
      <component
        :is="draggedIndex === index ? Teleport : 'div'"
        to="#dragged-card"
      >
        <Card :card="card" />
      </component>
    </li>
  </ul>
</template>

<style scoped lang="postcss">
.hand {
  --hand-size: v-bind('unit?.hand.length');
  margin: v-bind(margin);
  display: flex;

  > li {
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
    filter: drop-shadow(15px 0 0px hsl(0 0 0 /0.5));

    &.hoverable:hover {
      transition:
        margin 0.3s var(--ease-out-2),
        filter 0.2s var(--ease-out-2),
        z-index 0.15s var(--ease-in-4);
      filter: none;
      transform: scale(1.25);
      z-index: calc(var(--hand-size) + 1);
    }

    &:not(:last-child) {
      margin-right: calc(1px * v-bind(margin));
    }
  }
}

#dragged-card {
  pointer-events: none !important;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  transform-origin: center center;
  transform: translateY(var(--y)) translateX(var(--x));

  /* opacity: var(--opacity); */

  transition: opacity 0.5s;
  > * {
    position: absolute;
    left: calc(-0.5px * v-bind('config.CARD_WIDTH'));
    top: calc(-0.25px * v-bind('config.CARD_HEIGHT'));
  }
}
</style>
