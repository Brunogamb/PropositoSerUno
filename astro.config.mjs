// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://github.com/Brunogamb/',
  base: '/PropositoSerUno/',
  vite: {
    build: {
      sourcemap: false,
    },
    css: {
      devSourcemap: false,
    },
  },
});
