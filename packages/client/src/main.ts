import './styles/global.css';
import 'open-props/postcss/style';
import 'open-props/colors-hsl';

import { createApp } from 'vue';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);

const router = createRouter({
  history: createMemoryHistory(),
  routes
});

const pinia = createPinia();

app.use(router);
app.use(pinia);
app.mount('#app');

if (import.meta.hot) {
  handleHotUpdate(router);
}
