<script setup>
import Menu from '@/components/menu.vue';
import Footer from '@/components/footer.vue';
</script>

<template>
  <Menu />
  <div class="container mx-auto" id="main-container">
    <router-view />
  </div>
  <Footer />
</template>

<style>
#main-container {
  min-height: 75vh;
}
</style>
