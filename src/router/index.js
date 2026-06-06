import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import TokensCalculator from '@/views/TokensCalculator.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/tokens-calculator', component: TokensCalculator },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
