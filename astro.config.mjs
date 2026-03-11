// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        // Usage: import Counter from '@/components/react/Counter'
        '@': '/src',
      },
    },
    css: {
      // Enable CSS modules for React components
      modules: {
        localsConvention: 'camelCase',
      },
    },
  },
});