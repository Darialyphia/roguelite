import type { Values } from '@game/shared';

export const CARD_KINDS = {
  UNIT: 'unit',
  SPELL: 'spell',
  QUEST: 'quest'
} as const;

export type CardKind = Values<typeof CARD_KINDS>;

export const UNIT_TYPES = {
  MINION: 'minion',
  GENERAL: 'general'
} as const;

export type UnitType = Values<typeof UNIT_TYPES>;
