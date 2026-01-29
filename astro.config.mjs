import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sobavn.com',

  output: 'static', // SSG mode cho Cloudflare Pages

  vite: {
    plugins: [tailwindcss()]
  },

  build: {
    inlineStylesheets: 'auto',
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  compressHTML: true,
});
