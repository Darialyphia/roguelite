export const config = {
  AP_COST_PER_MOVEMENT: 1,
  AP_COST_PER_ATTACK: 1,
  AP_INCREASE_PER_ATTACK: 2,
  INITIAL_HAND_SIZE: 3,
  MAX_HAND_SIZE: 7,
  CARDS_DRAWN_PER_TURN: 1,
  ATTACK_BASE_DAMAGE: 0,
  INITIAL_GOLD: 0,
  GOLD_PER_TURN: 3,
  UNIT_BASE_AP: 4,
  MAX_RESOURCE_ACTION_PER_TURN: 1,
  VICTORY_POINTS_WIN_THRESHOLD: 12
} as const;

export type Config = typeof config;
