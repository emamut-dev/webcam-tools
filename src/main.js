import { createApp } from 'vue';
import router from './router/';

import 'bootstrap-icons/font/bootstrap-icons.css';

import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';

import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './style.css';

createApp(App).use(router).mount('#app');
