import type { Values } from '@game/shared';

export const PLAYER_EVENTS = {
  BEFORE_DRAW: 'before_draw',
  AFTER_DRAW: 'after_draw',
  START_TURN: 'start_turn',
  END_TURN: 'end_turn',
  BEFORE_RUNE_CHANGE: 'before_rune_change',
  AFTER_RUNE_CHANGE: 'after_rune_change',
  BEFORE_GOLD_CHANGE: 'before_gold_change',
  AFTER_GOLD_CHANGE: 'after_gold_change',
  BEFORE_PLAY_CARD: 'before_play_card',
  AFTER_PLAY_CARD: 'after_play_card',
  BEFORE_VP_CHANGE: 'before_vp_change',
  AFTER_VP_CHANGE: 'after_vp_change'
} as const;

export type PlayerEvent = Values<typeof PLAYER_EVENTS>;
