// astro.config.mjs
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'static',
  site: 'https://sobavn.netlify.app',

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    inlineStylesheets: 'auto',
  },

  // 🚫 Tắt prefetch aggressive
  prefetch: {
    prefetchAll: false,
  },

  // 🚫 Không dùng sharp trên Netlify
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },

  compressHTML: true,
})
