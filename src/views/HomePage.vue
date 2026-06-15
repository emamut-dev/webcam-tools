<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const routes = router
  .getRoutes()
  .filter((route) => route.path !== '/' && route.meta.title);
</script>

<template>
  <div class="container">
    <div class="row justify-content-center mt-4">
      <div class="col-md-6 text-center">
        <p class="lead">Tus herramientas webcam favoritas</p>
        <div class="list-group mt-4">
          <RouterLink
            v-for="route in routes"
            :key="route.path"
            :to="route.path"
            class="list-group-item list-group-item-action d-flex align-items-center bg-dark text-white gap-2 border-3 border-warning rounded-5 mb-3"
          >
            <i :class="route.meta.icon" class="fs-3 text-warning"></i>
            <div class="text-center w-100">
              <h5 class="mb-1">{{ route.meta.title }}</h5>
              <p class="mb-0 text-white-50">
                {{ route.meta.description }}
              </p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
