<script setup>
import Menu from '@/components/menu.vue';
</script>

<template>
  <Menu />
  <div class="container min-vh-100">
    <router-view />
  </div>
  <footer class="row">
    <div class="col text-center">
      <p class="text-white-50 mt-5 mb-3">
        <i class="bi bi-rocket-takeoff text-warning"></i> Powered by
        <a
          class="text-warning"
          href="https://emamut.netlify.app/"
          target="_blank"
          >emamut</a
        >
      </p>
    </div>
  </footer>
</template>
