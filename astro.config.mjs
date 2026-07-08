import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://proposito-ser-uno.vercel.app/',
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
