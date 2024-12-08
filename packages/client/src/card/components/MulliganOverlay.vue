<script setup lang="ts">
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import { useBattleStore, useUserPlayer } from '@/pages/battle/battle.store';
import Card from './Card.vue';
import UiButton from '@/ui/components/UiButton.vue';

const indices = ref<number[]>([]);

const userPlayer = useUserPlayer();

const hasConfirmed = ref(false);
const battle = useBattleStore();
</script>

<template>
  <div
    class="mulligan-overlay"
    v-if="battle.state.phase === GAME_PHASES.MULLIGAN"
  >
    <div class="flex justify-evenly gap-8">
      <label
        v-for="(card, index) in userPlayer.hand"
        :key="`${index}:${card.id}`"
      >
        <input
          v-model="indices"
          type="checkbox"
          :value="index"
          class="sr-only"
        />
        <div class="card-wrapper">
          <Card :card="card" />
        </div>
      </label>
    </div>
    <p class="explainer">Select the cards you wish to replace</p>
    <div class="mt-5 flex justify-center">
      <UiButton
        class="primary-button"
        :disabled="hasConfirmed"
        @click="
          () => {
            battle.dispatch({
              type: 'mulligan',
              payload: {
                playerId: userPlayer.id,
                indices
              }
            });
            indices = [];
          }
        "
      >
        Confirm
      </UiButton>
    </div>
    <p v-if="hasConfirmed">Waiting for opponent...</p>
  </div>
</template>

<style scoped lang="postcss">
.mulligan-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: radial-gradient(
    circle at center,
    hsl(0 0 0 /0.5),
    hsl(0 0 0 /0.85)
  );
  display: grid;
  place-content: center;
  pointer-events: all;
}
label {
  transition: all 0.3s;
  cursor: pointer;
}
label:has(input:checked) {
  position: relative;
  > .card-wrapper {
    transition: filter 0.2s var(--ease-2);
    filter: grayscale(70%) brightness(50%);
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/assets/ui/mulligan-selected.png');
    pointer-events: none;
    transition: all 0.2s var(--ease-3);
    @starting-style {
      opacity: 0;
      transform: scale(0.5);
    }
  }
}

.explainer {
  margin-block-start: var(--size-4);
  text-align: center;
  font-size: var(--font-size-4);
  text-shadow: black 0px 4px 1px;
}
</style>
