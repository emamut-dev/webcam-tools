<template>
  <div
    class="mx-auto flex max-w-5xl flex-col items-center px-4 py-8 text-center sm:px-6 lg:px-8"
  >
    <p class="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
      Herramientas inteligentes creadas para facilitar la gestión de modelos,
      estudios y transmisiones en un solo lugar.
    </p>

    <div class="mt-8 w-md max-w-85 md:max-w-2xl space-y-3">
      <RouterLink
        v-for="route in routes"
        :key="route.path"
        :to="route.path"
        class="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 mt-6 text-left text-slate-100 transition hover:border-amber-400 hover:bg-slate-800"
        data-cuelume-press
      >
        <component
          :is="route.meta.icon"
          class="shrink-0 w-8 h-8 text-amber-400"
        />
        <div class="min-w-0 flex-1">
          <h5 class="mb-1 text-base font-semibold">{{ route.meta.title }}</h5>
          <p class="text-sm text-slate-400">
            {{ route.meta.description }}
          </p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const routes = router
  .getRoutes()
  .filter((route) => route.path !== '/' && route.meta.title);
</script>
