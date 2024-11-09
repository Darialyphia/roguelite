import { defaultKeyBindings } from './keybindings';

export const getDefaultSettings = () => ({
  bindings: defaultKeyBindings
});

export type Settings = ReturnType<typeof getDefaultSettings>;
