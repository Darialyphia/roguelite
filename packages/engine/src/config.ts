export const config = {
  AP_COST_PER_MOVEMENT: 1,
  AP_COST_PER_ATTACK: 1,
  INITIAL_HAND_SIZE: 2,
  MAX_HAND_SIZE: 7,
  CARDS_DRAWN_PER_TURN: 1,
  BASE_ATTACK_DAAMGE: 0
} as const;

export type Config = typeof config;
