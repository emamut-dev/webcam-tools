import { createApp } from 'vue';
import router from './router/';
import App from './App.vue';

import { bind } from 'cuelume';

import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';

import './style.css';

createApp(App).use(router).mount('#app');

bind();
