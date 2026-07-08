import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://propositoseruno.com/',
  base: '/',
  vite: {
    build: {
      sourcemap: false,
    },
    css: {
      devSourcemap: false,
    },
  },
});
