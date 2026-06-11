import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import TokensCalculator from '@/views/TokensCalculator.vue';
import Tags from '@/views/Tags.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/tokens-calculator', component: TokensCalculator },
  { path: '/tags', component: Tags },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
