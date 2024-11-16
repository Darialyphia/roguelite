import type { SerializedInput } from '../input/input-system';

export type ScoredInput = {
  input: SerializedInput;
  score: number;
};

export type AIAgent = {
  getNextInput(): Promise<SerializedInput>;
};

export const getHighestScoredAction = (actions: ScoredInput[]) => {
  let result = actions[0];

  actions.forEach(action => {
    if (action.score >= result.score) result = action;
  });

  return result;
};
