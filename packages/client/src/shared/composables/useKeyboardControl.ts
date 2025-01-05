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

const isShiftModifier = (control: Control, e: KeyboardEvent) => {
  if (control.key === 'ShiftLeft' || control.key === 'ShiftRight') return false;

  return e.shiftKey;
};

const isCtrlModifier = (control: Control, e: KeyboardEvent) => {
  if (control.key === 'CtrlLeft' || control.key === 'CtrlRight') return false;

  return e.ctrlKey;
};

const isAltModifier = (control: Control, e: KeyboardEvent) => {
  if (control.key === 'AltLeft' || control.key === 'AltRight') return false;

  return e.ctrlKey;
};

const isMatch = <TControl extends Control>(
  e: KeyboardEvent,
  control: TControl
): e is ValiatedKeyboardEvent<TControl> => {
  if (e.repeat) return false;
  if (e.code !== control.key) return false;
  const shift = isShiftModifier(control, e);
  const ctrl = isCtrlModifier(control, e);
  const alt = isAltModifier(control, e);

  const match =
    (control.modifier === null && !shift && !ctrl && !alt) ||
    (control.modifier == 'shift' && shift) ||
    (control.modifier == 'alt' && alt) ||
    (control.modifier == 'ctrl' && ctrl);

  if (match) {
    e.preventDefault();
  }
  return match;
};

export const useKeyboardControl = <TControl extends Control>(
  eventName: 'keydown' | 'keyup',
  control: MaybeRefOrGetter<TControl>,
  cb: (e: ValiatedKeyboardEvent<TControl>) => void
) => {
  return useEventListener(eventName, e => {
    const _control = toValue(control);
    if (!isMatch(e, _control)) return;
    cb(e);
  });
};

export const useIsKeyboardControlPressed = <TControl extends Control>(
  control: MaybeRefOrGetter<TControl>
) => {
  const isPressed = ref(false);

  useEventListener('keydown', e => {
    if (e.repeat) return;
    const _control = toValue(control);
    if (!isMatch(e, _control)) return;
    isPressed.value = true;
  });
  useEventListener('keyup', e => {
    const _control = toValue(control);
    if (!isMatch(e, _control)) return;
    isPressed.value = false;
  });

  return isPressed;
};
