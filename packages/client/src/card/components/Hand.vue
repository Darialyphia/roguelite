<script setup lang="ts">
import {
  useActiveUnit,
  useBattleEvent,
  useGame,
  useGameClientState,
  useUserPlayer
} from '@/pages/battle/battle.store';
import { waitFor } from '@game/shared';
import { config } from '@/utils/config';
import { makeCardViewModel } from '../card.model';
import DraggedCard from './DraggedCard.vue';
import HandCard from './HandCard.vue';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';

const root = useTemplateRef('root');
const cardSpacing = ref(0);
const player = useUserPlayer();
const activeUnit = useActiveUnit();

const computeMargin = () => {
  if (!root.value) return 0;
  if (!player.value.hand.length) return 0;

  const allowedWidth = root.value.clientWidth;
  const totalWidth = player.value.hand.length * config.CARD_WIDTH;

  const excess = totalWidth - allowedWidth;
  return Math.min(-excess / (player.value.hand.length - 1), 0);
};

watch(
  [root, computed(() => player.value.hand.length)],
  async () => {
    await nextTick();
    cardSpacing.value = computeMargin();
  },
  { immediate: true }
);

const offset = ref({ x: 0, y: 0 });
const game = useGame();
const state = useGameClientState();

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
  <ul
    class="hand"
    v-if="activeUnit && state.phase === GAME_PHASES.BATTLE"
    ref="root"
  >
    <DraggedCard :offset="offset" />

    <HandCard
      v-for="(card, index) in player.hand"
      :key="`${card.id}|${index}`"
      v-model:offset="offset"
      :card="card"
    />
  </ul>
</template>

<style scoped lang="postcss">
.hand {
  display: flex;
  --hand-size: v-bind('player.hand.length');

  > li:not(:last-child) {
    margin-right: calc(1px * v-bind(cardSpacing));
  }
}
</style>
