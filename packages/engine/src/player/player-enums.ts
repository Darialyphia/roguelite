import type { Values } from '@game/shared';

export const PLAYER_EVENTS = {
  BEFORE_DRAW: 'before_draw',
  AFTER_DRAW: 'after_draw',
  START_TURN: 'start_turn',
  END_TURN: 'end_turn',
  BEFORE_GAIN_RUNE: 'before_gain_rune',
  AFTER_GAIN_RUNE: 'after_gain_rune',
  BEFORE_GAIN_GOLD: 'before_gain_gold',
  AFTER_GAIN_GOLD: 'after_gain_gold',
  BEFORE_PLAY_CARD: 'before_play_card',
  AFTER_PLAY_CARD: 'after_play_card'
} as const;

export type PlayerEvent = Values<typeof PLAYER_EVENTS>;
