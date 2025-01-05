import { useSafeInject } from '@/shared/composables/useSafeInject';
import type { Viewport } from 'pixi-viewport';
import type { InjectionKey, Ref } from 'vue';

export type CameraContext = {
  offset: Ref<{ x: number; y: number }>;
  viewport: Ref<Viewport | null>;
  isDragging: Ref<boolean>;
  provideViewport(viewport: Viewport): void;
};
const CAMERA_INJECTION_KEY = Symbol(
  'iso-camera'
) as InjectionKey<CameraContext>;

export const provideCamera = () => {
  const api: CameraContext = {
    offset: ref({ x: 0, y: 0 }),
    viewport: ref(null),
    isDragging: ref(false),
    provideViewport(viewport) {
      api.viewport.value = viewport;
      viewport.on('drag-start', () => {
        api.isDragging.value = true;
      });
      viewport.on('drag-end', () => {
        api.isDragging.value = false;
      });
    }
  };

  provide(CAMERA_INJECTION_KEY, api);

  return api;
};

export const useCamera = () => useSafeInject(CAMERA_INJECTION_KEY);
