<script setup lang="ts">
import { TutorialSession, ServerSession, ClientSession } from '@game/engine';
import type { TutorialSessionOptions } from '@game/engine/src/tutorial-session';
import { useBattleStore } from '@/battle/stores/battle.store';
import BattleUi from '@/battle/components/BattleUi.vue';
import { useTutorial } from '../composables/useTutorial';
import TextBox from './TextBox.vue';
import { until } from '@vueuse/core';
import { useTutorialStore } from '../tutorial.store';

const { options, rngSeed, playerId } = defineProps<{
  options: Pick<TutorialSessionOptions, 'mapId' | 'teams' | 'steps'>;
  rngSeed: string;
  playerId: string;
}>();

const emit = defineEmits<{
  ready: [{ client: ClientSession; server: ServerSession }];
}>();

const { currentStep, currentTextIndex, steps } = useTutorial(options.steps);

const serverOptions = {
  rngSeed,
  ...options
};

const isInvalidInput = ref(false);

const clientOptions: TutorialSessionOptions = {
  ...options,
  steps,
  onInvalidInput(input, expected) {
    isInvalidInput.value = true;
    console.log({ input, expected });
    setTimeout(() => {
      isInvalidInput.value = false;
    }, 1000);
  }
};

const serverSession = new ServerSession(serverOptions);
const clientSession = new TutorialSession(clientOptions);

const battleStore = useBattleStore();

const start = () => {
  serverSession.initialize();
  clientSession.initialize([...serverSession.game.rngSystem.values]);

  battleStore.init(
    clientSession,
    input => {
      const isValid = clientSession.validate(input);
      if (!isValid) return;
      serverSession.dispatch(input);
    },
    playerId
  );
  serverSession.subscribe(async (input, opts) => {
    clientSession.dispatch(input, opts);
  });
};
start();

until(() => battleStore.isReady)
  .toBeTruthy()
  .then(() => {
    emit('ready', { server: serverSession, client: clientSession });
  });

const currentTooltip = computed(() => {
  return currentStep.value?.tooltips[currentTextIndex.value];
});

const tutorial = useTutorialStore();
onUnmounted(() => {
  tutorial.reset();
});

const nextText = async () => {
  const isLastTooltip =
    currentTextIndex.value === currentStep.value!.tooltips.length - 1;
  await currentTooltip.value?.onLeave?.();
  if (!isLastTooltip) {
    currentTextIndex.value++;
  }
  await currentTooltip.value?.onEnter?.(nextText);
};
</script>

<template>
  <BattleUi />
  <TextBox
    v-if="currentTooltip"
    :text="currentTooltip.text"
    :can-next="!battleStore.isPlayingFx && currentTooltip.canClickNext"
    :class="isInvalidInput && 'is-invalid'"
    @next="nextText"
  />
</template>

<style lang="postcss" scoped>
.text-box {
  transition: box-shadow 0.2s var(--ease-2);
}

.is-invalid {
  animation: var(--animation-shake-x);
  animation-duration: 0.5s;
  box-shadow: 0 0 3rem red;
}
</style>
