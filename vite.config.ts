import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

// https://vite.dev/config/
export default defineConfig({
  base: '/phase-10-web-companion/',
  plugins: [
    react(),
    istanbul({
      cypress: false,
      requireEnv: false,
      exclude: ['node_modules', 'tests', 'playwright.config.ts'],
      extension: ['.js', '.ts', '.jsx', '.tsx'],
    }),
  ],
});
