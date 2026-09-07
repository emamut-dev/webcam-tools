<template>
  <nav
    class="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 text-slate-100 backdrop-blur"
  >
    <div
      class="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
    >
      <RouterLink
        class="text-lg font-semibold tracking-wide text-amber-400"
        to="/"
        data-cuelume-press
      >
        Webcam Tools
      </RouterLink>

      <button
        class="inline-flex items-center rounded-md border border-slate-700 p-2 text-slate-200 md:hidden"
        type="button"
        aria-label="Toggle navigation"
        @click="toggleMenu"
      >
        <svg
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <div class="w-full md:flex md:w-auto md:items-center">
        <ul
          :class="[
            'flex-col gap-1 md:flex md:flex-row md:items-center md:gap-2 p-2 md:p-0 rounded-2xl bg-slate-900/90 md:bg-transparent border border-slate-800 md:border-0 mt-3 md:mt-0',
            isMenuOpen ? 'flex' : 'hidden md:flex',
          ]"
        >
          <li v-for="item in menuItems" :key="item.path">
            <RouterLink
              :to="item.path"
              class="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-amber-400 hover:bg-slate-800/60 md:hover:bg-transparent"
              active-class="text-amber-400 font-semibold bg-slate-800/80 md:bg-transparent md:border-b-2 md:border-amber-400 md:rounded-b-none"
              @click="isMenuOpen = false"
              data-cuelume-press
            >
              <component
                v-if="item.icon"
                :is="item.icon"
                class="me-1.5 w-4 h-4"
              />
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import BiStopwatch from '~icons/bi/stopwatch';
import BiCalculator from '~icons/bi/calculator';

const menuItems = ref([
  { label: 'Inicio', path: '/' },
  {
    label: 'Calculadora de Tokens',
    path: '/tokens-calculator',
    icon: BiCalculator,
  },
  {
    label: 'Cuenta Regresiva',
    path: '/timer',
    icon: BiStopwatch,
  },
]);

const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>
