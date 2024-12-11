<script setup lang="ts">
import { waitFor, type Nullable } from '@game/shared';
import { makeCardViewModel, type CardViewModel } from '../card.model';
import { useBattleEvent, useGame } from '@/pages/battle/battle.store';
import Card from './Card.vue';

const card = ref<Nullable<CardViewModel>>();

const game = useGame();
useBattleEvent('unit.before_play_card', async event => {
  card.value = makeCardViewModel(game.value, event.card);
  await waitFor(2000);
  card.value = null;
  await waitFor(500);
});
</script>

<template>
  <div class="played-card-backdrop">
    <Transition :duration="{ enter: 1500, leave: 500 }">
      <div class="wrapper" v-if="card">
        <Card :card="card" class="card-front" />
        <div class="card-back" />
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="postcss">
.played-card-backdrop {
  position: fixed;
  width: 100vw;
  height: 100dvh;
  display: grid;
  place-content: center;
  pointer-events: none;
  transition: background-color 0.5s;

  &:has(> .wrapper) {
    background-color: hsl(0 0 0 / 0.3);
  }
}

.wrapper {
  display: grid;
  grid-template-columns: 1fr;
  transform-style: preserve-3d;
  perspective: 500px;
  perspective-origin: center;
  padding-bottom: 10rem;

  > * {
    grid-row: 1;
    grid-column: 1;
  }

  &.v-enter-active {
    > * {
      transition: all 1s var(--ease-3);
      transition-delay: 500ms;
    }
  }

  &.v-leave-active {
    transition: all 0.5s var(--ease-3);
  }

  &.v-enter-from {
    .card-back {
      transform: rotateY(0deg);
    }

    .card-front {
      transform: rotateY(180deg);
    }
  }

  &.v-leave-to {
    opacity: 0;
    transform: translateY(calc(-1 * var(--size-9)));
  }
}

.card-front {
  transform: rotateY(360deg);
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
  backface-visibility: hidden;
  background: url('/assets/ui/card-back.png');
  background-size: cover;
}
</style>
