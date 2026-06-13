<script setup>
import { ref } from 'vue';

const menuItems = ref([
  { label: 'Inicio', path: '/' },
  {
    label: '<i class="bi bi-stopwatch"></i> Cuenta Rregresiva',
    path: '/timer',
  },
  // { label: 'Tags', path: '/tags' },
  {
    label: '<i class="bi bi-calculator"></i> Calculadora de Tokens',
    path: '/tokens-calculator',
  },
]);
</script>

<template>
  <nav
    class="navbar navbar-expand-lg nav-underline bg-dark sticky-top border-bottom border-body"
    data-bs-theme="dark"
  >
    <div class="container-fluid">
      <RouterLink class="navbar-brand text-warning fw-bold" to="/"
        >Webcam Tools</RouterLink
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-for="item in menuItems" :key="item.path">
            <RouterLink
              :to="item.path"
              class="nav-link"
              active-class="active"
              v-html="item.label"
            >
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
