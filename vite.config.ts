import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env': env
    },
    resolve: {
      alias: {
        '@app': '/src/app',
        '@components': '/src/components',
        '@pages': '/src/pages',
        '@layouts': '/src/layouts',
        '@services': '/src/services',
        '@api': '/src/api',
        '@models': '/src/models',
        '@state': '/src/state',
        '@shared': '/src/shared',
        '@theme': '/src/theme',
        '@mocks': '/src/mocks',
        '@assets': '/src/assets',
        '@styles': '/src/styles'
      }
    },
    server: {
      port: 5173
    }
  };
});
