import type { Values } from '@game/shared';

export const CARD_KINDS = {
  UNIT: 'unit',
  SPELL: 'spell',
  QUEST: 'quest'
} as const;

export type CardKind = Values<typeof CARD_KINDS>;

export const UNIT_TYPES = {
  MINION: 'minion',
  ALTAR: 'altar'
} as const;

export type UnitType = Values<typeof UNIT_TYPES>;

export const CARD_SETS = {
  TUTORIAL: 'TUTORIAL',
  BASIC: 'BASIC',
  CORE: 'CORE'
} as const;

export type CardSet = Values<typeof CARD_SETS>;
