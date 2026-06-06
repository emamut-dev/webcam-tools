<script setup></script>
<template>
  <nav
    class="navbar navbar-expand-lg nav-underline bg-dark border-bottom border-body"
    data-bs-theme="dark"
  >
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">Webcam Tools</RouterLink>
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
          <li class="nav-item">
            <RouterLink
              to="/"
              class="nav-link"
              active-class="active"
              exact-active-class="active"
              >Inicio</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              to="/tokens-calculator"
              class="nav-link"
              active-class="active"
              >Calculadora de Tokens</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
