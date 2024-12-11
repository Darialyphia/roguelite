<script setup lang="ts">
import { Application, BaseTexture, SCALE_MODES, WRAP_MODES } from 'pixi.js';
import { appInjectKey, createApp } from 'vue3-pixi';
import * as PIXI from 'pixi.js';
import { Stage } from '@pixi/layers';
import { useEventListener } from '@vueuse/core';
import { throttle } from 'lodash-es';
import { renderSlot, type App } from 'vue';

// @ts-ignore  enable PIXI devtools
window.PIXI = PIXI;

const canvas = useTemplateRef('canvas');

const slots = useSlots();
let app: App<PIXI.Container> | undefined;
const pixiApp = shallowRef<Application>() as Ref<Application>;

onMounted(async () => {
  // We create the pixi app manually instead of using vue3-pixi's <Application /> component
  // because we want to override the Stage wih the one from @pixi/layers
  pixiApp.value = new Application({
    backgroundColor: 0x000000,
    backgroundAlpha: 0,
    view: canvas.value!,
    width: window.innerWidth,
    height: window.innerHeight,
    autoDensity: true,
    antialias: false
  });

  //@ts-expect-error
  globalThis.__PIXI_APP__ = pixiApp.value;

  pixiApp.value.resizeTo = window;

  pixiApp.value.stage = new Stage();
  pixiApp.value.stage.sortableChildren = true;

  // BaseTexture.defaultOptions.wrapMode = WRAP_MODES.CLAMP;
  BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

  const app = createApp({
    render: () => renderSlot(slots, 'default')
  });
  app.provide(appInjectKey, pixiApp);
  const { appContext } = getCurrentInstance()!;

  const parent = appContext?.app;
  app.config.globalProperties = parent.config.globalProperties;
  Object.assign(app._context.provides, parent._context.provides);
  app.mount(pixiApp.value.stage);
});

onUnmounted(() => {
  app?.unmount();
  app = undefined;

  pixiApp.value?.destroy();
  // @ts-expect-error
  pixiApp.value = undefined;
});

useEventListener(
  'resize',
  throttle(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    pixiApp.value.renderer.resize(width, height);
  }, 50)
);
</script>

<template>
  <canvas ref="canvas" />
</template>
