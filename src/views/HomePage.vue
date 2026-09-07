<template>
  <div
    class="mx-auto flex max-w-5xl flex-col items-center px-4 py-8 text-center sm:px-6 lg:px-8"
  >
    <h1 class="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-5xl mb-3">
      Webcam <span class="text-amber-400">Tools</span>
    </h1>
    <p class="max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
      Herramientas inteligentes creadas para facilitar la gestión de modelos,
      estudios y transmisiones en un solo lugar.
    </p>

    <div class="mt-8 w-full max-w-2xl space-y-4">
      <RouterLink
        v-for="route in routes"
        :key="route.path"
        :to="route.path"
        class="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-left text-slate-100 transition hover:border-amber-400/80 hover:bg-slate-900 shadow-sm"
        data-cuelume-press
      >
        <div class="rounded-xl bg-slate-950/80 p-3 border border-slate-800 group-hover:border-amber-400/40 transition">
          <component
            :is="route.meta.icon"
            class="shrink-0 w-7 h-7 text-amber-400"
          />
        </div>
        <div class="min-w-0 flex-1">
          <h5 class="mb-1 text-base font-semibold group-hover:text-amber-300 transition">
            {{ route.meta.title }}
          </h5>
          <p class="text-sm text-slate-400 leading-relaxed">
            {{ route.meta.description }}
          </p>
        </div>
        <BiChevronRight
          class="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0"
        />
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import BiChevronRight from '~icons/bi/chevron-right';

const router = useRouter();
const routes = router
  .getRoutes()
  .filter((route) => route.path !== '/' && route.meta.title);
</script>
