import { Application, Container } from 'pixi.js';
import type { InjectionKey, Ref } from 'vue';
import { useSafeInject } from './useSafeInject';
import type { Scene } from '../types';
import type { Nullable } from '@game/shared';
import { until } from '@vueuse/core';

type PixiAppContext = { app: Ref<Application>; isReady: Ref<boolean> };

export const PIXI_APP_INJECTION_KEY = Symbol(
  'pixi app'
) as InjectionKey<PixiAppContext>;

export const providePixiApp = (canvas: Ref<HTMLCanvasElement | null>) => {
  const app = shallowRef(new Application());
  const isReady = ref(false);

  const screenView = new Container();
  let currentScene: Nullable<Scene> = null;

  onMounted(async () => {
    await app.value.init({
      background: '#222233',
      resizeTo: window,
      antialias: false,
      canvas: canvas.value!
    });

    app.value.stage.addChild(screenView);

    isReady.value = true;
  });

  const router = useRouter();
  router.beforeEach(async () => {
    if (currentScene) {
      await currentScene?.unmount?.(app.value);
      screenView.removeChild(currentScene);
    }
  });

  router.afterEach(async to => {
    if (!isReady.value) {
      await until(isReady).toBeTruthy();
    }

    const ctor = to.meta.scene;
    if (!ctor) return;
    if (to.meta.scene) {
      currentScene = new ctor();
      await currentScene?.mount?.(app.value);
      screenView.addChild(currentScene);
    }
  });

  provide(PIXI_APP_INJECTION_KEY, { app, isReady });

  return { app, isReady };
};

export const usePixiApp = () => useSafeInject(PIXI_APP_INJECTION_KEY);
