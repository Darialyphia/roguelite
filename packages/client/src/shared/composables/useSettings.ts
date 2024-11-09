import { getDefaultSettings } from '@/utils/settings';
import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref(getDefaultSettings());

  return { settings };
});
