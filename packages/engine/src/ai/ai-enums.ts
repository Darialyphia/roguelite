// reexporting enums fom the minimaxer library
// they use const enums which are not compatible with our ts config

export const NODE_AIM = {
  MIN: -1,
  NONE: 0,
  MAX: 1,
  MEAN: 2,
  PROB: 3
} as const;

export const NODE_TYPE = {
  ROOT: 0,
  INNER: 1,
  LEAF: 2
} as const;

export const SEARCH_METHODS = {
  DEPTH: 0,
  DEEPENING: 1,
  TIME: 2
} as const;

export const PRUNING_TYPES = {
  NONE: 0,
  ALPHA_BETA: 1
};
