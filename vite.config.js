import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [
    vue(),
    Icons({
      compiler: 'vue3',
      defaultStyle: 'font-size: 0.7em',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist', // Netlify apunta aquí
  },
});
