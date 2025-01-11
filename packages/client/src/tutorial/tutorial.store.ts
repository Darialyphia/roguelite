import { type Nullable, type Point3D } from '@game/shared';
import { defineStore } from 'pinia';

export const useTutorialStore = defineStore('tutorial', () => {
  const highlightedCell = ref<Nullable<Point3D>>(null);
  const highlightedElementId = ref<Nullable<string>>(null);

  const isRuneActionEnabled = ref(true);
  const isGoldActionEnabled = ref(true);
  const isDrawActionEnabled = ref(true);
  const isVPDisplayed = ref(true);
  const isResourcesDisplayed = ref(true);
  const isOpponentHandDisplayed = ref(true);
  const isHandDisplayed = ref(true);
  const isQuestsDisplayed = ref(true);
  const isDeckDisplayed = ref(true);
  const isActionWheelDisplayed = ref(true);
  const isEndTurnDisplayed = ref(true);
  const isResourceWarningEnabled = ref(false);

  const reset = () => {
    isResourceWarningEnabled.value = false;
    isResourcesDisplayed.value = true;
    isGoldActionEnabled.value = true;
    isDrawActionEnabled.value = true;
    isVPDisplayed.value = true;
    isResourcesDisplayed.value = true;
    isOpponentHandDisplayed.value = true;
    isQuestsDisplayed.value = true;
    isDeckDisplayed.value = true;
    isEndTurnDisplayed.value = true;
  };

  return {
    isResourceWarningEnabled,
    highlightedCell,
    highlightedElementId,
    isDrawActionEnabled,
    isGoldActionEnabled,
    isRuneActionEnabled,
    isVPDisplayed,
    isResourcesDisplayed,
    isOpponentHandDisplayed,
    isQuestsDisplayed,
    isDeckDisplayed,
    isHandDisplayed,
    isActionWheelDisplayed,
    isEndTurnDisplayed,
    reset
  };
});
