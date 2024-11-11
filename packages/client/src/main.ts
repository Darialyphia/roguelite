import './styles/global.css';
import 'open-props/postcss/style';
import 'open-props/colors-hsl';

import './utils/pixi-elements';

import { createApp } from 'vue';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';
import { useAssetsProvider } from './shared/composables/useAssets';
import { PixiPlugin } from 'gsap/PixiPlugin';
import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { MotionPathPlugin } from 'gsap/all';

// @ts-expect-error enables pixi devtools
window.PIXI = PIXI;
gsap.install(window);
gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes
});

const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use({
  install(app) {
    const assets = useAssetsProvider(app);
    assets.load();
  }
});
app.mount('#app');

if (import.meta.hot) {
  handleHotUpdate(router);
}
