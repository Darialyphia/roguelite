<script setup lang="ts">
import {
  useActiveUnit,
  useBattleEvent,
  useGame
} from '@/pages/battle/battle.store';
import { waitFor } from '@game/shared';
import { config } from '@/utils/config';
import { makeCardViewModel } from './card.model';
import DraggedCard from './DraggedCard.vue';
import HandCard from './HandCard.vue';

const unit = useActiveUnit();
const root = useTemplateRef('root');
const margin = ref(0);

const computeMargin = () => {
  if (!root.value) return 0;
  if (!unit.value) return 0;
  if (!unit.value?.hand.length) return 0;

  const allowedWidth = root.value.clientWidth;
  const totalWidth = unit.value.hand.length * config.CARD_WIDTH;

  const excess = totalWidth - allowedWidth;
  return Math.min(-excess / (unit.value.hand.length - 1), 0);
};

watch(
  [root, computed(() => unit.value?.hand.length)],
  async () => {
    await nextTick();
    margin.value = computeMargin();
  },
  { immediate: true }
);

const offset = ref({ x: 0, y: 0 });
const activeUnit = useActiveUnit();
const game = useGame();

useBattleEvent('unit.before_play_card', async event => {
  if (!activeUnit.value) return;
  if (!activeUnit.value?.getUnit().equals(event.unit)) {
    return;
  }
  activeUnit.value.hand = activeUnit.value.hand.filter(
    card => !card.getCard().equals(event.card)
  );
});

useBattleEvent('unit.after_draw', async event => {
  if (!activeUnit.value) return;
  if (!activeUnit.value?.getUnit().equals(event.unit)) {
    return;
  }
  for (const card of event.cards) {
    activeUnit.value.hand.push(makeCardViewModel(game.value, card));
    await waitFor(300);
  }
});
</script>

<template>
  <ul class="hand" v-if="unit" ref="root" v-bind="$attrs">
    <DraggedCard :offset="offset" />

    <HandCard
      v-for="(card, index) in unit.hand"
      :key="`${card.id}|${index}`"
      v-model:offset="offset"
      :card="card"
    />
  </ul>
</template>

<style scoped lang="postcss">
.hand {
  --hand-size: v-bind('unit?.hand.length');
  margin: v-bind(margin);
  display: flex;

  > li:not(:last-child) {
    margin-right: calc(1px * v-bind(margin));
  }
}
</style>
