<script setup>
import Menu from '@/components/menu.vue';
import Footer from '@/components/footer.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-950 text-slate-100">
    <Menu />
    <main class="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <router-view />
    </main>
    <Footer />
  </div>
</template>
