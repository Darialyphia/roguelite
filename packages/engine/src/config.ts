export const config = {
  TILE_WIDTH: 96,
  TILE_HEIGHT: 54,

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
  // how many times a player can draw / gain gold / add a rune every turn
  MAX_RESOURCE_ACTION_PER_TURN: 1,
  // how many victory points are needed to win the game
  VP_WIN_THRESHOLD: 12,
  // The default amount of tiles a unit can move every turn
  MAX_MOVEMENT_PER_TURN: 2,
  // The default amount of time a unit can attack every turn
  MAX_ATTACKS_PER_TURN: 1,
  // The default amount of time a unit can counter attack every turn
  MAX_COUNTERATTACKS_PER_TURN: 1,
  // The victory point gained at the end of the turn when a victory shrine is controlled by a player
  VICTORY_SHRINE_REWARD: 1,
  // The gold gained at the end of the turn when a fortune shrine is controlled by a player
  GOLD_SHRINE_REWARD: 1,
  // The victory point awarded for destroying the enemy general
  GENERAL_VP_REWARD: 6,
  // How many quest can a player have at the same time
  MAX_ONGOING_QUESTS: 2
} as const;

export type Config = typeof config;
