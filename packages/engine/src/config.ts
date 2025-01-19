export type Config = {
  TILE_WIDTH: number;
  TILE_HEIGHT: number;

  // the amount of cards drawn at the start of the game
  INITIAL_HAND_SIZE: number;
  // the maximum amount of cards a player can hold at once in their hand
  MAX_HAND_SIZE: number;
  // how many cards every player draws at the start of each turn
  CARDS_DRAWN_PER_TURN: number;
  // how many gold player start the game with
  INITIAL_GOLD: number;
  // gold gained per turn
  GOLD_PER_TURN: number;
  // The maxi amount of unspent gold kept at the end of a turn
  MAX_GOLD_STOCKPILED: number;
  // how many times a player can draw / gain gold / add a rune every turn
  MAX_RESOURCE_ACTION_PER_TURN: number;
  // how many victory points are needed to win the game
  VP_WIN_THRESHOLD: number;
  // The default amount of tiles a unit can move every turn
  MAX_MOVEMENT_PER_TURN: number;
  // The default amount of time a unit can attack every turn
  MAX_ATTACKS_PER_TURN: number;
  // The default amount of time a unit can counter attack every turn
  MAX_COUNTERATTACKS_PER_TURN: number;
  // The victory point gained at the end of the turn when a victory shrine is controlled by a player
  VICTORY_SHRINE_REWARD: number;
  // The gold gained at the end of the turn when a fortune shrine is controlled by a player
  GOLD_SHRINE_REWARD: number;
  // The victory point awarded for destroying the enemy general
  GENERAL_VP_REWARD: number;
  // How many quest can a player have at the same time
  MAX_ONGOING_QUESTS: number;
  // should the players decks be shuffled at the start of the game
  SHUFFLE_DECK_ON_GAME_START: boolean;
};

export const defaultConfig = {
  TILE_WIDTH: 96,
  TILE_HEIGHT: 54,
  INITIAL_HAND_SIZE: 3,
  MAX_HAND_SIZE: 8,
  CARDS_DRAWN_PER_TURN: 1,
  INITIAL_GOLD: 0,
  GOLD_PER_TURN: 3,
  MAX_GOLD_STOCKPILED: 10,
  MAX_RESOURCE_ACTION_PER_TURN: 1,
  VP_WIN_THRESHOLD: 12,
  MAX_MOVEMENT_PER_TURN: 2,
  MAX_ATTACKS_PER_TURN: 1,
  MAX_COUNTERATTACKS_PER_TURN: 1,
  VICTORY_SHRINE_REWARD: 1,
  GOLD_SHRINE_REWARD: 1,
  GENERAL_VP_REWARD: 4,
  MAX_ONGOING_QUESTS: 2,
  SHUFFLE_DECK_ON_GAME_START: true
} as const;
