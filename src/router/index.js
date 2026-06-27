import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import TokensCalculator from '@/views/TokensCalculatorPage.vue';
import Tags from '@/views/TagsPage.vue';
import Timer from '@/views/TimerPage.vue';
import BiStopwatch from '~icons/bi/stopwatch';
import BiCalculator from '~icons/bi/calculator';

const routes = [
  { path: '/', component: HomePage, meta: { title: 'Inicio' } },
  {
    path: '/timer',
    component: Timer,
    meta: {
      title: 'Cuenta Regresiva',
      description:
        '    Configura el tiempo de cada room y tus descansos fácilmente.',
      icon: BiStopwatch,
    },
  },
  {
    path: '/tokens-calculator',
    component: TokensCalculator,
    meta: {
      title: 'Calculadora de Tokens',
      description:
        '    Ingresa los datos y calcula las ganancias de modelo y estudio al instante.',
      icon: BiCalculator,
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
