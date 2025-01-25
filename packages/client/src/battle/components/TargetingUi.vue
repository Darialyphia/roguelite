<script setup lang="ts">
import { match } from 'ts-pattern';
import { UI_MODES, useBattleUiStore } from '../stores/battle-ui.store';
import { useBattleStore } from '../stores/battle.store';
import { isDefined } from '@game/shared';
import UiButton from '@/ui/components/UiButton.vue';

const ui = useBattleUiStore();
const game = useBattleStore();

const canSkip = computed(() => {
  const card = ui.selectedCard;
  if (!card) return false;
  return ui.cardTargets.length <= card.minTargetCount;
});

const cancel = () => {
  match(ui.mode)
    .with(UI_MODES.PLAY_CARD, () => {
      ui.unselectCard();
    })
    .otherwise(() => void 0);
};

const commitPlay = () => {
  game.dispatch({
    type: 'playCard',
    payload: {
      index: ui.selectedCardIndex!,
      targets: ui.cardTargets
    }
  });
  ui.unselectCard();
};

watchEffect(() => {
  if (!isDefined(ui.mode)) return;

  match(ui.mode)
    .with(UI_MODES.BASIC, () => undefined)
    .with(UI_MODES.PLAY_CARD, () => {
      const card = ui.selectedCard;
      if (!card) return false;
      if (ui.cardTargets.length === card.maxTargetCount) {
        commitPlay();
      }
    })
    .exhaustive();
});

const isDisplayed = computed(() => {
  // this is strange, but if we dont evaluate all the conditions we rn into reactivity issues
  // maybe it is pinia related ?
  const isCorrectMode = ui.mode === UI_MODES.PLAY_CARD;
  const hasMultipleTargets = ui.cardTargets.length > 0;
  const needsMultipleTargets =
    (ui.selectedCard?.maxTargetCount ?? 0) > 1 ||
    ui.selectedCard?.minTargetCount === 0;

  return isCorrectMode && hasMultipleTargets && needsMultipleTargets;
});
</script>

<template>
  <div v-if="isDisplayed" class="targeting-ui" @click.stop>
    <UiButton class="error-button" is-cta @click="cancel">Cancel</UiButton>
    <UiButton v-if="canSkip" is-cta class="primary-button" @click="commitPlay">
      Skip
    </UiButton>
  </div>
</template>

<style scoped lang="postcss">
.targeting-ui {
  pointer-events: auto;
  position: absolute;
  bottom: calc(var(--size-12));
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  gap: 0;
  align-items: center;

  @screen lt-lg {
    bottom: var(--size-8);
  }
}

button {
  --ui-button-size: var(--font-size-3);

  box-shadow: 0 5px 0.25rem hsl(var(--gray-11-hsl) / 0.6);

  &:first-of-type {
    border-top-left-radius: var(--radius-4);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &:last-of-type {
    border-top-left-radius: 0;
    border-bottom-right-radius: var(--radius-4);
    border-bottom-left-radius: 0;
  }
}
</style>
