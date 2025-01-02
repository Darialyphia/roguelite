import type { Values } from '@game/shared';

export const CARD_KINDS = {
  UNIT: 'unit',
  SPELL: 'spell',
  QUEST: 'quest'
} as const;

export type CardKind = Values<typeof CARD_KINDS>;
