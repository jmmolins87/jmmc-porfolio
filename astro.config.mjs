// @ts-check
import { defineConfig } from 'astro/config';
import path from 'node:path';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://jmmc.vercel.app',
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES', en: 'en-US' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    build: {
      rolldownOptions: {
        external: ['bcryptjs'],
      },
    },
  },
});
