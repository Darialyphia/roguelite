import './styles/global.css';
import 'open-props/postcss/style';
import 'open-props/colors-hsl';

import { routes, handleHotUpdate } from 'vue-router/auto-routes';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
const router = createRouter({
  history: createMemoryHistory(),
  routes
});

app.use(router);
app.mount('#app');

if (import.meta.hot) {
  handleHotUpdate(router);
}
