// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://adrismate-website-astro.pages.dev',
  base: '',
  vite: {
    assetsInclude: ['**/*.jpg', '**/*.png', '**/*.mp4'],
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  },
});