/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

import type { SceneConstructor } from '@/shared/types';

declare module 'vue-router' {
  interface RouteMeta {
    scene?: SceneConstructor;
  }
}
