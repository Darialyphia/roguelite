<script setup lang="ts">
import { Teleport } from 'vue';
import { useUserPlayer } from '@/pages/battle/battle.store';
import Card from './Card.vue';
import { type Point } from '@game/shared';
import { useMouse, usePageLeave } from '@vueuse/core';
import { UI_MODES, useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { config } from '@/utils/config';
import { useApplication } from 'vue3-pixi';
import { type CardViewModel } from '../card.model';
import { match } from 'ts-pattern';
import { CARD_KINDS } from '@game/engine/src/card/card-enums';

const { card } = defineProps<{ card: CardViewModel }>();

const ui = useBattleUiStore();
const player = useUserPlayer();
const index = computed(
  () => player.value?.hand.findIndex(c => c.equals(card))!
);

const app = useApplication();
const isOutOfScreen = usePageLeave();
const isDragging = ref(false);
const canPlay = computed(() =>
  player.value?.getPlayer().canPlayCardAt(index.value)
);

const isShaking = ref(false);
const violationWarning = ref('');

const onMouseDown = (e: MouseEvent) => {
  if (!canPlay.value) {
    isShaking.value = true;
    violationWarning.value = violations.value.gold
      ? "You don't have enough gold."
      : "You haven't unlocked the required runes.";
    setTimeout(() => {
      violationWarning.value = '';
    }, 2500);
    return;
  }

  ui.selectCardAtIndex(index.value);
  isDragging.value = true;

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

const violations = computed<{ gold?: boolean; runes?: boolean }>(() =>
  match(card)
    .with({ kind: CARD_KINDS.UNIT }, card => ({
      gold: !card.getCard().isGoldValid,
      runes: !card.getCard().isRunesValid
    }))
    .with({ kind: CARD_KINDS.SPELL }, card => ({
      gold: !card.getCard().isGoldValid,
      runes: !card.getCard().isRunesValid
    }))
    .with({ kind: CARD_KINDS.QUEST }, card => ({
      gold: !card.getCard().isGoldValid,
      runes: !card.getCard().isRunesValid
    }))
    .exhaustive()
);
</script>

<template>
  <li
    :class="{
      hoverable: !ui.selectedCard,
      'is-shaking': isShaking
    }"
    class="pointer-events-auto"
    @animationend="isShaking = false"
    @mousedown="onMouseDown($event)"
    @mouseleave="violationWarning = ''"
  >
    <Transition>
      <div class="violation-warning" v-if="violationWarning">
        {{ violationWarning }}
      </div>
    </Transition>
    <component :is="isDragging ? Teleport : 'div'" to="#dragged-card">
      <Transition appear>
        <Card
          :card="card"
          :class="{
            'is-dragging': isDragging,
            'is-highlighted': card.shouldHighlightInHand
          }"
          :violations="violations"
        />
      </Transition>
    </component>
  </li>
</template>

<style scoped lang="postcss">
li {
  --disabled-filter: ;
  width: calc(1px * v-bind('config.CARD_WIDTH'));
  position: relative;
  z-index: var(--child-index);
  transform-origin: bottom right;
  transition:
    margin 0.3s var(--ease-out-2),
    filter 0.2s var(--ease-out-2),
    transform 0.15s var(--ease-in-4),
    z-index 0.15s var(--ease-in-4);
  transform: translateY(220px) scale(calc(100% * (2 / 3)));
  filter: var(--disabled-filter) drop-shadow(15px 0 2px hsl(0 0 0 /0.5));

  &:not(:hover) .violation-warning {
    opacity: 0;
  }
}

.hoverable:hover {
  transition:
    margin 0.3s var(--ease-out-2),
    z-index 0s;
  filter: var(--disabled-filter);
  transform: none;
  z-index: calc(var(--hand-size) + 1);
  &.is-shaking {
    animation: var(--animation-shake-x);
    animation-duration: 0.3s;
  }
}

.disabled {
  --disabled-filter: grayscale(25%) brightness(0.8);
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

.is-dragging {
  transform: scale(0.666);
  transform-origin: top left;
}

.is-highlighted {
  box-shadow:
    0 0 2rem yellow,
    0 0 3rem lime;
}

.violation-warning {
  position: absolute;
  bottom: calc(100% + var(--size-5));
  font-family: 'Press Start 2P';
  font-size: var(--font-size-2);
  text-shadow: 0 0 0.35rem hsl(0 0 0 / 0.75);
  &:is(.v-enter-active) {
    transition: all 0.2s;
    transition: all 0.2s;
  }

  &.v-enter-from {
    opacity: 0;
  }
}
</style>
