import type { Values } from '@game/shared';

export const JOBS = {
  MAGE: { id: 'mage', name: 'Mage' },
  FIGHTER: { id: 'fighter', name: 'Fighter' },
  SHOOTER: { id: 'shooter', name: 'Shooter' },
  SUPPORT: { id: 'support', name: 'Support' }
} as const;

export type Job = Values<typeof JOBS>;