// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sobavn.com',

  vite: {
    plugins: [tailwindcss()]
  },

  // Build options
  build: {
    inlineStylesheets: 'auto',
  },

  // Prefetch links for better navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  // Image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  // Compress HTML
  compressHTML: true,
});