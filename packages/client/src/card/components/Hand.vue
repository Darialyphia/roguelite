<script setup lang="ts">
import {
  useActiveUnit,
  useBattleEvent,
  useGame
} from '@/pages/battle/battle.store';
import { waitFor } from '@game/shared';
import { config } from '@/utils/config';
import { makeCardViewModel } from '../card.model';
import DraggedCard from './DraggedCard.vue';
import HandCard from './HandCard.vue';

const root = useTemplateRef('root');
const cardSpacing = ref(0);
const activeUnit = useActiveUnit();

const computeMargin = () => {
  if (!root.value) return 0;
  if (!activeUnit.value) return 0;
  if (!activeUnit.value?.hand.length) return 0;

  const allowedWidth = root.value.clientWidth;
  const totalWidth = activeUnit.value.hand.length * config.CARD_WIDTH;

  const excess = totalWidth - allowedWidth;
  return Math.min(-excess / (activeUnit.value.hand.length - 1), 0);
};

watch(
  [root, computed(() => activeUnit.value?.hand.length)],
  async () => {
    await nextTick();
    cardSpacing.value = computeMargin();
  },
  { immediate: true }
);

const offset = ref({ x: 0, y: 0 });
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
  <ul class="hand" v-if="activeUnit" ref="root">
    <DraggedCard :offset="offset" />

    <HandCard
      v-for="(card, index) in activeUnit.hand"
      :key="`${card.id}|${index}`"
      v-model:offset="offset"
      :card="card"
    />
  </ul>
</template>

<style scoped lang="postcss">
.hand {
  display: flex;

  > li:not(:last-child) {
    margin-right: calc(1px * v-bind(cardSpacing));
  }
}
</style>
