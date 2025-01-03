import type { Control } from '@/shared/composables/useKeyboardControl';

export const defaultKeyBindings = {
  showAttackRange: {
    label: 'Display unit attack range',
    control: { key: 'ShiftLeft', modifier: null }
  },
  endTurn: {
    label: "End the current unit's turn",
    control: { key: 'KeyT', modifier: null }
  }
} as const satisfies Record<string, { label: string; control: Control }>;
