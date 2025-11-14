import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  base: '/hydra-dashboard/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
    server: {
    proxy: {
      '/hydra-api': {
        target: 'https://hydra-api.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hydra-api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})


