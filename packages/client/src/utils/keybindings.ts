import type { Control } from '@/shared/composables/useKeyboardControl';

export const defaultKeyBindings = {
  rotateCW: {
    label: 'Rotate map clockwise',
    control: { key: 'KeyE', modifier: null }
  },
  rotateCCW: {
    label: 'Rotate map counter clockwise',
    control: { key: 'KeyQ', modifier: null }
  },
  endTurn: {
    label: "End the current unit's turn",
    control: { key: 'KeyT', modifier: null }
  },
  centerOnActiveUnit: {
    label: 'Center camera on the active unit.',
    control: { key: 'Space', modifier: null }
  }
} as const satisfies Record<string, { label: string; control: Control }>;
