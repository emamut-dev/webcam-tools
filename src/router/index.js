import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import TokensCalculator from '@/views/TokensCalculatorPage.vue';
import Tags from '@/views/TagsPage.vue';
import Timer from '@/views/TimerPage.vue';

const routes = [
  { path: '/', component: HomePage, meta: { title: 'Inicio' } },
  {
    path: '/timer',
    component: Timer,
    meta: {
      title: 'Cuenta Regresiva',
      description: 'Configura temporizadores personalizados',
      icon: 'bi bi-stopwatch',
    },
  },
  {
    path: '/tokens-calculator',
    component: TokensCalculator,
    meta: {
      title: 'Calculadora de Tokens',
      description: 'Calcula y estima tokens de texto',
      icon: 'bi bi-calculator',
    },
    // },
    // {
    //   path: '/tags',
    //   component: Tags,
    //   meta: {
    //     title: 'Tags',
    //     description: 'Administra tus etiquetas personalizadas',
    //     icon: 'bi bi-tag',
    //   },
  },
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
