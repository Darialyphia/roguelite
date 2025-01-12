import type {
  TutorialSession,
  TutorialStep
} from '@game/engine/src/tutorial-session';

export const useTutorial = (steps: TutorialStep[]) => {
  const currentTextIndex = ref(0);
  const currentStep = ref<TutorialStep>();

  watch(currentStep, (step, prevStep) => {
    const tooltip = prevStep?.tooltips.at(-1);
    if (!tooltip) return;
    if (tooltip.canClickNext) return;
    tooltip.onLeave?.();
  });
  return {
    currentTextIndex,
    currentStep,
    steps: steps.map((step, index) => ({
      ...step,
      onEnter(session: TutorialSession) {
        step.onEnter?.(session);
        currentStep.value = session.currentStep;
      },
      onLeave(session: TutorialSession) {
        step.onLeave?.(session);
        currentTextIndex.value = 0;
      }
    }))
  };
};
