export const config = {
  TILE_WIDTH: 96,
  TILE_HEIGHT: 54,

  // the ap spent to move one tile
  AP_COST_PER_MOVEMENT: 1,
  // the ap spent to perform the first attack of a unti each turn
  AP_COST_PER_ATTACK: 1,
  // the additional ap spent for every subsequent attack after the first
  AP_INCREASE_PER_ATTACK: 2,
  // the amount of cards drawn at the start of the game
  INITIAL_HAND_SIZE: 3,
  // the maximum amount of cards a player can hold at once in their hand
  MAX_HAND_SIZE: 8,
  // how many cards every player draws at the start of each turn
  CARDS_DRAWN_PER_TURN: 1,
  // how many gold player start the game with
  INITIAL_GOLD: 0,
  // gold gained per turn
  GOLD_PER_TURN: 3,
  // The maxi amount of unspent gold kept at the end of a turn
  MAX_GOLD_STOCKPILED: 10,
  // the standard amount of AP a unit has
  UNIT_BASE_AP: 3,
  // how many times a player can draw / gain gold / add a rune every turn
  MAX_RESOURCE_ACTION_PER_TURN: 1,
  // how many victory points are needed to win the game
  VP_WIN_THRESHOLD: 15,
  // how many victory points are needed to grant the opponent the first come back reward
  VP_FIRST_REWARD_THRESHOLD: 5,
  // how many victory points are needed to grant the opponent the second come back reward
  VP_SECOND_REWARD_THRESHOLD: 10,
  // The default amount of time a unit can counter attack eveyr turn
  MAX_COUNTERATTACKS_PER_TURN: 1,
  // The victory point gained at the end of the turn when a victory shrine is controlled by a player
  VICTORY_SHRINE_REWARD: 1,
  // The gold gained at the end of the turn when a fortune shrine is controlled by a player
  GOLD_SHRINE_REWARD: 1,
  // The victory point awarded for destroying the enemy general
  GENERAL_VP_REWARD: 8,
  // How many quest can a player have at the same time
  MAX_ONGOING_QUESTS: 2
} as const;

export type Config = typeof config;
