<script setup lang="ts">
import { PTransition } from 'vue3-pixi';
import type { UnitViewModel } from '../unit.model';
import { useBattleEvent } from '@/pages/battle/battle.store';
import { GAME_EVENTS } from '@game/engine/src/game/game';
import UiLayerContainer from '@/ui/scenes/UiLayerContainer.vue';
import type { Rune } from '@game/engine/src/utils/rune';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const latestRune = ref<Rune>();
const isRuneSpriteDisplayed = ref(false);

const latestVp = ref<number>();
const isVpSpriteDisplayed = ref(false);

const latestGold = ref<number>();
const isGoldSpriteDisplayed = ref(false);

const latestDraw = ref<number>();
const isDrawSpriteDisplayed = ref(false);

useBattleEvent(GAME_EVENTS.PLAYER_BEFORE_VP_CHANGE, async e => {
  if (!e.player.equals(unit.player.getPlayer())) return Promise.resolve();

  isVpSpriteDisplayed.value = true;
  latestVp.value = e.amount;
  setTimeout(() => {
    isVpSpriteDisplayed.value = false;
  }, 1000);
});

useBattleEvent(GAME_EVENTS.PLAYER_BEFORE_RUNE_CHANGE, async e => {
  if (!e.player.equals(unit.player.getPlayer())) return Promise.resolve();

  latestRune.value = e.rune;
  isRuneSpriteDisplayed.value = true;

  setTimeout(() => {
    isRuneSpriteDisplayed.value = false;
  }, 1000);
});

useBattleEvent(GAME_EVENTS.PLAYER_BEFORE_GOLD_CHANGE, async e => {
  if (!e.player.equals(unit.player.getPlayer())) return Promise.resolve();

  isGoldSpriteDisplayed.value = true;
  latestGold.value = e.amount;

  setTimeout(() => {
    isGoldSpriteDisplayed.value = false;
  }, 1000);
});

useBattleEvent(GAME_EVENTS.PLAYER_BEFORE_DRAW, async e => {
  if (!e.player.equals(unit.player.getPlayer())) return Promise.resolve();

  isDrawSpriteDisplayed.value = true;
  latestDraw.value = e.amount;
  setTimeout(() => {
    isDrawSpriteDisplayed.value = false;
  }, 1000);
});

const transitionProps = {
  appear: true,
  duration: { enter: 300, leave: 300 },
  beforeEnter: { alpha: 0, y: -10 },
  enter: { alpha: 1, y: -45 },
  leave: { alpha: 0 }
};
</script>

<template>
  <PTransition v-bind="transitionProps">
    <UiLayerContainer v-if="isVpSpriteDisplayed">
      <sprite
        texture="/assets/ui/vp.png"
        :anchor="0.5"
        event-mode="none"
        :scale="0.5"
      />
    </UiLayerContainer>
  </PTransition>

  <PTransition v-bind="transitionProps">
    <UiLayerContainer v-if="isRuneSpriteDisplayed">
      <sprite
        :texture="`/assets/ui/rune-${latestRune?.id.toLowerCase()}-small.png`"
        :anchor="0.5"
        event-mode="none"
        :scale="0.5"
      />
    </UiLayerContainer>
  </PTransition>

  <PTransition v-bind="transitionProps">
    <UiLayerContainer v-if="isDrawSpriteDisplayed">
      <sprite
        texture="/assets/ui/draw.png"
        :anchor="0.5"
        event-mode="none"
        :scale="0.5"
      />
    </UiLayerContainer>
  </PTransition>

  <PTransition v-bind="transitionProps">
    <UiLayerContainer v-if="isGoldSpriteDisplayed">
      <sprite
        texture="/assets/ui/gold.png"
        :anchor="0.5"
        event-mode="none"
        :scale="0.5"
      />
    </UiLayerContainer>
  </PTransition>
</template>
