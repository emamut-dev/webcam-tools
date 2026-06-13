import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import TokensCalculator from '@/views/TokensCalculator.vue';
import Tags from '@/views/Tags.vue';
import Timer from '@/views/Timer.vue';

const routes = [
  { path: '/', component: HomePage, meta: { title: 'Inicio' } },
  { path: '/timer', component: Timer, meta: { title: 'Cuenta Regresiva' } },
  {
    path: '/tokens-calculator',
    component: TokensCalculator,
    meta: { title: 'Calculadora de Tokens' },
  },
  { path: '/tags', component: Tags, meta: { title: 'Tags' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  const title = to.meta.title || 'Webcam Tools';
  document.title = `${title} { Webcam Tools } | emamut`;
});

export default router;
