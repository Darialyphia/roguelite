import type { Values } from '@game/shared';
import { useEventListener } from '@vueuse/core';

export const CONTROL_MODIFIERS = {
  SHIFT: 'shift',
  ALT: 'alt',
  CTRL: 'ctrl'
} as const;

export type ControlModifier = Values<typeof CONTROL_MODIFIERS>;
export type Control = { key: string; modifier: ControlModifier | null };

type ValiatedKeyboardEvent<TControl extends Control> = KeyboardEvent & {
  code: TControl['key'];
  shiftKey: TControl['modifier'] extends 'shift' ? true : false;
  altKey: TControl['modifier'] extends 'alt' ? true : false;
  ctrlKey: TControl['modifier'] extends 'ctrl' ? true : false;
};

const isMatch = <TControl extends Control>(
  e: KeyboardEvent,
  control: TControl
): e is ValiatedKeyboardEvent<TControl> => {
  if (e.code !== control.key) return false;
  const match =
    (control.modifier === null && !e.shiftKey && !e.ctrlKey && !e.altKey) ||
    (control.modifier == 'shift' && e.shiftKey) ||
    (control.modifier == 'alt' && e.altKey) ||
    (control.modifier == 'ctrl' && e.ctrlKey);

  if (match) {
    e.preventDefault();
  }
  return match;
};

export const useKeyboardControl = <TControl extends Control>(
  control: MaybeRefOrGetter<TControl>,
  cb: (e: ValiatedKeyboardEvent<TControl>) => void
) => {
  watchEffect(onCleanup => {
    const _control = toValue(control);

    const cleanup = useEventListener('keydown', e => {
      if (!isMatch(e, _control)) return;
      cb(e);
    });

    onCleanup(cleanup);
  });
};
