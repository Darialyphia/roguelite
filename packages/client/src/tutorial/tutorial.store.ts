import { type Nullable, type Point3D } from '@game/shared';
import { defineStore } from 'pinia';

export const useTutorialStore = defineStore('tutorial', () => {
  const highlightedCell = ref<Nullable<Point3D>>(null);
  const highlightedElementId = ref<Nullable<string>>(null);

  const highlightedElement = computed(() => {
    return highlightedElementId.value
      ? (document.getElementById(highlightedElementId.value) as HTMLElement)
      : null;
  });

  watch(highlightedElement, (el, prevEl) => {
    prevEl?.classList.remove('tutorial-highlighted');
    el?.classList.add('tutorial-highlighted');
  });

  const isRuneActionEnabled = ref(true);
  const isGoldActionEnabled = ref(true);
  const isDrawActionEnabled = ref(true);
  const isVPDisplayed = ref(true);
  const isGoldResourcesDisplayed = ref(true);
  const isRuneResourcesDisplayed = ref(true);
  const isOpponentHandDisplayed = ref(true);
  const isHandDisplayed = ref(true);
  const isQuestsDisplayed = ref(true);
  const isDeckDisplayed = ref(true);
  const isActionWheelDisplayed = ref(true);
  const isEndTurnDisplayed = ref(true);
  const isResourceWarningEnabled = ref(true);
  const areObstaclesDisplayed = ref(true);

  const reset = () => {
    isResourceWarningEnabled.value = false;
    isGoldResourcesDisplayed.value = true;
    isGoldActionEnabled.value = true;
    isDrawActionEnabled.value = true;
    isVPDisplayed.value = true;
    isGoldResourcesDisplayed.value = true;
    isRuneResourcesDisplayed.value = true;
    isOpponentHandDisplayed.value = true;
    isQuestsDisplayed.value = true;
    isDeckDisplayed.value = true;
    isEndTurnDisplayed.value = true;
    areObstaclesDisplayed.value = true;
  };

  return {
    isResourceWarningEnabled,
    highlightedCell,
    highlightedElementId,
    highlightedElement,
    isDrawActionEnabled,
    isGoldActionEnabled,
    isRuneActionEnabled,
    isVPDisplayed,
    isGoldResourcesDisplayed,
    isRuneResourcesDisplayed,
    isOpponentHandDisplayed,
    isQuestsDisplayed,
    isDeckDisplayed,
    isHandDisplayed,
    isActionWheelDisplayed,
    isEndTurnDisplayed,
    areObstaclesDisplayed,
    reset
  };
});
