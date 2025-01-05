<script setup lang="ts">
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import {
  useBattleEvent,
  useBattleStore,
  useUserPlayer
} from '@/pages/battle/battle.store';
import Card from './Card.vue';
import UiButton from '@/ui/components/UiButton.vue';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { GAME_EVENTS } from '@game/engine/src/game/game';

const indices = ref<number[]>([]);

const userPlayer = useUserPlayer();

const hasConfirmed = ref(false);
const battle = useBattleStore();
const ui = useBattleUiStore();
const isDisplayed = ref(true);
useBattleEvent(GAME_EVENTS.START_BATTLE, async () => {
  isDisplayed.value = false;
});
</script>

<template>
  <Transition appear :duration="500">
    <div
      class="mulligan-overlay"
      v-if="
        isDisplayed &&
        battle.state.phase === GAME_PHASES.MULLIGAN &&
        ui.isBoardAppearAnimationDone
      "
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
  </Transition>
</template>

<style scoped lang="postcss">
@property --mulligan-overlay-backdrop-opacity-start {
  syntax: '<color>';
  inherits: false;
  initial-value: hsl(0 0 0 /0.15);
}
@property --mulligan-overlay-backdrop-opacity-end {
  syntax: '<color>';
  inherits: false;
  initial-value: hsl(0 0 0 /0.85);
}

.v-enter-active,
.v-leave-active {
  transition:
    --mulligan-overlay-backdrop-opacity-start 0.5s var(--ease-4),
    --mulligan-overlay-backdrop-opacity-end 0.5s var(--ease-4);
  > * {
    transition: all 0.5s var(--ease-4);
  }
}

.v-enter-from,
.v-leave-to {
  --mulligan-overlay-backdrop-opacity-start: 0;
  --mulligan-overlay-backdrop-opacity-end: 0;

  > * {
    opacity: 0;
    transform: scale(0);
  }
}

.mulligan-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: radial-gradient(
    circle at center,
    var(--mulligan-overlay-backdrop-opacity-start),
    var(--mulligan-overlay-backdrop-opacity-end)
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
  font-family: 'SilkScreen';
  text-shadow: black 0px 4px 1px;
}
</style>
