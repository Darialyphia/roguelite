export const config = {
  AP_COST_PER_MOVEMENT: 1,
  AP_COST_PER_ATTACK: 1,
  INITIAL_HAND_SIZE: 4,
  MAX_HAND_SIZE: 10,
  CARDS_DRAWN_PER_TURN: 1
} as const;

export type Config = typeof config;
