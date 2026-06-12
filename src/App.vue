<script setup>
import Menu from '@/components/menu.vue';
import Footer from '@/components/footer.vue';
</script>

<template>
  <Menu />
  <!-- <div class="container min-vh-100"> -->
  <div class="container">
    <router-view />
  </div>
  <Footer />
</template>
