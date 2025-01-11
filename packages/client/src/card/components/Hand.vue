<script setup lang="ts">
import { waitFor } from '@game/shared';
import { config } from '@/utils/config';
import { makeCardViewModel } from '../card.model';
import DraggedCard from './DraggedCard.vue';
import HandCard from './HandCard.vue';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import { GAME_EVENTS } from '@game/engine/src/game/game';
import {
  useBattleEvent,
  useGame,
  useGameClientState,
  useUserPlayer
} from '@/battle/stores/battle.store';
import { useTutorialStore } from '@/tutorial/tutorial.store';

const root = useTemplateRef('root');
const cardSpacing = ref(0);
const player = useUserPlayer();

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

const game = useGame();
const state = useGameClientState();

useBattleEvent(GAME_EVENTS.PLAYER_BEFORE_PLAY_CARD, async event => {
  if (!player.value.getPlayer().equals(event.player)) {
    return;
  }
  player.value.hand = player.value.hand.filter(
    card => !card.getCard().equals(event.card)
  );
});

useBattleEvent(GAME_EVENTS.PLAYER_AFTER_DRAW, async event => {
  if (!event.player.equals(player.value.getPlayer())) return;
  for (const card of event.cards) {
    player.value.hand.push(makeCardViewModel(game.value, card));
    await waitFor(300);
  }
});

const tutorial = useTutorialStore();
</script>

<template>
  <ul
    class="hand"
    v-if="state.phase === GAME_PHASES.BATTLE"
    ref="root"
    :class="!tutorial.isHandDisplayed && 'tutorial-hidden'"
  >
    <DraggedCard />

    <HandCard
      v-for="(card, index) in player.hand"
      :key="`${card.id}|${index}`"
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
