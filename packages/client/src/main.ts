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
    useAssetsProvider(app);
  }
});
app.mount('#app');

if (import.meta.hot) {
  handleHotUpdate(router);
}
