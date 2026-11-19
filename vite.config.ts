import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({isSsrBuild}) => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    // Серверная сборка (dist-server) должна быть самодостаточной: функция на Vercel
    // загружает ее по пути, поэтому зависимости (react, lucide-react) вшиваются внутрь
    ssr: {
      noExternal: true as const,
    },
    build: {
      // Иконки и прочие файлы из public/ нужны только клиентской сборке
      copyPublicDir: !isSsrBuild,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
