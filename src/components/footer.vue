<template>
  <footer
    class="mx-auto mt-10 max-w-7xl border-t border-slate-800 px-4 py-6 text-sm text-slate-400 sm:px-6 lg:px-8"
  >
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="flex items-center gap-2">
        Derechos reservados
        <BiCircle class="text-amber-400 w-4 h-4" />
        {{ year }}
        Webcam Tools.
      </p>
      <p class="flex items-center gap-2 sm:justify-end">
        Powered by
        <a
          class="text-amber-400"
          href="https://emamut.netlify.app/"
          target="_blank"
        >
          <img src="../assets/logo-emamut-mini.png" alt="emamut" class="w-24" />
        </a>
      </p>
    </div>
  </footer>
</template>

<script setup>
import BiCircle from '~icons/bi/c-circle';

const year = new Date().getFullYear();
</script>
