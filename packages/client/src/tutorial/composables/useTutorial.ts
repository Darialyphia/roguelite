import type {
  TutorialSession,
  TutorialStep
} from '@game/engine/src/tutorial-session';

export const useTutorial = (steps: TutorialStep[]) => {
  const currentTextIndex = ref(0);
  const currentStep = ref<TutorialStep>();

  return {
    currentTextIndex,
    currentStep,
    steps: steps.map((step, index) => ({
      ...step,
      onEnter(session: TutorialSession) {
        console.log('enter step', index);
        step.onEnter?.(session);
        currentStep.value = session.currentStep;
      },
      onLeave(session: TutorialSession) {
        console.log('leave step', index);
        step.onLeave?.(session);
        currentTextIndex.value = 0;
      }
    }))
  };
};
