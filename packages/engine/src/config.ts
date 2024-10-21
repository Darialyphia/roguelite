export const config = {
  AP_SPENT_PER_MOVEMENT: 1,
  INITIAL_HAND_SIZE: 4,
  MAX_HAND_SIZE: 10
} as const;

export type Config = typeof config;
