<script setup lang="ts">
import { useActiveUnit } from '@/pages/battle/battle.store';
import Card from './Card.vue';

const unit = useActiveUnit();

const root = useTemplateRef('root');
const margin = ref(0);

const computeMargin = () => {
  if (!root.value) return 0;
  if (!unit.value) return 0;
  if (!unit.value?.hand.length) return 0;

  const allowedWidth = root.value.clientWidth;
  const totalWidth = [...root.value.children].reduce(
    (acc, child) => acc + child.clientWidth,
    0
  );
  const excess = totalWidth - allowedWidth;
  console.log(unit.value.hand.length, root.value.children.length, excess);
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
</script>

<template>
  <ul class="hand" v-if="unit" ref="root">
    <li v-for="card in unit.hand" :key="card.id">
      <Card :card="card" />
    </li>
  </ul>
</template>

<style scoped lang="postcss">
.hand {
  --hand-size: v-bind('unit?.hand.length');
  margin: v-bind(margin);
  display: flex;

  > li {
    position: relative;
    z-index: calc(var(--hand-size) - var(--child-index));
    transform-origin: bottom right;
    transition:
      margin 0.3s var(--ease-out-2),
      transform 0.15s var(--ease-in-4);
    transform: translateY(var(--size-11));
    &:hover {
      transform: scale(1.5);
      z-index: calc(var(--hand-size) + 1);
    }

    &:not(:last-child) {
      margin-right: calc(1px * v-bind(margin));
    }
  }
}
</style>
