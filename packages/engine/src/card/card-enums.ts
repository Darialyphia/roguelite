import type { Values } from '@game/shared';

export const CARD_KINDS = {
  UNIT: 'unit',
  GENERAL: 'general',
  SPELL: 'spell'
} as const;

export type CardKind = Values<typeof CARD_KINDS>;
